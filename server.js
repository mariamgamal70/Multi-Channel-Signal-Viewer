const port = 5501;
let firstResultObj = [];
let firstResultArr = [];
let secondResultObj = [];
let secondResultArr= [];

/*INCLUDE MODULES*/
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); //dest is a property in multer has full path and name of file
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const app = express();

/*USING MIDDLEWARES*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true })); 
app.use(cors());

/*CONNECTS STATIC FILES TO BACKEND */
app.use(express.static("website"));

/*ENDPOINTS*/
app.post("/", upload.fields([{name:"firstsignalinput", maxCount: 1},{name:"secondsignalinput", maxCount: 1}]), (req, res) => {
    if (req.files["firstsignalinput"]) {
        let firstFile = req.files["firstsignalinput"][0];
        let fileExtension = path.extname(firstFile.originalname);
            if (fileExtension == ".csv") {//data is an array of objects
                fs.createReadStream(firstFile.path)
                    .pipe(csv())
                    .on("data", (data) => {
                        firstResultObj.push(data)})
                    .on("end", () => {
                    // Do something with the parsed CSV data
                    firstResultArr = firstResultObj.map((obj) => Object.values(obj).map(Number));//2 for loops
                    res.send(firstResultArr);
                    });
                }
            } 
            else if (req.files["secondsignalinput"]) {
                let secondFile = req.files["secondsignalinput"][0];
                let fileExtension = path.extname(secondFile.originalname);
                if (fileExtension == ".csv") {
                    fs.createReadStream(secondFile.path)
                        .pipe(csv())
                        .on("data", (data) => secondResultObj.push(data))
                        .on("end", () => {
                    // Do something with the parsed CSV data
                    secondResultArr = secondResultObj.map((obj) => Object.values(obj).map(Number));
                    res.send(secondResultArr);
                    });
                }
            }
        });
/*upload.single('file') -> file in here is supposed to be file name, next is a reference to the next middleware in the chain (chains middleware)*/
app.listen(port, () => {console.log(`server is on http://localhost:${port}`);});

//npm install express
//npm install corst
//npm install body-parser
//npm install node
//npm install fs
//npm install csv-parser
//npm install path
//npm install plotly.js
//npm install binary-parser
//start server using node -serversidefilename-
