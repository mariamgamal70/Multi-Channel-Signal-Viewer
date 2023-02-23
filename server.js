const port = 5501;

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
const PDFDocument = require('pdfkit');
const Papa = require("papaparse");

/*USING MIDDLEWARES*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true })); 
app.use(cors());

/*CONNECTS STATIC FILES TO BACKEND */
app.use(express.static("website"));

/*ENDPOINTS*/
// app.post("/", upload.fields([{name:"firstsignalinput", maxCount: 1},{name:"secondsignalinput", maxCount: 1}]), (req, res) => {
//     if (req.files["firstsignalinput"]) {
//         let firstFile = req.files["firstsignalinput"][0];
//         let fileExtension = path.extname(firstFile.originalname);
//         let firstResultObj = [];
//         let firstResultArr = [];
//             if (fileExtension == ".csv") {//data is an array of objects
//                 fs.createReadStream(firstFile.path)
//                     .pipe(csv())
//                     .on("data", (data) => {
//                         firstResultObj.push(data)})
//                     .on("end", () => {
//                     // Do something with the parsed CSV data
//                     firstResultArr = firstResultObj.map((obj) => Object.values(obj).map(Number));//2 for loops
//                     res.send(firstResultArr);
//                     });
//                 }
//             } 
//             else if (req.files["secondsignalinput"]) {
//                 let secondFile = req.files["secondsignalinput"][0];
//                 let fileExtension = path.extname(secondFile.originalname);
//                 let secondResultObj = [];
//                 let secondResultArr = [];
//                 if (fileExtension == ".csv") {
//                     fs.createReadStream(secondFile.path)
//                         .pipe(csv())
//                         .on("data", (data) => secondResultObj.push(data))
//                         .on("end", () => {
//                     // Do something with the parsed CSV data
//                     secondResultArr = secondResultObj.map((obj) => Object.values(obj).map(Number));
//                     res.send(secondResultArr);
//                     });
//                 }
//             }
//         });

app.post("/", upload.fields([{ name: "firstsignalinput", maxCount: 1 }, { name: "secondsignalinput", maxCount: 1 }]), (req, res) => {
    const firstFile = req.files["firstsignalinput"] ? req.files["firstsignalinput"][0] : null;
    const secondFile = req.files["secondsignalinput"] ? req.files["secondsignalinput"][0] : null;
    const file = firstFile || secondFile;
    if (file) {
    const fileExtension = path.extname(file.originalname);
    if (fileExtension === ".csv") {
        const resultArr = [];
        fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", (data) => {
            resultArr.push(Object.values(data).map(Number));
        })
        .on("end", () => {
            res.send(resultArr);
        });
    }
    } else {
    res.status(400).send("No file uploaded");
    }
});

app.post("/download",(req,res)=>{
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream("output.pdf"));
    doc.fontSize(20).text(JSON.stringify(req.body));
    doc.end();
    res.download("output.pdf");
});

app.post("/addSignal",upload.fields([{ name: "firstsignaladdchannelinput"}, { name: "secondsignaladdchannelinput"}]),(req,res)=>{
    let firstsignalchannelfile = req.files["firstsignaladdchannelinput"]?req.files["firstsignaladdchannelinput"][0]:null;
    let secondsignalchannelfile=req.files["secondsignaladdchannelinput"]?req.files["secondsignaladdchannelinput"][0]:null;
    let channelFile=firstsignalchannelfile || secondsignalchannelfile;
    if(channelFile){
    let fileExtension = path.extname(channelFile.originalname);
    if (fileExtension == ".csv") {
        let channelArr=[];
        fs.createReadStream(channelFile.path)
        .pipe(csv())
        .on("data", (data) => channelArr.push(Object.values(data).map(Number)))
        .on("end", () => {
            res.send(channelArr);
        });
    } 
    } else {
    res.status(400).send("No file uploaded");
    }
})

app.listen(port, () => {console.log(`server is on http://localhost:${port}`);});

