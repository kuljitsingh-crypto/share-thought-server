const express = require("express");
const userRouter = require("./controller/user/user.route");
const router = express.Router();

router.use("/user", userRouter);
module.exports = router;
