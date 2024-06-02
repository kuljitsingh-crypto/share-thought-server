const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "assetlinks.json");

router.get("/assetlinks.json", (req, res) => {
  res.sendFile(filePath);
});
module.exports.wellKnownRouter = router;
