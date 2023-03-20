require("dotenv").config();
const express = require("express");
const Person = require("./models/persons");
var morgan = require("morgan");
const cors = require("cors");
const app = express();
app.use(express.static("build"));
app.use(cors());

morgan.token("bodyPost", function getId(req) {
	return req.id;
});

app.use(
	morgan(function (tokens, req, res) {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, "content-length"),
			"-",
			tokens["response-time"](req, res),
			"ms",
			JSON.stringify(req.body),
		].join(" ");
	})
);

app.use(express.json());

app.get("/api/persons", (request, response) => {
	Person.find({}).then((result) => {
		response.json(result);
	});
});
app.post("/api/persons", (request, response) => {
	const body = request.body;
	const newPerson = new Person({
		name: body.name,
		number: body.number,
	});
	if (!newPerson.name || !newPerson.number) {
		response.status(409).send({ error: "missing name or phone" });
	}

	/*
  //VER COMO ENCONTAR UN NOMBRE REPETIDO SIN LLAMAR TODA LA LISTA
  
  if (newPerson.some((person) => newPerson.name === person.name)) {
    response
      .status(409)
      .send({ error: "this name already exist in the guide" });
  }
   */
	newPerson.save().then((result) => {
		console.log("new person added");
		response.json(newPerson);
	});
});
app.get("/api/persons/:id", (request, response) => {
	let id = request.params.id;
	Person.findById(id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).send({ error: "unknown person" });
			}
		})
		.catch((error) => {
			console.log("error searching:", error.message);
			response.status(404).send({ error: "unknown person" });
		});
});
app.delete("/api/persons/:id", (request, response) => {
	let id = request.params.id;
	Person.findByIdAndRemove(id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});
app.put("/api/persons/:id", (request, response) => {
	let id = Number(request.params.id);
	let person = persons.find((person) => person.id === id);
	person.number = request.body.number;
	response.json(person);
});

app.get("/info", (request, response) => {
	let cantPersons = persons.length;
	let actualDate = new Date();
	response.send(
		`<p>the guide has info for ${cantPersons} people</p> <p>${actualDate} </p>`
	);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
