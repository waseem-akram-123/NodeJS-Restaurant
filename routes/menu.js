const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");

router.post("/", async (req, res) => {
  const menu = await Menu.create(req.body);
  res.status(200).json(menu);
});

// router.get ("/", async (req,res)=> {
//     const allMenu = await Menu.find({});
//     return res.status(200).json(allMenu);
// });

router.get("/", async (req, res) => {
    if (!req.user) {
        return res.redirect("/person/signin");
    }
    const menuItems = await Menu.find({});
    res.render("menu", { user: req.user, menuItems });
});

module.exports = router;


router.get ("/:tasteType", async (req,res)=> {
    const tasteType = req.params.tasteType;

    if (tasteType == "sweet" || tasteType == "spicy" || tasteType == "sour" || tasteType == "bitter"|| tasteType == "salty"){
        const items = await Menu.find ({taste: tasteType});
        return res.status(200).json (items);
    }
});


module.exports = router;
