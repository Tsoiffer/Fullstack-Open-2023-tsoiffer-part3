const mongoose = require("mongoose");
// eslint-disable-next-line no-undef
if (process.argv.length < 3) {
	console.log(
		"Please provide the password as an argument: node mongo.js <password>"
	);
	// eslint-disable-next-line no-undef
	process.exit(1);
}
// eslint-disable-next-line no-undef
const password = process.argv[2];
const dataBase = "phonoguide-db";
const url = `mongodb://tsoiffer:${password}@ac-m3chx85-shard-00-00.1go69cb.mongodb.net:27017,ac-m3chx85-shard-00-01.1go69cb.mongodb.net:27017,ac-m3chx85-shard-00-02.1go69cb.mongodb.net:27017/${dataBase}?ssl=true&replicaSet=atlas-96qy2k-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", noteSchema);
// eslint-disable-next-line no-undef
if (process.argv.length === 3) {
	console.log("phonebook:");
	Person.find({}).then((result) => {
		result.forEach((person) => {
			console.log(`${person.name} ${person.number}`);
		});
		mongoose.connection.close();
		// eslint-disable-next-line no-undef
		process.exit(1);
	});
}
// eslint-disable-next-line no-undef
if (process.argv.length === 5) {
	const person = new Person({
		// eslint-disable-next-line no-undef
		name: process.argv[3],
		// eslint-disable-next-line no-undef
		number: process.argv[4],
	});
	person.save().then(() => {
		console.log(`added ${person.name} number ${person.number} to phonebook`);
		mongoose.connection.close();
		// eslint-disable-next-line no-undef
		process.exit(1);
	});
}
// eslint-disable-next-line no-undef
if (process.argv.length === 4 || process.argv.length > 5) {
	console.log("the number of arguments is wrong");
	// eslint-disable-next-line no-undef
	process.exit(1);
}
