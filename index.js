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
app.post("/api/persons", (request, response, next) => {
	const body = request.body;
	const newPerson = new Person({
		name: body.name,
		number: body.number,
	});
	if (!newPerson.name || !newPerson.number) {
		response.status(409).send({ error: "missing name or phone" });
	}

	newPerson
		.save()
		.then(() => {
			console.log("new person added");
			response.json(newPerson);
		})
		.catch((error) => next(error));
});
app.get("/api/persons/:id", (request, response, next) => {
	let id = request.params.id;
	Person.findById(id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).send({ error: "unknown person" });
			}
		})
		.catch((error) => next(error));
});
app.delete("/api/persons/:id", (request, response, next) => {
	let id = request.params.id;
	Person.findByIdAndRemove(id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});
app.put("/api/persons/:id", (request, response, next) => {
	let id = request.params.id;
	const person = {
		name: request.body.name,
		number: request.body.number,
	};
	Person.findByIdAndUpdate(id, person, { new: true })
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

app.get("/info", (request, response) => {
	Person.find({}).then((result) => {
		let cantPersons = result.length;
		let actualDate = new Date();
		response.send(
			`<p>the guide has info for ${cantPersons} people</p> <p>${actualDate} </p>`
		);
	});
});

// eslint-disable-next-line no-undef
const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);
