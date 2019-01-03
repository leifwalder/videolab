/* tslint:disable:no-console */
/* tslint:disable:no-shadowed-variable */
const express = require("express");
const cors = require("cors");

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

const app = express();

const fetch = require("node-fetch");

const corsOptions = {
  origin: "https://yourdomain.com"
};

app.get("/with-cors", cors(corsOptions), (req, res, next) => {
  fetch("https://sela-test.herokuapp.com/assets/hkzxv.json")
    .then(res => res.json())
    .then(json => {
      console.log(json);
      res.json({ ...json });
    });
});

app.use(express.static(__dirname + "/build")); //Serves resources from public folder

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
/* tslint:enable:no-shadowed-variable */
/* tslint:enable:no-console */
