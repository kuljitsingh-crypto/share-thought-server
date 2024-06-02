require("dotenv").config();
const express = require("express");
const router = require("./apiRouter");
const cookieParser = require("cookie-parser");
const { wellKnownRouter } = require("./wellKnownRouter");
const app = express();
const PORT = parseInt(process.env.PORT || "3500", 10);

app.use(cookieParser());
app.use(
  express.json({ limit: "100mb", type: ["json", "application/csp-report"] })
);
app.use("/.well-known", wellKnownRouter);
// It is required to read user Ip address.
app.set("trust proxy", true);
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`server listening on port:${PORT}`);
});
