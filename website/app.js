//const { trace } = require("console");

// const { update } = require("plotly.js");

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

const PlayPauseone = document.getElementById("Play/Pauseone");
const PlayPausetwo = document.getElementById("Play/Pausetwo");

const firstRewind = document.getElementById("firstrewind");
const secondRewind = document.getElementById("secondrewind");

let firstsignalfirstchannel;
let firstsignalsecondchannel;

let firstGraphChannelCounter = 0;
let secondGraphChannelCounter = 0;

let linkFlag = false;

let firstIntervalTime = 0;
let secondIntervalTime=0;

let isFirstPlaying = true;
let isSecondPlaying=true;

let firstGraphFinish=false;
let secondGraphFinish = false;

let allFirstGraphTraces = [];
let allSecondGraphTraces = [];

document.onload = createPlot(firstSignalGraph);
document.onload = createPlot(secondSignalGraph);

function createPlot(graphElement) {
  let trace = {
    x: [],
    y: [],
    type: "scatter",
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
      fixedrange: true,
    },
    dragmode: false,
  };
  Plotly.newPlot(graphElement, [trace], layout, { editable: true, displaylogo: false, modeBarButtonsToRemove: ['toImage', 'zoom2d', 'lasso2d','pan2d'], displayModeBar: false });

};

function plotSignal(data, graphElement, graphno, channelCounter = 0) {
  let trace = {
    x: [],
    y: [],
    type: "scatter",
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
      fixedrange: true,
    },
    dragmode: 'pan',
  };
  Plotly.newPlot(graphElement, [trace], layout, { editable: true, displaylogo: false, modeBarButtonsToRemove: ['toImage', 'zoom2d', 'lasso2d','pan2d'], displayModeBar: true });
  let i = 0;
  let mintick=0;
  let maxtick=4;
  let interval;
  let checkPlayingInterval;
  let time;
  function actualplotting(){
    if (i < data.length &&((isFirstPlaying && graphno === 1) || (isSecondPlaying && graphno === 2))
    ) {
      const row = data[i];
      i++;
        Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [channelCounter]);
      if(row[0]>maxtick){
        mintick=maxtick;
        maxtick+=4;
        Plotly.relayout(graphElement, {
          "xaxis.range": [mintick, maxtick],
          "xaxis.autorange": false,
          "xaxis.tickmode": "linear",
          "xaxis.dtick": 1,
        });
      }
      graphno === 1 ? (firstGraphFinish = false) : (secondGraphFinish = false);
    } else {
      if(i===data.length){
      graphno === 1 ? (firstGraphFinish = true) : (secondGraphFinish = true);
      }
      clearInterval(interval);
    }
  }

  function startInterval() {
  graphno === 1 ? (time = firstIntervalTime) : (time = secondIntervalTime);
      if (interval) {
        clearInterval(checkPlayingInterval);
        clearInterval(interval);
      }
      interval = setInterval(actualplotting, time);
      checkPlaying()
      console.log(time);
  }
  
  function checkPlaying(){
      checkPlayingInterval = setInterval(() => {
        if ((isFirstPlaying && graphno === 1) ||(isSecondPlaying && graphno === 2 && i < data.length)) {
          startInterval();
        }
      }, 100);
    };

  startInterval();

  firstCineSpeed.addEventListener("change", () => {
    firstIntervalTime= parseInt(firstCineSpeed.value);
    startInterval();
  });  
  
  secondCineSpeed.addEventListener("change", () => {
    secondIntervalTime = parseInt(secondCineSpeed.value);
    startInterval();
  });
};
    
function handleSignalFetch(formObject, dataElement, graphElement,graphno) {
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
      plotSignal(dataElement, graphElement, graphno);
    })
    .catch((error) => console.error(error));
};

function handleChannelFetch(formObject, graphElement, channelCounter, graphno) {
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
      let ChannelData = JSON.parse(responseMsg);
      Plotly.addTraces(graphElement, {
        x: [],
        y: [],
        name: `Channel ${channelCounter + 1}`,
        type: "scatter",
      });
      plotSignal(ChannelData, graphElement,graphno ,channelCounter);

    })
    .catch((error) => console.error(error));
};

function linking(firstGraph, secondGraph, linkFlag) {
  if (linkFlag == true) {
    var xaxis = firstGraph.layout.xaxis;
    var yaxis = firstGraph.layout.yaxis;
    var update = {
      xaxis: { range: [xaxis.range[0], xaxis.range[1]] },
      //yaxis: { range: [yaxis.range[0], yaxis.range[1]] }
    };
    Plotly.update(secondGraph, {}, update);
    secondIntervalTime=firstIntervalTime
  }
  else{
    secondIntervalTime = parseInt(secondCineSpeed.value);
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

function getAllGraphTraces(graphElement,num){
  let traces = graphElement.data;
  for(i=0;i<traces.length;i++){
    const traceX = traces[i].x;
    const traceY = traces[i].y;
    let traceXY=[]
    for (let j = 0; j < traceX.length; j++) {
      traceXY.push([traceX[j], traceY[j]]);
    }
    num===1?allFirstGraphTraces.push(traceXY):allSecondGraphTraces.push(traceXY);
  }
};

function getMaxMin(data){
  let max=0
  let length=0;
for(i=0;i<data.length;i++){
  data[i][0] > max ? (max = data[i][0]) : null;
  length++
}
return {'max':Math.round(max),'length':length};
};

firstInputElement.addEventListener("change", (submission) => {
  submission.preventDefault();
  const file = firstInputElement.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    const formDataObject = new FormData();
    formDataObject.append("firstsignalinput", file);
    handleSignalFetch(formDataObject, firstSignalData, firstSignalGraph, 1);
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
    handleSignalFetch(formDataObject, secondSignalData, secondSignalGraph, 2);
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
    handleChannelFetch(formDataObject, firstSignalGraph, firstGraphChannelCounter, 1);
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
    handleChannelFetch(formDataObject, secondSignalGraph, secondGraphChannelCounter, 2);
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

PlayPauseone.addEventListener("click", function () {
  isFirstPlaying = !isFirstPlaying;
});
PlayPausetwo.addEventListener("click", function () {
  isSecondPlaying = !isSecondPlaying;
});

firstRewind.addEventListener("click", function () {
  if (firstGraphFinish) {
    allFirstGraphTraces = [];
    getAllGraphTraces(firstSignalGraph,1);
    firstGraphChannelCounter=0;
    for (let i = 0; i < allFirstGraphTraces.length; i++) {
      Plotly.deleteTraces(firstSignalGraph, 0);
    }
    for (let i = 0; i < allFirstGraphTraces.length; i++) {
      setTimeout(() => {
        Plotly.addTraces(firstSignalGraph, {
          x: [],
          y: [],
          name: `Channel ${firstGraphChannelCounter + 1}`,
          showlegend: true,
          type: "scatter",
        });
        plotSignal(allFirstGraphTraces[i], firstSignalGraph, 1, firstGraphChannelCounter);
        firstGraphChannelCounter++;
      }, 100);
    }
  }
});

secondRewind.addEventListener("click", function () {
if (secondGraphFinish) {
  allSecondGraphTraces = [];
  getAllGraphTraces(secondSignalGraph, 2);
  secondGraphChannelCounter = 0;
  for (let i = 0; i < allSecondGraphTraces.length; i++) {
    Plotly.deleteTraces(secondSignalGraph, 0);
  }
  for (let i = 0; i < allSecondGraphTraces.length; i++) {
    setTimeout(() => {
      Plotly.addTraces(secondSignalGraph, {
        x: [],
        y: [],
        name: `Channel ${secondGraphChannelCounter + 1}`,
        showlegend: true,
        type: "scatter",
      });
      plotSignal(allSecondGraphTraces[i],secondSignalGraph,1,secondGraphChannelCounter);
      secondGraphChannelCounter++;
    }, 100);
  }
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

// firstSignalGraph.on("plotly_relayout", function (eventData) {
//   if (eventData["legend.title"]) {
//     firstDropdown.
//   }
// });

// secondSignalGraph.on("plotly_relayout", function (eventData) {
//   if (eventData["legend.title"]) {
//     secondDropdown.
//   }
// });

firstSignalScrollbar.addEventListener("Scrollingfirst", function () {

  let scrollPosition = firstSignalScrollbar.scrollTop;
let maxScrollPosition = firstSignalGraph.scrollHeight - firstSignalGraph.offsetHeight;
let xaxisRange = [scrollPosition / maxScrollPosition, (scrollPosition + firstSignalGraph.offsetHeight) / maxScrollPosition];

Plotly.relayout(firstSignalGraph, { xaxis: { range: xaxisRange } });
});

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
};

//createpdf.add
