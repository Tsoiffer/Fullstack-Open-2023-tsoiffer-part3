const express = require("express");
const app = express();

app.use(express.json());
let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

const generateId = () => {
  const maxId = 10000;
  return Math.floor(Math.random() * maxId);
};

app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.post("/api/persons", (request, response) => {
  const body = request.body;
  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  if (!newPerson.name || !newPerson.number) {
    response.status(409).send({ error: "missing name or phone" });
  }
  if (persons.some((person) => newPerson.name === person.name)) {
    response
      .status(409)
      .send({ error: "this name already exist in the guide" });
  }
  persons = persons.concat(newPerson);
  console.log(persons);
  response.json(newPerson);
});
app.get("/api/persons/:id", (request, response) => {
  let id = Number(request.params.id);
  let person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).send({ error: "unknown person" });
  }
});
app.delete("/api/persons/:id", (request, response) => {
  let id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  console.log(persons);
  response.status(204).end();
});

app.get("/info", (request, response) => {
  let cantPersons = persons.length;
  let actualDate = new Date();
  response.send(
    `<p>the guide has info for ${cantPersons} people</p> <p>${actualDate} </p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
