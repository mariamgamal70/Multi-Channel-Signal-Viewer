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

const firstGraphPlayAndPause = document.getElementById("FG_Play_Pause");
const secondGraphPlayAndPause = document.getElementById("SG_Play_Pause");

let firstsignalfirstchannel;
let firstsignalsecondchannel;

let firstGraphCounter = 0;
let secondGraphCounter = 0;
let linkFlag = false;
let secondStopFlag = false;
let firstStopFlag = false;
let stoppingRow = 0;
let intervalTime = 100;
let speedFirst=0;
let speedSecond=0;


document.onload = createPlot(firstSignalGraph);
document.onload = createPlot(secondSignalGraph);

function createPlot(graphElement) {
  // Create a data array to hold your trace
  // let trace = {
  //   x: [], // array to hold the x values
  //   y: [], // array to hold the y values
  //   type: "scatter", // set the chart type
  //   name: "Channel 1",
  //   showlegend: true,
  //   legend: {
  //     itemdoubleclick: false
  //   },
  // };
  let layout = {
    title: { title: "Click Here<br>to Edit Chart Title" },
    xaxis: {
      title: "Time (s)",
      zoom: 1000,
      range: [],
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
    updatemenus: [
      {
        x: 0.5,
        y: 0,
        yanchor: "top",
        xanchor: "center",
        showactive: false,
        direction: "left",
        type: "buttons",
        pad: { t: 87, r: 10 },
        buttons: [
          {
            method: "animate",
            args: [
              null,
              {
                fromcurrent: true,
                transition: {
                  duration: 0,
                },
                frame: {
                  duration: 40,
                  redraw: false,
                },
              },
            ],
            label: "Play",
          },
          {
            method: "animate",
            args: [
              [null],
              {
                mode: "immediate",
                transition: {
                  duration: 0,
                },
                frame: {
                  duration: 0,
                  redraw: false,
                },
              },
            ],
            label: "Pause",
          },
          {
            method: "animate",
            args: [
              [null],
              {
                mode: "afterall",
                transition: {
                  duration: 0,
                },
                frame: {
                  duration: 0,
                  redraw: true,
                },
              },
            ],
            label: "Rewind",
          },
        ],
      },
    ],
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

function plotSignal(arr,graphElement,counter){
  obj=unpack(arr);
  counter++;
  let frames = []
  let x = obj.x;
  let y = obj.y;
  let frameSize=5;
  let numFrame=2000;
  //let n = 100;
  for (let i = 0; i < numFrame; i++) { 
    frames[i] = {data: [{x: [], y: []}]};
    frames[i].data[0].x = x.slice(0, (i * frameSize) + numFrame);
    frames[i].data[0].y = y.slice(0, (i * frameSize) + numFrame);
  }
  let trace = {
    type: "scatter",
    mode: "lines",
    name: `channel${counter}`,
  }
  let data = [trace];

let animationSettings = {
  frame: {
    duration: 10, // in milliseconds
    redraw: false,
  },
  fromcurrent: true,
  transition: {
    duration: 0,
  },
};
let layout = {
  xaxis: {
    range: [
      frames[numFrame - 1].data[0].x[0],
      frames[numFrame - 1].data[0].x[frameSize - 1],
    ],
    showgrid: true,
  },
};
Plotly.addTraces(graphElement, {x: frames[5].data[0].x,y: frames[5].data[0].y,});
Plotly.update(graphElement,trace,layout,[counter-1]);
Plotly.addFrames(graphElement, frames);
Plotly.animate(graphElement, null, animationSettings);
  // i = 0;
  // setInterval(() => {
  //     if (i < frames.length) {
  //       i++;
  //       let layout = {
  //         xaxis: {
  //           range: [
  //             frames[i - 1].data[0].x[0],
  //             frames[i - 1].data[0].x[frameSize - 1],
  //           ],
  //           showgrid: true,
  //         },
  //       };
  //       Plotly.relayout(graphElement,layout)
  //   }
  //   }, 1000);
    
};

function handleSignalFetch(formObject, dataElement, graphElement,counter) {
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
      plotSignal(dataElement, graphElement,counter);
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
      plotSignal(firstGraphChannelData, graphElement, channelCounter);
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

function handlePlayAndPause(stoppingRow, currentChannelCounter, currentGraphElement, data,stopFlag)
{
  let unPlottedData = [];
  for (stoppingRow; stoppingRow < data.length; stoppingRow++) {
    unPlottedData.push(unPlottedData[stoppingRow]);
  }
  const theLastTrace = graphElement.data[stoppingRow];
  const lastXVal = theLastTrace.x[theLastTrace.x.length - 1];
  const lastYVal = theLastTrace.y[theLastTrace.y.length - 1];
  while (1) {
    //do nothing
    if (stopFlag == false) {
      plotSignal(unPlottedData, currentGraphElement, currentChannelCounter, lastXVal, lastYVal);
      break;
    }
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

firstGraphPlayAndPause.addEventListener("click", function () {
  firstStopFlag = !firstStopFlag;
});
secondGraphPlayAndPause.addEventListener("click", function () {
  secondStopFlag = !secondStopFlag;
});

firstInputElement.addEventListener("change", (submission) => {
  submission.preventDefault();
  const file = firstInputElement.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    const formDataObject = new FormData();
    formDataObject.append("firstsignalinput", file);
    handleSignalFetch(formDataObject, firstSignalData, firstSignalGraph,firstGraphCounter);
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
    handleSignalFetch(formDataObject, secondSignalData, secondSignalGraph,secondGraphCounter);
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
    handleChannelFetch(formDataObject, firstSignalGraph, firstGraphCounter);
    addToDropdown(firstDropdown, firstGraphCounter);
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
    handleChannelFetch(formDataObject, secondSignalGraph, secondGraphCounter);
    addToDropdown(secondDropdown, secondGraphCounter);
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

firstCineSpeed.addEventListener('change', () => {
  console.log('CINE1');
  updateCineSpeed(firstCineSpeed.value);
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
