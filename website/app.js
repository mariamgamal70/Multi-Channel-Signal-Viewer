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

const linkSignalsButton=document.getElementById("linksignal");

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
        plotSignal(firstSignalData, firstSignalGraph);
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
        plotSignal(secondSignalData, secondSignalGraph);
      })
      .catch((error) => console.error(error));
  }
});

function plotSignal(data, graphElement) {
  // Create a data array to hold your trace
  let trace = {
    x: [], // array to hold the x values
    y: [], // array to hold the y values
    type: "scatter", // set the chart type
  };
  for (let dataRow = 0; dataRow < data.length; dataRow++) {
    let Row = data[dataRow];
    trace.x.push(Row[0]); // append the x value from the CSV row to the x array
    trace.y.push(Row[1]); // append the y value from the CSV row to the y array
  }
  // Create a layout object
  let layout = {
    title: "Signal Plot",
    xaxis: {
      title: "Time (s)",
    },
    yaxis: {
      title: "Amplitude",
    },
  };
  Plotly.newPlot(graphElement, [trace], layout);
}

function addChannel() {}

linkSignalsButton.addEventListener("click", createPDF); //CHANGE BUTTON AND VARIABLE NAMES
function createPDF(){
fetch("/download", {
  method: "POST",
  headers:{'Content-Type':'application/json'},
  body: JSON.stringify({data:'helloooo'}),
  credentials: "same-origin",
})
  .then((response) => {
    return response.blob();
  })
  .then((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.pdf";
    a.click();
  });
}




// function link(){
//   console.log('CLICKED')
//   firstSignalGraph.on('plotly_hover', function(data) {
//   console.log('HOVERED');
//   var pointID = data.points[0].pointNumber;
//   Plotly.Fx.hover('secondSignalGraph', [{ curveNumber: 0, pointNumber: pointID }]);
//     });
//     // add hover event listener to plot 2
//   secondSignalGraph.on('plotly_hover', function(data) {
//   var pointID = data.points[0].pointNumber;
//   Plotly.Fx.hover('firstSignalGraph', [{ curveNumber: 0, pointNumber: pointID }]);
// });
// }
// add hover event listener to plot 1
// linkSignals.addEventListener('click', link);

// Call Plotly.newPlot to create the plot
// let newData = { x: [newXValue], y: [newYValue] };
// Plotly.extendTraces("plot", newData, [0]);

//use animate property of plotly or extendTraces , figure out the correct way
// REMAINING : PLOT, INTERACTIVE BUTTONS , PDF FILE REPORT
