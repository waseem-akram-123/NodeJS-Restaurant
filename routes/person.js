const express = require("express");
const router = express.Router();
const Person = require("../models/person");

const { createTokenUser, validateToken } = require("../service/auth");

// router.post ("/", async (req,res)=> {
//     const body = req.body;

//     const person = await Person.create ({
//         name: body.name,
//         age: body.age,
//         work: body.work,
//         mobile: body.moblile,
//         email: body.email,
//         address: body.address,
//         salary: body.salary
//     });

//     return res.status(200).json (person);
// });

router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

router.get("/signin", (req, res) => {
  res.render("signin", { user: req.user });
});

router.post("/signup", async (req, res) => {
  const person = await Person.create(req.body);
  //   res.status(200).json(person);
  res.redirect("/");
});

// router.post ("/signin", async (req,res)=> {
//     const {email,password} = req.body;
//     const person = await Person.findOne ({email,password});

//     const token = createTokenUser (person);
//     console.log ("token :", token);
// })

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const person = await Person.findOne({ email });
  if (!person) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isMatch = await person.comparepassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = createTokenUser(person); // person is already the current doc

  res.cookie("token", token); // always comes 1st

  res.redirect("/");

//   res.status(200).json({ token }); // 2nd

});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

router.get("/", async (req, res) => {
  const allPerson = await Person.find({});
  return res.status(200).json(allPerson);
});

router.get("/:workType", async (req, res) => {
  const workType = req.params.workType;

  if (workType == "chef" || workType == "waiter" || workType == "manager") {
    const persons = await Person.find({ work: workType });
    return res.status(200).json(persons);
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  const person = await Person.findByIdAndUpdate(id, body, {
    new: true, // return the updated document
    runValidators: true, // Run Mongoose validation
  });
  return res.status(200).json(person);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  const person = await Person.findByIdAndDelete(id);

  // return res.status(200).json ({person, message: "this person is deleted is successfully"});
  return res
    .status(200)
    .json({ message: "This person was deleted successfully", person: person });
});

module.exports = router;
