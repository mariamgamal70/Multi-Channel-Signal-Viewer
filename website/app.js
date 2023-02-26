let firstSignalData;
let secondSignalData;

const firstSignalGraph = document.getElementById("firstsignalgraph");
const secondSignalGraph = document.getElementById("secondsignalgraph");

const firstInputElement = document.getElementById("firstsignalinput");
const secondInputElement = document.getElementById("secondsignalinput");

const addFirstSignalChannelInput = document.getElementById("firstsignaladdchannelinput");
const addSecondSignalChannelInput = document.getElementById("secondsignaladdchannelinput");

const linkingButton = document.getElementById('linkingbutton');
const createpdf = document.getElementById("genPDF")

const firstGraphColor = document.getElementById('firstcolor');
const secondGraphColor = document.getElementById("secondcolor");

const firstDropdown = document.getElementById('firstChannels');
const secondDropdown = document.getElementById("secondChannels");

const firstCineSpeed = document.getElementById('firstcinespeed');
const secondCineSpeed = document.getElementById("secondcinespeed");

let firstsignalfirstchannel;
let firstsignalsecondchannel;

let firstGraphChannelCounter = 0;
let secondGraphChannelCounter = 0;
let linkFlag = false;
let stopFlag = false;
let stoppingRow = 0;
let unPlottedData = [];
let intervalTime = 100;


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
    legend: {
      itemdoubleclick: false
    },
  };
  let layout = {
    title: { title: "Click Here<br>to Edit Chart Title" },
    xaxis: {
      title: "Time (s)",
      zoom: 1000,
    },
    yaxis: {
      title: "Amplitude",
    },
    dragmode: false,
  };
  Plotly.newPlot(graphElement, [trace], layout, { editable: true, displaylogo: false, modeBarButtonsToRemove: ['toImage', 'zoom2d', 'lasso2d'] });
};

function plotSignal(data, graphElement, channelCounter = 0, lastX = 0, lastY = 0) {
  Plotly.update(graphElement, {})
  let i = 0;
  let startPointFoundFlag = false;
  const interval = setInterval(() => {
    //Play/Pause operation
    if (stopFlag == true) {
      var stoppingRow = i;
      var currentChannelCounter = channelCounter;
      var currentGraphElement = graphElement;
      for (stoppingRow; stoppingRow < data.length; stoppingRow++) {
        unPlottedData.push(unPlottedData[stoppingRow]);
      }
      const lastTrace = graphElement.data[stoppingRow];
      const lastX = lastTrace.x[lastTrace.x.length - 1];
      const lastY = lastTrace.y[lastTrace.y.length - 1];
      plotSignal(unPlottedData, currentGraphElement, currentChannelCounter, lastX, lastY);
    }
    else {
      if (i < data.length) {
        const row = data[i];
        let afterRow;
        i - 100 < data.length && i - 100 >= 0 ? afterRow = data[i - 100] : afterRow = data[i];
        let oldData = afterRow[0];
        let CurrentData = row[0];
        let realtimeScrolling = {
          xaxis: {
            range: [oldData, CurrentData]
          }
        };
        if (channelCounter != 0 && !startPointFoundFlag) {
          if (row[0] >= lastX && row[1] >= lastY) {
            startPointFoundFlag = true;
            Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [channelCounter]);
            Plotly.relayout(graphElement, realtimeScrolling);
          }
        } else {
          Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [channelCounter]);
          Plotly.relayout(graphElement, realtimeScrolling);
        }
        i++;
      } else {
        clearInterval(interval);
      }
    }
  }, intervalTime);
};

function handleSignalFetch(formObject, dataElement, graphElement) {
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
      firstsignalfirstchannel = dataElement;
      plotSignal(dataElement, graphElement);
    })
    .catch((error) => console.error(error));
};

function handleChannelFetch(formObject, graphElement, channelCounter) {
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
      plotSignal(firstGraphChannelData, graphElement, channelCounter, lastX, lastY);

    })
    .catch((error) => console.error(error));
};

function linking(firstGraph, secondGraph, linkFlag) {
  if (linkFlag == true) {
    var xaxis = firstGraph.layout.xaxis;
    var yaxis = firstGraph.layout.yaxis;
    var update = {
      xaxis: { range: [xaxis.range[0], xaxis.range[1]] },
      yaxis: { range: [yaxis.range[0], yaxis.range[1]] }
    };
    Plotly.update(secondGraph, {}, update);
  }
};

function addToDropdown(dropdownElement, counter) {
  let newChannel = document.createElement('option');
  let num = counter + 1;
  newChannel.value = `Channel${num}`;
  newChannel.textContent = `Channel${num}`;
  dropdownElement.appendChild(newChannel);
  dropdownElement.value = `Channel${num}`;
};

function changeChannelColor(dropdownElement, graphElement, color) {
  const channelIndex = dropdownElement.selectedIndex;
  Plotly.restyle(graphElement, { "line.color": `${color}` }, [channelIndex]);
};

function updateCineSpeed(newSpeed) {
  newSpeed *= 10;
  intervalTime = newSpeed;
  console.log(intervalTime);
};

document.getElementById("Play/Pause").addEventListener("click", function () {
  stopFlag = !stopFlag;
})

firstInputElement.addEventListener("change", (submission) => {
  submission.preventDefault();
  const file = firstInputElement.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    const formDataObject = new FormData();
    formDataObject.append("firstsignalinput", file);
    handleSignalFetch(formDataObject, firstSignalData, firstSignalGraph);
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

addFirstSignalChannelInput.addEventListener('change', (submission) => { //ADDS SIGNAL TRACE
  submission.preventDefault();
  const file = addFirstSignalChannelInput.files[0];
  if (!file) {
    alert("No file selected");
  }
  else {
    firstGraphChannelCounter++;
    const formDataObject = new FormData();
    formDataObject.append("firstsignaladdchannelinput", file);
    handleChannelFetch(formDataObject, firstSignalGraph, firstGraphChannelCounter);
    addToDropdown(firstDropdown, firstGraphChannelCounter);
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
    handleChannelFetch(formDataObject, secondSignalGraph, secondGraphChannelCounter);
    addToDropdown(secondDropdown, secondGraphChannelCounter);
  }
});

linkingButton.addEventListener('click', () => {
  linkFlag = !linkFlag;
  firstSignalGraph.on('plotly_relayout', () => { linking(firstSignalGraph, secondSignalGraph, linkFlag) });
  secondSignalGraph.on('plotly_relayout', () => { linking(secondSignalGraph, firstSignalGraph, linkFlag) });
});

firstGraphColor.addEventListener('change', () => {
  changeChannelColor(firstDropdown, firstSignalGraph, firstGraphColor.value);
});

secondGraphColor.addEventListener('change', () => {
  changeChannelColor(secondDropdown, secondSignalGraph, secondGraphColor.value);
});
// ON CHANGING LEGEND NAME ON PLOT, IT CHANGES IN DROPDOWN
// firstSignalGraph.on("plotly_legendclick",(data)=>{
//     var update = {};
//     var traceIndex = data.curveNumber;
//     update["name[" + traceIndex + "]"] = newLabel;
//     Plotly.update(plotlyElement, update);
// });

firstCineSpeed.addEventListener('change', () => {
  console.log('CINE1');
  updateCineSpeed(firstCineSpeed.value);
});
//firstCineSpeed.addEventListener("change", () => {});

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

createpdf.addEventListener("click", createPDF); //CHANGE BUTTON AND VARIABLE NAMES
async function createPDF() {
  await fetch("/download", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signal_statistics()),
    //body: JSON.stringify({data:'helloooo'}),
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

function signal_statistics() {
  //fetch("/")
  // Compute the average of a column
  const column = firstsignalfirstchannel.map((row) => parseFloat(row['Column Name']));
  const average = column.reduce((sum, value) => sum + value) / column.length;

  // Compute the standard deviation of a column
  const variance = column.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) / (column.length - 1);
  const standardDeviation = Math.sqrt(variance);

  // Compute the minimum and maximum values in a column
  const minValue = Math.min(...column);
  const maxValue = Math.max(...column);
  return {
    var: variance,
    std: standardDeviation,
    avg: average,
    min: minValue,
    max: maxValue
  }
}

//createpdf.add
