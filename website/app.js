let originalSignalData;
let sampledSignalData;

const normalUploadForm=document.getElementById("normalsignalform");
const abnormalUploadForm = document.getElementById("abnormalsignalform");

const normalSignalGraph = document.getElementById("normalsignalgraph");
const abnormalSignalGraph = document.getElementById("abnormalsignalgraph");

const normalInputElement = document.getElementById("normalsignalinput");
const abnormalInputElement = document.getElementById("abnormalsignalinput");

const normalSubmitBtn = document.getElementById("normalsubmitbtn");
const abnormalSubmitBtn = document.getElementById("abnormalsubmitbtn");

normalUploadForm.addEventListener("submit", (submission) => {
  submission.preventDefault();
  const file = normalInputElement.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    const formDataObject = new FormData();
    formDataObject.append("normalsignalinput", file);
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
        console.log(responseMsg);
      })
      .catch((error) => console.error(error));
  }
});

abnormalUploadForm.addEventListener("submit", (submission) => {
  submission.preventDefault();
  const file = abnormalInputElement.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    const formDataObject = new FormData();
    formDataObject.append("abnormalsignalinput", file);
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
        console.log(responseMsg);
      })
      .catch((error) => console.error(error));
  }
});


// Plotly.plot(
//   originalSignal,
//   [
//     {
//       x: [1, 2, 3, 4, 5],
//       y: [1, 2, 4, 8, 16],
//     },
//   ],
//   {
//     margin: { t: 0 },
//   },
//   { showSendToCloud: true }
// );

// Plotly.plot(
//   sampledSignal,
//   [
//     {
//       x: [1, 2, 3, 4, 5],
//       y: [1, 2, 4, 8, 16],
//     },
//   ],
//   {
//     margin: { t: 0 },
//   },
//   { showSendToCloud: true }
// );
// /* Current Plotly.js version */
// console.log(Plotly.BUILD);
