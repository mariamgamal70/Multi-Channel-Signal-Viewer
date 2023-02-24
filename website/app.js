let firstSignalData;
let secondSignalData;

const firstSignalGraph = document.getElementById("firstsignalgraph");
const secondSignalGraph = document.getElementById("secondsignalgraph");

const firstInputElement = document.getElementById("firstsignalinput");
const secondInputElement = document.getElementById("secondsignalinput");

const addFirstSignalChannelInput=document.getElementById("firstsignaladdchannelinput");
const addSecondSignalChannelInput = document.getElementById("secondsignaladdchannelinput");

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
    title: {title: 'Click Here<br>to Edit Chart Title'},
    xaxis: {
      title: "Time (s)",
    },
    yaxis: {
      title: "Amplitude",
    },
  };
  Plotly.newPlot(graphElement, [trace], layout, { editable: true });
}

function plotSignal(data, graphElement,channelCounter=0,lastX=0,lastY=0) {
  let i = 0;
  let startPointFoundFlag=false;
  const interval = setInterval(() => {
    if (i < data.length) {
      const row = data[i];
      if(channelCounter!=0 && !startPointFoundFlag){
        if(row[0]>=lastX && row[1]>=lastY){
          startPointFoundFlag=true;
          Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [channelCounter]);
        }
      }else{
      Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [channelCounter]);
      }
      i++;
    } else {
      clearInterval(interval);
    }
  }, 100);
}

function handleSignalFetch(formObject,dataElement,graphElement){
fetch("/", {
  maxContentLength: 10000000,
  maxBodyLength: 10000000,
  method: "POST",
  credentials: "same-origin",
  body: formObject,
})
  .then((response) => {
    return response.text(); //arrive as string
  })
  .then((responseMsg) => {
    dataElement = JSON.parse(responseMsg); //converts it to js object
    plotSignal(dataElement, graphElement);
  })
  .catch((error) => console.error(error));
}

function handleChannelFetch(formObject,graphElement,channelCounter){
fetch("/addChannel", {
  maxContentLength: 10000000,
  maxBodyLength: 10000000,
  method: "POST",
  credentials: "same-origin",
  body: formObject,
})
  .then((response) => {
    return response.text();
  })
  .then((responseMsg) => {
    let firstGraphChannelData = JSON.parse(responseMsg);
    const lastTrace = graphElement.data[channelCounter - 1];
    const lastX = lastTrace.x[lastTrace.x.length - 1];
    const lastY = lastTrace.y[lastTrace.y.length - 1];
    Plotly.addTraces(graphElement, {
      x: [lastX],
      y: [lastY],
      name: `Channel ${channelCounter + 1}`,
      type: "scatter",
    });
    plotSignal(firstGraphChannelData, graphElement, channelCounter,lastX,lastY);
  })
  .catch((error) => console.error(error));
}

firstInputElement.addEventListener("change", (submission) => {
  submission.preventDefault();
  const file = firstInputElement.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    const formDataObject = new FormData();
    formDataObject.append("firstsignalinput", file);
    handleSignalFetch(formDataObject, firstSignalData , firstSignalGraph);
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
    handleSignalFetch(formDataObject, secondSignalData, secondSignalGraph);
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
    handleChannelFetch(formDataObject,firstSignalGraph,firstGraphChannelCounter);
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
    handleChannelFetch(formDataObject,secondSignalGraph,secondGraphChannelCounter);

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

