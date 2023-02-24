let firstSignalData;
let secondSignalData;

//const firstUploadForm = document.getElementById("firstsignalform");
//const secondUploadForm = document.getElementById("secondsignalform");

const firstSignalGraph = document.getElementById("firstsignalgraph");
const secondSignalGraph = document.getElementById("secondsignalgraph");

const firstInputElement = document.getElementById("firstsignalinput");
const secondInputElement = document.getElementById("secondsignalinput");

//const firstSubmitBtn = document.getElementById("firstsubmitbtn");
//const secondSubmitBtn = document.getElementById("secondsubmitbtn");

//const addFirstSignalChannelBtn=document.getElementById("firstsignaladdchannelbtn");
//const addSecondSignalChannelBtn = document.getElementById("secondsignaladdchannelbtn");

const addFirstSignalChannelInput=document.getElementById("firstsignaladdchannelinput");
const addSecondSignalChannelInput = document.getElementById("secondsignaladdchannelinput");

//const addFirstSignalChannelForm = document.getElementById("firstsignaladdchannelform");
//const addSecondSignalChannelForm = document.getElementById("secondsignaladdchannelform");

const linkSignalsButton=document.getElementById("linksignal");

let firstGraphChannelCounter=0;
let secondGraphChannelCounter = 0;

document.onload = createPlot(firstSignalGraph);
document.onload = createPlot(secondSignalGraph);

function createPlot(graphElement) {
  // Create a data array to hold your trace
  let trace = {
    x: [], // array to hold the x values
    y: [], // array to hold the y values
    type: "scatter", // set the chart type
    name: "Channel 1",
    showlegend: true,
    legend:{
      itemdoubleclick:false
    }
  };
  let layout = {
    title: { title: "Click Here<br>to Edit Chart Title" },
    xaxis: {
      title: "Time (s)",
    },
    yaxis: {
      title: "Amplitude",
    },
    editable: true,
    displayModeBar: false,
  };
  // let config = {
  //   editable: true,
  //   displayModeBar: false,
  // };
  Plotly.newPlot(graphElement, [trace], layout);
}

function plotMainSignal(data, graphElement) {
    //Plotly.update(graphElement,{},{displayModeBar: true});
    let i = 0;
    const interval = setInterval(() => {
      if (i < data.length) {
        const row = data[i];
        Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [0]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
}

function plotChannelSignal(data, graphElement,channelCounter) {
  let i = 0;
  const interval = setInterval(() => {
    if (i < data.length) {
      const row = data[i];
      Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [channelCounter]);
      i++;
    } else {
      clearInterval(interval);
    }
  }, 100);
}

firstInputElement.addEventListener("change", (submission) => {
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
        plotMainSignal(firstSignalData, firstSignalGraph);
      })
      .catch((error) => console.error(error));
  }
});

secondInputElement.addEventListener("change", (submission) => {
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
        plotMainSignal(secondSignalData, secondSignalGraph);
      })
      .catch((error) => console.error(error));
  }
});

addFirstSignalChannelInput.addEventListener('change',(submission)=>{ //ADDS SIGNAL TRACE
  submission.preventDefault();
  const file = addFirstSignalChannelInput.files[0];
  if (!file) {
    alert("No file selected");
  }
  else{
    firstGraphChannelCounter++;
    const formDataObject= new FormData();
    formDataObject.append("firstsignaladdchannelinput", file);
    fetch('/addSignal',{
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
        firstGraphChannelData = JSON.parse(responseMsg);
        Plotly.addTraces("firstsignalgraph", {
          x: [],
          y: [],
          name: `Channel ${firstGraphChannelCounter+1}`,
          type: "scatter",
        });
        plotChannelSignal(firstGraphChannelData,firstSignalGraph,firstGraphChannelCounter);
      })
      .catch((error) => console.error(error));
  }
})

addSecondSignalChannelInput.addEventListener("change", (submission) => {
  submission.preventDefault();
  const file = addSecondSignalChannelInput.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    secondGraphChannelCounter++;
    const formDataObject = new FormData();
    formDataObject.append("secondsignaladdchannelinput", file);
    fetch("/addSignal", {
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
        secondGraphChannelData = JSON.parse(responseMsg);
        Plotly.addTraces("secondsignalgraph", {
          x: [],
          y: [],
          name: `Channel ${secondGraphChannelCounter + 1}`,
          type: "scatter",
        });
        plotChannelSignal(
          secondGraphChannelData,
          secondSignalGraph,
          secondGraphChannelCounter
        );
      })
      .catch((error) => console.error(error));
  }
});
// linkSignalsButton.addEventListener("click", createPDF); //CHANGE BUTTON AND VARIABLE NAMES
// function createPDF(){
// fetch("/download", {
//   method: "POST",
//   headers:{'Content-Type':'application/json'},
//   body: JSON.stringify({data:'helloooo'}),
//   credentials: "same-origin",
// })
//   .then((response) => {
//     return response.blob();
//   })
//   .then((blob) => {
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "output.pdf";
//     a.click();
//   });
// }

//function signal_statistics(){

// Compute the average of a column
//const column = results.map((row) => parseFloat(row['Column Name']));
//const average = column.reduce((sum, value) => sum + value) / column.length;

// Compute the standard deviation of a column
//const variance = column.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) / (column.length - 1);
//const standardDeviation = Math.sqrt(variance);

// Compute the minimum and maximum values in a column
//const minValue = Math.min(...column);
//const maxValue = Math.max(...column);
//}

