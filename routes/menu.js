const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");
const Order = require("../models/order");
const Person = require("../models/person");

router.get("/create", async (req, res) => {
  res.render("createmenu", { user: req.user });
});

router.post("/", async (req, res) => {
  req.body.is_drink = req.body.is_drink === "on";
  const menu = await Menu.create(req.body);
  res.redirect("/menu");
});

router.get("/", async (req, res) => {
  const menuItems = await Menu.find({});
  res.render("menu", { user: req.user, menuItems });
});






// extra code ----
router.get("/:tasteType", async (req, res) => {
  const tasteType = req.params.tasteType;

  if (
    tasteType == "sweet" ||
    tasteType == "spicy" ||
    tasteType == "sour" ||
    tasteType == "bitter" ||
    tasteType == "salty"
  ) {
    const items = await Menu.find({ taste: tasteType });
    return res.status(200).json(items);
  }
});

module.exports = router;
