let originalSignalData;
let sampledSignalData;

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
        console.log(responseMsg);
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
