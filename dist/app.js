"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv = require("dotenv");
var database_1 = require("./database");
// routes imports
var users_routes_1 = require("./routes/users.routes");
var auth_routes_1 = require("./routes/auth.routes");
dotenv.config();
// create and setup express app
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
database_1.Database.initialize();
// register routes
app.use("/users", users_routes_1.default);
app.use("/auth", auth_routes_1.default);
var port = process.env.PORT || 4000;
// start express server
app.listen(port, function () {
    return console.log("Server is running on http://localhost:" + port);
});
