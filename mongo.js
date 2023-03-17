const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}
const password = process.argv[2];
const dataBase = "phonoguide-db";
const url = `mongodb://tsoiffer:${password}@ac-m3chx85-shard-00-00.1go69cb.mongodb.net:27017,ac-m3chx85-shard-00-01.1go69cb.mongodb.net:27017,ac-m3chx85-shard-00-02.1go69cb.mongodb.net:27017/${dataBase}?ssl=true&replicaSet=atlas-96qy2k-shard-0&authSource=admin&retryWrites=true&w=majority`;

//mongodb+srv://tsoiffer:<password>@tsoiffercluster.1go69cb.mongodb.net/?retryWrites=true&w=majority
//`mongodb://tsoiffer:${password}@ac-m3chx85-shard-00-00.1go69cb.mongodb.net:27017,ac-m3chx85-shard-00-01.1go69cb.mongodb.net:27017,ac-m3chx85-shard-00-02.1go69cb.mongodb.net:27017/?ssl=true&replicaSet=atlas-96qy2k-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", noteSchema);

if (process.argv.length === 3) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
    process.exit(1);
  });
}
if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
    process.exit(1);
  });
}
if (process.argv.length === 4 || process.argv.length > 5) {
  console.log("the number of arguments is wrong");
  process.exit(1);
}
