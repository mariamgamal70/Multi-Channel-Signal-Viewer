const port = 5501;

/*INCLUDE MODULES*/
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); //dest is a property in multer has full path and name of file
const csv = require("csv-parser");
const fs = require("fs");
const {stat}  = require("fs");
const path = require("path");
const { promisify } = require("util");
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
            res.send(resultArr);
        });
    }
    } else {
    res.status(400).send("No file uploaded");
    }
});

app.post("/download", async (req, res) => {
  const doc = new PDFDocument({ margin: 30, size: 'A4' });
  doc.pipe(fs.createWriteStream("./output.pdf"));

  // Set the file name dynamically based on the current working directory
  const filePath = path.join(process.cwd(), 'output.pdf');        
  // Create the table of signal statistics
  const signals = req.body;
  const table = {
    title: "Signal Viewer",
    subtitle: "Signals Statistics",
    headers: ["min", "max", "var", "std", "avg", "duration"],
    rows: [[signals.min, signals.max, signals.var, signals.std, signals.avg, signals.duration]]
  };
  await doc.table(table, {
    width: 300
  });
  doc.image('15.png', 0, 15, {width: 300})
   .text('Proportional to width', 0, 0);
   doc.Plotly.Snapshot.toImage(gd, {format: 'png', width: 1000, height: 800})
  // End the document to save it to a file
  doc.end();

  res.setHeader('Content-Type', 'application/pdf');
  const fileInfo = promisify(stat);
  const size = await fileInfo(filePath);
  res.setHeader("Content-Length", size);
  //console.log(size);
  setTimeout(() => {
    res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');
    res.sendFile(filePath);
  }, 1000)
  
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

