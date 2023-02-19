const port = 5500;
let normalResults = [];
let abnormalResults = [];

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
app.post("/", upload.fields([{name:"normalsignalinput", maxCount: 1},{name:"abnormalsignalinput", maxCount: 1}]), (req, res) => {
    if (req.files["normalsignalinput"]) {
        let normalFile = req.files["normalsignalinput"][0];
        let fileExtension = path.extname(normalFile.originalname);
            if (fileExtension == ".csv") {//data is an array of objects
                fs.createReadStream(normalFile.path)
                    .pipe(csv())
                    .on("data", (data) => normalResults.push(data))
                    .on("end", () => {
                    // Do something with the parsed CSV data
                    console.log(normalResults);
                    res.status(200).send(`Uploaded file '${normalFile.originalname}' was processed successfully`);
                    });
                }
            } 
            else if (req.files["abnormalsignalinput"]) {
                let abnormalFile = req.files["abnormalsignalinput"][0];
                let fileExtension = path.extname(abnormalFile.originalname);
                if (fileExtension == ".csv") {
                    fs.createReadStream(abnormalFile.path)
                        .pipe(csv())
                        .on("data", (data) => abnormalResults.push(data))
                        .on("end", () => {
                    // Do something with the parsed CSV data
                    console.log(abnormalResults);
                    res.status(200).send(`Uploaded file '${abnormalFile.originalname}' was processed successfully`);
                    });
                }
            }
        });
/*upload.single('file') -> file in here is supposed to be file name, next is a reference to the next middleware in the chain (chains middleware)*/
app.listen(port, () => {console.log(`server is on http://localhost:${port}`);});

//npm install express
//npm install cors
//npm install body-parser
//npm install node
//npm install fs
//npm install csv-parser
//npm install path
//npm install plotly.js
//npm install binary-parser
//start server using node -serversidefilename-
