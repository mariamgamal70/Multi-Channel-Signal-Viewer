let firstSignalData;
let secondSignalData;

const firstUploadForm = document.getElementById("firstsignalform");
const secondUploadForm = document.getElementById("secondsignalform");

const firstSignalGraph = document.getElementById("firstsignalgraph");
const secondSignalGraph = document.getElementById("secondsignalgraph");

const firstInputElement = document.getElementById("firstsignalinput");
const secondInputElement = document.getElementById("secondsignalinput");

const firstSubmitBtn = document.getElementById("firstsubmitbtn");
const secondSubmitBtn = document.getElementById("secondsubmitbtn");

firstUploadForm.addEventListener("submit", (submission) => {
  submission.preventDefault();
  const file = firstInputElement.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    const formDataObject = new FormData();
    formDataObject.append("firstsignalinput", file);
    fetch("/", {
      maxContentLength: 10000000,
      maxBodyLength: 10000000,
      method: "POST",
      credentials: "same-origin",
      body: formDataObject,
    })
      .then((response) => {
        return response.text();
      })
      .then((responseMsg) => {
        firstSignalData = responseMsg;
      })
      .catch((error) => console.error(error));
  }
});

secondUploadForm.addEventListener("submit", (submission) => {
  submission.preventDefault();
  const file = secondInputElement.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    const formDataObject = new FormData();
    formDataObject.append("secondsignalinput", file);
    fetch("/", {
      maxContentLength: 10000000,
      maxBodyLength: 10000000,
      method: "POST",
      credentials: "same-origin",
      body: formDataObject,
    })
      .then((response) => {
        return response.text();
      })
      .then((responseMsg) => {
        secondSignalData = responseMsg;
      })
      .catch((error) => console.error(error));
  }
});

//EXAMPLE OF PLOTLY
const x = [1, 2, 3, 4, 5];
const y = [1, 4, 9, 16, 25];
const data = [{ x: x, y: y, mode: "markers", type: "scatter" }];
const layout = { title: "My Scatter Plot" };
Plotly.newPlot("firstsignalgraph", data, layout);
//use animate property of plotly or extendTraces , figure out the correct way

// REMAINING : PLOT, INTERACTIVE BUTTONS , PDF FILE REPORT