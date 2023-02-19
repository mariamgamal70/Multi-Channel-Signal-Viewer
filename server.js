const port = 5500;
const signals = {};
const originalSignal = [];
const modifiedSignal = [];
const results = [];
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
app.use(bodyParser.json()); // set the limit to 50 MB
app.use(bodyParser.urlencoded({extended: true })); /* used especially when making a form, return info in form of objects we can use ,with no complicated data thats why extended:false ,only return json data , not objects within objects*/
app.use(cors());

/*CONNECTS STATIC FILES TO BACKEND */
app.use(express.static("website"));

/*ENDPOINTS*/
app.post("/", upload.single("signalfile"), (req, res) => {
    if(!req.file){
        return res.status(400).send("No file uploaded");
    }
    else{
        const file = req.file; //multer reads the file and saves it in object called file
        const fileExtension = path.extname(file.originalname);
        console.log(file);
        if (fileExtension == ".csv") {
            //data is an array of objects
            fs.createReadStream(file.path)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => {
            // Do something with the parsed CSV data
            res.status(200).send(`Uploaded file '${file.originalname}' was processed successfully`);
            });
        }
    }
});
/*upload.single('file') -> file in here is supposed to be file name, next is a reference to the next middleware in the chain (chains middleware)*/
app.listen(port, () => {
  console.log(`server is on http://localhost:${port}`);
});

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
