require("dotenv").config();
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI;

mongoose.connect(url);

mongoose
	.connect(url)
	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

const noteSchema = new mongoose.Schema({
	name: { type: String, minlength: 3, required: true, unique: true },
	number: { type: String, minlength: 8, required: true },
});

noteSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});
noteSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Person", noteSchema);
