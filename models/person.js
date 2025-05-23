const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const personSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    work: {
      type: String,
      enum: ["customer", "chef", "waiter", "manager"],
      required: true,
      default: "customer",
    },
    mobile: {
      type: String,
      required: true
    },
    age: {
      type: Number,
    },
    address: {
      type: String,
    },
    salary: {
      type: Number,
    },
  },
  { timestamps: true }
);

personSchema.pre("save", async function (next) {
  const person = this;

  if (!person.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(person.password, salt);
  person.password = hashedPassword;

  next();
});

personSchema.methods.comparepassword = async function (personPassword) {
  // we can even have passed email along with the password (password used for hashing, username used for creating a token by passing the user in createTokenUser)
  // i mean that this concept can also be done similar to Blogging project
  const isMatch = await bcrypt.compare(personPassword, this.password);
  return isMatch;
};

const Person = mongoose.model("persona", personSchema);

module.exports = Person;
