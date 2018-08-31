const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');
const router = express.Router();


// db connection
 const mongoose = require('./db-connection/mongoose');


var app = express();

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//morgan to console user request
app.use(morgan('dev'))
app.use(cors());
const route = require("./route/appRoutes");

app.use("/api", route);

const PORT=process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
})