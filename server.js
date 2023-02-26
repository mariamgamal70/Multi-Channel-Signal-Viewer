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
//const PDFDocument = require('pdfkit');
const Papa = require("papaparse");
const PDFDocument = require("pdfkit-table");

/*USING MIDDLEWARES*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true })); 
app.use(cors());

/*CONNECTS STATIC FILES TO BACKEND */
app.use(express.static("website"));

/*ENDPOINTS*/
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
            console.log(resultArr);
            res.send(resultArr);
        });
    }
    } else {
    res.status(400).send("No file uploaded");
    }
});

app.post("/download",async(req,res)=>{
    // const doc = new PDFDocument();
    // doc.pipe(fs.createWriteStream("output.pdf"));
    let doc = new PDFDocument({ margin: 30, size: 'A4' });
    // save document
    doc.pipe(fs.createWriteStream("./output.pdf"));
    //doc.fontSize(20).text(JSON.stringify(req.body));
    console.log(req.body);
    const table = {
        title: "Signal Viewer",
        subtitle: "signals statistics",
        headers: [ "min", "max", "var" , "std", "avg" ],
        rows:[[req.body.min ,req.body.max, req.body.var, req.body.std, req.body.avg]]
        
      };
      await doc.table(table, { 
        width: 300,
      });
    
    doc.end();
    res.setHeader("Accept-Ranges", "none");
    res.sendFile("C:\\Users\\عبدالمنعملؤيعبدالمنع\\OneDrive - Cairo University - Students\\2nd year biomedical HEM\\DSP\\task1\\my task\\task1\\output.pdf");
    
});

app.post("/addChannel",upload.fields([{ name: "firstsignaladdchannelinput"}, { name: "secondsignaladdchannelinput"}]),(req,res)=>{
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

