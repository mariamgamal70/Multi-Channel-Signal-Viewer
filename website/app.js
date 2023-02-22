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
        return response.text(); //arrive as string
      })
      .then((responseMsg) => {
       firstSignalData = JSON.parse(responseMsg); //converts it to js object
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
        secondSignalData = JSON.parse(responseMsg);
      })
      .catch((error) => console.error(error));
  }
});


let trace = {
  x: [], // array to hold the x values
  y: [], // array to hold the y values
  type: 'scatter' // set the chart type
};

for (let dataFirstRow = 0; dataFirstRow < firstSignalData.length; dataFirstRow++) {
  let fRow = firstSignalData[dataFirstRow];
  trace.x.push(fRow[0]); // append the x value from the CSV row to the x array
  trace.y.push(fRow[1]); // append the y value from the CSV row to the y array

  console.log(fRow)
}

// for (let dataSecondRow = 0; dataSecondRow < secondResultArr.length; dataSecondRow++) {
//   let sRow = secondResultArr[dataSecondRow];
//   trace.x.push(sRow[0]); // append the x value from the CSV row to the x array
//   trace.y.push(sRow[1]); // append the y value from the CSV row to the y array
// }

// Create a data array to hold your trace
let data = [trace];

// Create a layout object
let layout = {
  title: 'Signal Plot'
};

// Call Plotly.newPlot to create the plot
Plotly.newPlot('plot', data, layout);




//EXAMPLE OF PLOTLY
// const x = [1, 2, 3, 4, 5];
// const y = [1, 4, 9, 16, 25];
// const data = [{ x: x, y: y, mode: "markers", type: "line" }];
// const layout = { title: "My Scatter Plot" };
// Plotly.newPlot("firstsignalgraph", data, layout);
//use animate property of plotly or extendTraces , figure out the correct way
// REMAINING : PLOT, INTERACTIVE BUTTONS , PDF FILE REPORT