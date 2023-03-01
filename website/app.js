//const { trace } = require("console");

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

const firstRewind=document.getElementById("firstrewind");
const secondRewind = document.getElementById("secondrewind");

let firstsignalfirstchannel;
let firstsignalsecondchannel;

let firstGraphCounter = 0;
let secondGraphCounter = 0;
let linkFlag = false;
let intervalTime = 100;
let speedFirst=0;
let speedSecond=0;
let isFirstPlaying = true;
let isSecondPlaying=true;
let firstGraphFinish=false;
let secondGraphFinish = false;

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
      range: [],
      autorange: true,
    },
    yaxis: {
      title: "Amplitude",
      autorange: true,
    },
    showlegend: true,
    legend: {
      orientation: "v",
      x: 5,
      y: 1.4,
      xanchor: "right",
    },
    dragmode: false,
    // sliders: [
    //   {
    //     pad: { t: 30 },
    //     currentvalue: {
    //       xanchor: "right",
    //       prefix: "color: ",
    //       font: {
    //         color: "#888",
    //         size: 20,
    //       },
    //     },
    //     steps: [
    //       {
    //         label: "1",
    //         method: "restyle",
    //         args: ["line.color", "red"],
    //       },
    //       {
    //         label: "2",
    //         method: "restyle",
    //         args: ["line.color", "green"],
    //       },
    //       {
    //         label: "3",
    //         method: "restyle",
    //         args: ["line.color", "blue"],
    //       },
    //       {
    //         label: "4",
    //         method: "restyle",
    //         args: ["line.color", "blue"],
    //       },
    //       ,
    //       {
    //         label: "5",
    //         method: "restyle",
    //         args: ["line.color", "blue"],
    //       },
    //     ],
    //   },
    // ],
    // updatemenus: [
    //   {
    //     x: 0.5,
    //     y: 0,
    //     yanchor: "top",
    //     xanchor: "center",
    //     showactive: false,
    //     direction: "left",
    //     type: "buttons",
    //     pad: { t: 87, r: 10 },
    //     buttons: [
    //       {
    //         method: "animate",
    //         args: [
    //           null,
    //           {
    //             fromcurrent: true,
    //             transition: {
    //               duration: 0,
    //             },
    //             frame: {
    //               duration: 10,
    //               redraw: false,
    //             },
    //           },
    //         ],
    //         label: "Play",
    //       },
    //       {
    //         method: "animate",
    //         args: [
    //           [null],
    //           {
    //             mode: "immediate",
    //             transition: {
    //               duration: 0,
    //             },
    //             frame: {
    //               duration: 0,
    //               redraw: false,
    //             },
    //           },
    //         ],
    //         label: "Pause",
    //       },
    //       {
    //         method: "animate",
    //         args: [
    //           [null],
    //           {
    //             mode: "afterall",
    //             transition: {
    //               duration: 0,
    //             },
    //             frame: {
    //               duration: 0,
    //               redraw: true,
    //             },
    //           },
    //         ],
    //         label: "Rewind",
    //       },
    //     ],
    //   },
    // ],
  };
  Plotly.newPlot(graphElement, [], layout, { editable: true, displaylogo: false, modeBarButtonsToRemove: ['toImage', 'zoom2d', 'lasso2d'],responsive: true });
};
// function plotSignal(data, graphElement, channelCounter = 0, lastX = 0, lastY = 0) {
//   let i = 0;
//   //let startPointFoundFlag = false;
//   const interval = setInterval(() => {
//     if (stopFlag == false){
//       if (i < data.length) {
//         const row = data[i];
//         // let beforeRow;
//         // i - 100 < data.length && i - 100 >= 0 ? (beforeRow = data[i - 100]) : (beforeRow = data[i]);
//         // let oldData = beforeRow[0];
//         // let CurrentData = row[0];
//         // let realtimeScrolling = {
//         //   xaxis: {
//         //     range: [oldData, CurrentData],
//         //   },
//         // };
//         if (channelCounter != 0){// && !startPointFoundFlag) {
//           // if (row[0] >= lastX && row[1] >= lastY) {
//           //   startPointFoundFlag = true;
//           setTimeout(speed);
//             Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [channelCounter]);
//           // }
//         } else {
//           setTimeout(speed);
//           Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [channelCounter]);
//           // Plotly.relayout(graphElement, realtimeScrolling);
//         }
//         i++;
//       } else {
//         clearInterval(interval);
//       }
//     }
//   }, intervalTime);
// };

//GIVE ARR OF OBJ
function unpack(arr) {
  xvalues = arr.map((row)=> {
    return row[0];
  });
  yvalues = arr.map((row)=>{
    return row[1];
  });
  return { x: xvalues, y: yvalues };
};

function plotSignal(data, graphElement, graphno,channelCounter = 0){ 
  let i = 0;
  function actualplotting(){
    if (i < data.length &&((isFirstPlaying && graphno === 1) || (isSecondPlaying && graphno === 2))
    ) {
      const row = data[i];
      i++;
      Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [channelCounter]);
      graphno === 1 ? (firstGraphFinish = false) : (secondGraphFinish = false);
      console.log(intervalTime);
    } else {
      graphno === 1 ? (firstGraphFinish = true) : (secondGraphFinish = true);
      clearInterval(interval);
    }
  }
  let interval = setInterval(actualplotting, intervalTime);
  function startInterval() {
    // if (interval) {
    //   clearInterval(interval);
    // }
    interval = setInterval(actualplotting, intervalTime);
  }
  let checkPlayingInterval = setInterval(() => {
    if ((isFirstPlaying && graphno === 1) || (isSecondPlaying && graphno === 2) && i<data.length) {
      startInterval();
    }
  }, 100);

  firstCineSpeed.addEventListener("change", () => {
    console.log("CINE1");
    updateCineSpeed(firstCineSpeed.value);
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

function handleChannelFetch(formObject, graphElement, channelCounter,graphno) {
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
      // const lastTrace = graphElement.data[channelCounter - 1];
      // const lastX = lastTrace.x[lastTrace.x.length - 1];
      // const lastY = lastTrace.y[lastTrace.y.length - 1];
      Plotly.addTraces(graphElement, {
        x: [],//lastX],
        y: [],//lastY],
        name: `Channel ${channelCounter + 1}`,
        type: "scatter",
      });
      plotSignal(ChannelData, graphElement,graphno ,channelCounter); //lastX, lastY);

    })
    .catch((error) => console.error(error));
};

function linking(firstGraph, secondGraph, linkFlag) {
  if (linkFlag == true) {
    let xaxis = firstGraph.layout.xaxis;
    let yaxis = firstGraph.layout.yaxis;
    let update = {
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

firstInputElement.addEventListener("change", (submission) => {
  submission.preventDefault();
  const file = firstInputElement.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    const formDataObject = new FormData();
    formDataObject.append("firstsignalinput", file);
    handleSignalFetch(formDataObject, firstSignalData, firstSignalGraph,1);
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
    handleSignalFetch(formDataObject, secondSignalData, secondSignalGraph,2);
  }
});

addFirstSignalChannelInput.addEventListener('change', (submission) => { //ADDS SIGNAL TRACE
  submission.preventDefault();
  const file = addFirstSignalChannelInput.files[0];
  if (!file) {
    alert("No file selected");
  }
  else {
    firstGraphCounter++;
    const formDataObject = new FormData();
    formDataObject.append("firstsignaladdchannelinput", file);
    handleChannelFetch(formDataObject, firstSignalGraph, firstGraphChannelCounter,1);
    addToDropdown(firstDropdown, firstGraphChannelCounter);
  }
})

addSecondSignalChannelInput.addEventListener("change", (submission) => {
  submission.preventDefault();
  const file = addSecondSignalChannelInput.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    secondGraphCounter++;
    const formDataObject = new FormData();
    formDataObject.append("secondsignaladdchannelinput", file);
    handleChannelFetch(formDataObject, secondSignalGraph, secondGraphChannelCounter,2);
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
//     let update = {};
//     let traceIndex = data.curveNumber;
//     update["name[" + traceIndex + "]"] = newLabel;
//     Plotly.update(plotlyElement, update);
// });


// firstCineSpeed.addEventListener('change', () => {
//   console.log('CINE1');
//   updateCineSpeed(firstCineSpeed.value);
// });  

PlayPauseone.addEventListener("click", function () {
  isFirstPlaying = !isFirstPlaying;
});
PlayPausetwo.addEventListener("click", function () {
  isSecondPlaying = !isSecondPlaying;
});

firstRewind.addEventListener("click", function () {
if(firstGraphFinish){
  let traces = firstSignalGraph.data;
  for (let i = 0; i < traces.length; i++) {
    const traceX = traces[i].x;
    const traceY = traces[i].y;
    const traceXY = [];
    for (let j = 0; j < traceX.length; j++) {
      traceXY.push([traceX[j], traceY[j]]);
      console.log(traceXY);
    }
    firstGraphChannelCounter=traces.length-1;
    Plotly.deleteTraces(firstSignalGraph, i);
    setTimeout(() => {
      Plotly.addTraces(firstSignalGraph, {
        x: [], 
        y: [], 
        name: `Channel ${firstGraphChannelCounter + 1}`,
        type: "scatter",
      });
      plotSignal(traceXY, firstSignalGraph, 1, firstGraphChannelCounter);
    }, 100); 
  }
}
});
secondRewind.addEventListener("click", function () {
if (secondGraphFinish) {
  let traces = secondSignalGraph.data;
  for (let i = 0; i < traces.length; i++) {
    const traceX = traces[i].x;
    const traceY = traces[i].y;
    const traceXY = [];
    for (let j = 0; j < traceX.length; j++) {
      traceXY.push([traceX[j], traceY[j]]);
      console.log(traceXY);
    }
    secondGraphChannelCounter=traces.length-1;
    Plotly.deleteTraces(secondSignalGraph, i);
    setTimeout(() => {
      Plotly.addTraces(secondSignalGraph, {
        x: [], 
        y: [], 
        name: `Channel ${secondGraphChannelCounter + 1}`,
        type: "scatter",
      });
      plotSignal(traceXY, secondSignalGraph, 1, secondGraphChannelCounter);
    }, 100); 
  }
}
});
//firstCineSpeed.addEventListener("change", () => {});

// linkSignalsButton.addEventListener("click", createPDF); //CHANGE BUTTON AND letIABLE NAMES
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

createpdf.addEventListener("click", createPDF); //CHANGE BUTTON AND letIABLE NAMES
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
  const letiance = column.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) / (column.length - 1);
  const standardDeviation = Math.sqrt(letiance);

  // Compute the minimum and maximum values in a column
  const minValue = Math.min(...column);
  const maxValue = Math.max(...column);
  return {
    let: letiance,
    std: standardDeviation,
    avg: average,
    min: minValue,
    max: maxValue
  }
}

//createpdf.add
