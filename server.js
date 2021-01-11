const express = require("express");
const connect = require("./config/db");

const userRoute = require("./routes/API/users");
const authRoute = require("./routes/API/auth");
const profileRoute = require("./routes/API/profile");
const postRoute = require("./routes/API/post");

const app = express();

connect();

app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/post", postRoute);

app.get("/", (req, res) => res.send("API running"));

PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
