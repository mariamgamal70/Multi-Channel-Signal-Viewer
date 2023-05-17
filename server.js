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
const { promisify } = require("util");
const { stat } = require("fs");
const plotly = require("plotly");

/*USING MIDDLEWARES*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/*CONNECTS STATIC FILES TO BACKEND */
app.use(express.static("website"));

/*ENDPOINTS*/
/*uploading files endpoint */
app.post(
  "/",
  upload.fields([
    { name: "firstsignalinput", maxCount: 1 },
    { name: "secondsignalinput", maxCount: 1 },
  ]),
  (req, res) => {
    const firstFile = req.files["firstsignalinput"]
      ? req.files["firstsignalinput"][0]
      : null;
    const secondFile = req.files["secondsignalinput"]
      ? req.files["secondsignalinput"][0]
      : null;
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
  }
);

/*downloading pdf endpoint*/
app.post("/download", async (req, res) => {
  const doc = new PDFDocument({ margin: 30, size: "A4" });
  doc.pipe(fs.createWriteStream("./output.pdf"));
  // Set the file name dynamically based on the current working directory
  const filePath = path.join(process.cwd(), "output.pdf");
  // Create the table of signal statistics
  const signals1 = req.body.statistics1; //arr of objects
  const signals2 = req.body.statistics2; //arr of objects
  const signalsArr = [signals1, signals2];

  const table = {
    title: " ",
    //subtitle: "Multi-Channel Signal Viewer Statistics",
    headers: [
      "Minimum",
      "Maximum",
      "Variance",
      "Standard deviation",
      "Average",
      "duration",
    ],
    rows: signalsArr.flatMap((signals) =>
      signals.map((signal) => [
        signal.min.toFixed(2),
        signal.max.toFixed(2),
        signal.var.toFixed(2),
        signal.std.toFixed(2),
        signal.avg.toFixed(2),
        signal.duration.toFixed(2),
      ])
    ),
  };

  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("Multi-Channel Signal Viewer ", {
      align: "center",
      margin: [0, 0, 0, 20],
    });

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Signals Statistics", {
      align: "center",
      margin: [0, 0, 0, 10],
    });

  await doc.table(table, {
    width: 500,
  });
  // Set the cursor position to the top of the page
  doc.x = doc.page.margins.left;
  doc.y = doc.page.margins.top;
  // Add images only if the data for both signals is present
  if (req.body.img1) {
    doc.y = 300;
    doc.x = 0;
    doc.save(); // Save the current graphics state
    doc.rect(doc.x, doc.y, 235, 177).clip(); // Clip the rectangular region
    doc.image(req.body.img1, { width: 300 });//keep this only if u dont need to crop
    doc.restore(); // Restore the graphics state to remove the clip
  }
  if (req.body.img2) {
    doc.y = 300;
    doc.x += 295;
    doc.save(); // Save the current graphics state
    doc.rect(doc.x, doc.y, 235, 177).clip(); // Clip the rectangular region
    doc.image(req.body.img2, { width: 300 }); //keep this only if u dont need to crop
    doc.restore(); // Restore the gr
  }
  // End the document to save it to a file
  doc.end();
  res.setHeader("Content-Type", "application/pdf");
  const fileInfo = promisify(stat);
  const size = await fileInfo(filePath);
  res.setHeader("Content-Length", size);
  setTimeout(() => {
    res.setHeader("Content-Disposition", "attachment; filename=output.pdf");
    res.sendFile(filePath);
  }, 1000);
});

/*add channel endpoint */
app.post(
  "/addChannel",
  upload.fields([
    { name: "firstsignaladdchannelinput" },
    { name: "secondsignaladdchannelinput" },
  ]),
  (req, res) => {
    let firstsignalchannelfile = req.files["firstsignaladdchannelinput"]
      ? req.files["firstsignaladdchannelinput"][0]
      : null;
    let secondsignalchannelfile = req.files["secondsignaladdchannelinput"]
      ? req.files["secondsignaladdchannelinput"][0]
      : null;
    let channelFile = firstsignalchannelfile || secondsignalchannelfile;
    if (channelFile) {
      let fileExtension = path.extname(channelFile.originalname);
      if (fileExtension == ".csv") {
        let channelArr = [];
        fs.createReadStream(channelFile.path)
          .pipe(csv())
          .on("data", (data) =>
            channelArr.push(Object.values(data).map(Number))
          )
          .on("end", () => {
            res.send(channelArr);
          });
      }
    } else {
      res.status(400).send("No file uploaded");
    }
  }
);

app.listen(port, () => {
  console.log(`server is on http://localhost:${port}`);
});
