let firstGraphData=[];
let secondGraphData=[];

const firstSignalGraph = document.getElementById("firstsignalgraph");
const secondSignalGraph = document.getElementById("secondsignalgraph");

const addFirstSignalChannelInput = document.getElementById("firstsignaladdchannelinput");
const addSecondSignalChannelInput = document.getElementById("secondsignaladdchannelinput");

const linkingButton = document.getElementById("linkingbutton");

const createPDFButton = document.getElementById("Export");
//const createpdf2 = document.getElementById("Export2");

const firstGraphColor = document.getElementById("firstcolor");
const secondGraphColor = document.getElementById("secondcolor");

const firstDropdown = document.getElementById("firstChannels");
const secondDropdown = document.getElementById("secondChannels");

const firstCineSpeed = document.getElementById("firstcinespeed");
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
let secondIntervalTime = 0;

let isFirstPlaying = true;
let isSecondPlaying = true;

let firstGraphFinish = false;
let secondGraphFinish = false;

let allFirstGraphTraces = [];
let allSecondGraphTraces = [];

let firstmintick ;
let firstmaxtick ;

let firstcurrentindex;
let secondcurrentindex;
// let secondmintick ;
// let secondmaxtick ;
let continued=true;

document.onload = createPlot(firstSignalGraph);
document.onload = createPlot(secondSignalGraph);

function createPlot(graphElement) {
  let layout = {
    title: { title: "Click Here<br>to Edit Chart Title" },
    xaxis: {
      rangeslider: {
      range: [0, 1],
      visible: true,
      dragmode: false,
      zoom: false,
      },
      range: [0, 5],
      rangemode: "tozero",
      title: "Time (s)",
      zoom: 1000,
      fixedrange: true,
    },
    yaxis: {
      title: "Amplitude",
      fixedrange: true,
    },
    dragmode: false,
    zoommode: false,
  };
  let config = {
    editable: true,
    displaylogo: false,
    modeBarButtonsToRemove: ["toImage", "zoom2d", "lasso2d","pan2d"],
  };

  Plotly.newPlot(graphElement, [], layout, config);
}

function plotSignal(data, graphElement, graphno, channelCounter = 0) {
  let i = 0;
  if(channelCounter==0 && graphno==1){
    firstmintick = 0;
    firstmaxtick = 4;
  }
  // else if(channelCounter==0 && graphno==2){
  //   secondmintick = 0;
  //   secondmaxtick = 4;
  // }
  let interval;
  let checkPlayingInterval;
  let time;
  Plotly.relayout(graphElement, { "xaxis.fixedrange": false, dragmode: "pan" });
  function actualplotting() {
    if (
      i < data.length &&
      ((isFirstPlaying && graphno === 1) || (isSecondPlaying && graphno === 2))
    ) {
      const row = data[i];
      if(channelCounter == 0){
        graphno==1 ? firstcurrentindex = i:secondcurrentindex = i
      }
      i++;
      Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [               //possible error
        channelCounter,
      ]);
      if (row[0] > firstmaxtick && graphno==1) {
        firstmintick = firstmaxtick;
        firstmaxtick += 4;
        Plotly.relayout(graphElement, {
          "xaxis.range": [firstmintick, firstmaxtick],
          "xaxis.tickmode": "linear",
          "xaxis.dtick": 1,
        });
      } 
      // else if(row[0] > secondmaxtick && graphno==2){
      //   secondmintick = secondmaxtick;
      //   secondmaxtick += 4;
      //   Plotly.relayout(graphElement, {
      //     "xaxis.range": [secondmintick, secondmaxtick],
      //     "xaxis.tickmode": "linear",
      //     "xaxis.dtick": 1,
      //   });
      // }
       // Get current x-axis range
        const currentRange = graphElement.layout.xaxis.range;
  
       // Adjust x-axis range if necessary
        if (row[0] < currentRange[0] || row[0] > currentRange[1]) {
          mintick = row[0];
          maxtick = row[0] + 4;
          Plotly.relayout(graphElement, {
            "xaxis.range": [mintick, maxtick],
            "xaxis.tickmode": "linear",
            "xaxis.dtick": 1,
          });
        }
      graphno === 1 ? (firstGraphFinish = false) : (secondGraphFinish = false);
    } else {
      if (i === data.length) {
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
    checkPlaying();
  }

  function checkPlaying() {
    checkPlayingInterval = setInterval(() => {
      if (
        (isFirstPlaying && graphno === 1) ||
        (isSecondPlaying && graphno === 2 && i < data.length)
      ) {
        startInterval();
      }
    }, 100);
  }

  startInterval();
  
  
  firstCineSpeed.addEventListener("change", () => {
    firstIntervalTime = parseInt(firstCineSpeed.value);
    startInterval();
  });

  secondCineSpeed.addEventListener("change", () => {
    console.log("B", firstIntervalTime, secondIntervalTime);
    secondIntervalTime = parseInt(secondCineSpeed.value);
    startInterval();
  });
}

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
      let x=[],y=[],rest=ChannelData;
      if(channelCounter!=0){ 
        if(graphno==1){
          const { x: newX, y: newY, rest: newData } = splitData(ChannelData,firstcurrentindex)
          x = newX;
          y = newY;
          rest = newData;
        }else{
          const { x: newX, y: newY, rest: newData } = splitData(ChannelData,secondcurrentindex)
          x = newX;
          y = newY;
          rest = newData;
        }
      }
      graphno==1? firstGraphData.push(ChannelData):secondGraphData.push(ChannelData);
      Plotly.addTraces(graphElement, {
        x: x,
        y: y,
        name: `Channel ${channelCounter + 1}`,
        showlegend: true,
        type: "scatter",
      });
      console.log(rest);
      plotSignal(rest, graphElement, graphno, channelCounter);
    })
    .catch((error) => console.error(error));
}

function linkSpeed() {
  firstCineSpeed.addEventListener("change", () => {
    firstIntervalTime = parseInt(firstCineSpeed.value);
    secondIntervalTime = firstIntervalTime;
  });

  secondCineSpeed.addEventListener("change", () => {
    secondIntervalTime = parseInt(secondCineSpeed.value);
    firstIntervalTime = secondIntervalTime;
  });
}

function linking(firstGraph, secondGraph, linkFlag) {
  if (linkFlag == true) {
    var xaxis = firstGraph.layout.xaxis;
    //var yaxis = firstGraph.layout.yaxis;
    var update = {
      xaxis: {
        range: [xaxis.range[0], xaxis.range[1]],
        rangeslider: {
          range: [0, 1],
          visible: true,
          dragmode: false,
          zoom: false,
        },
      },
      //yaxis: { range: [yaxis.range[0], yaxis.range[1]] },
    };
    Plotly.update(secondGraph, {}, update);
    linkSpeed();
  } else {
    secondIntervalTime = parseInt(secondCineSpeed.value);
    firstIntervalTime = parseInt(firstCineSpeed.value);
  }
}

function addToDropdown(dropdownElement, counter) {
  let newChannel = document.createElement("option");
  let num = counter + 1;
  newChannel.value = `Channel${num}`;
  newChannel.textContent = `Channel${num}`;
  dropdownElement.appendChild(newChannel);
  dropdownElement.value = `Channel${num}`;
}

function changeChannelColor(dropdownElement, graphElement, color) {
  const channelIndex = dropdownElement.selectedIndex;
  Plotly.restyle(graphElement, { "line.color": `${color}` }, [channelIndex]);
}

function getAllGraphTraces(graphElement, graphNum) {
  let traces = graphElement.data;
  for (i = 0; i < traces.length; i++) {
    const traceX = traces[i].x;
    const traceY = traces[i].y;
    let traceXY = [];
    for (let j = 0; j < traceX.length; j++) {
      traceXY.push([traceX[j], traceY[j]]);
    }
    graphNum === 1
      ? allFirstGraphTraces.push(traceXY)
      : allSecondGraphTraces.push(traceXY);
  }
}

function splitData(data, endIndex) {
  const x = [];
  const y = [];
  const rest = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (i < endIndex) {
      x.push(row[0]);
      y.push(row[1]);
    } else {
      rest.push(row);
    }
  }
//console.log(rest);
  return {x,y,rest};
}


function getMaxMin(data) {
  let max = 0;
  let length = 0;
  for (i = 0; i < data.length; i++) {
    data[i][0] > max ? (max = data[i][0]) : null;
    length++;
  }
  return { max: Math.round(max), length: length };
}

addFirstSignalChannelInput.addEventListener("change", (submission) => {
  //ADDS SIGNAL TRACE
  submission.preventDefault();
  const file = addFirstSignalChannelInput.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    const formDataObject = new FormData();
    formDataObject.append("firstsignaladdchannelinput", file);
    handleChannelFetch(
      formDataObject,
      firstSignalGraph,
      firstGraphChannelCounter,
      1
    );
    addToDropdown(firstDropdown, firstGraphChannelCounter);
    firstGraphChannelCounter++;
  }
});

addSecondSignalChannelInput.addEventListener("change", (submission) => {
  submission.preventDefault();
  const file = addSecondSignalChannelInput.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    const formDataObject = new FormData();
    formDataObject.append("secondsignaladdchannelinput", file);
    handleChannelFetch(
      formDataObject,
      secondSignalGraph,
      secondGraphChannelCounter,
      2
    );
    addToDropdown(secondDropdown, secondGraphChannelCounter);
    secondGraphChannelCounter++;
  }
});

linkingButton.addEventListener("click", () => {
  linkFlag = !linkFlag;
  if (linkFlag == true) {
    const indexone = firstcurrentindex;
    const indextwo = secondcurrentindex;
    //console.log(indexone);
    if(indexone > indextwo){
      secondGraphChannelCounter = 0;  
      // for (let i = 0; i < secondGraphData.length; i++) {
      //   Plotly.deleteTraces(secondSignalGraph, 0);
      //   console.log(secondSignalGraph.data);
      // }
      //   console.log(secondSignalGraph.data);
      Plotly.purge(secondSignalGraph);
      console.log(secondSignalGraph.data);
      Plotly.newPlot(secondSignalGraph, [], {});
      console.log(secondSignalGraph.data);
      for (let i = 0; i < secondGraphData.length; i++) {
        const { x: newX, y: newY, rest: newData } = splitData(secondGraphData[i],indexone)
        const x = newX;
        const y = newY;
        const rest = newData;
        setTimeout(() => {
          // traces = {
          //   x: x,
          //   y: y,
          //   name: `Channel ${secondGraphChannelCounter + 1}`,
          //   showlegend: true,
          //   type: "scatter",
          // };
          Plotly.addTraces(secondSignalGraph, {
            x: x,
            y: y,
            name: `Channel ${secondGraphChannelCounter + 1}`,
            showlegend: true,
            type: "scatter",
          });
          //console.log(rest)
          //console.log(secondGraphData);
          // plotly.newPlot(secondSignalGraph, [traces], {});
          plotSignal(rest,secondSignalGraph,2,secondGraphChannelCounter);
          secondGraphChannelCounter++;
        }, 100);
      }
    }
  }
  // linkingbutton.eventlistener("click", () => {
  //   linkFlag = !linkFlag;
  //   if (linkFlag == true) {
  //     const indexone = firstcurrentindex;
  //     const indextwo = secondcurrentindex;
  //     //console.log(indexone);
  //     if(indexone > secondcurrentindex){
  //       secondGraphChannelCounter = 0;
  //       Plotly.purge(secondSignalGraph);
  //       for (let i = 0; i < secondGraphData.length; i++) {
  //         const { x: newX, y: newY, rest: newData } = splitData(secondGraphData[i],indexone)
  //         const x = newX;
  //         const y = newY;
  //         const rest = newData;
  //         setTimeout(() => {
  //           Plotly.addTraces(secondSignalGraph, {
  //             x: x,
  //             y: y,
  //             name: `Channel ${secondGraphChannelCounter + 1}`,
  //             showlegend: true,
  //             type: "scatter",
  //           });
  //           plotSignal(rest,secondSignalGraph,2,secondGraphChannelCounter);
  //           secondGraphChannelCounter++;
  //         }, 100);
  //       } 
  //     }
  //   }
  // });
  
  firstSignalGraph.on("plotly_relayout", () => {
    linking(firstSignalGraph, secondSignalGraph, linkFlag);
  });
  secondSignalGraph.on("plotly_relayout", () => {
    linking(secondSignalGraph, firstSignalGraph, linkFlag);
  });
});

firstGraphColor.addEventListener("change", () => {
  changeChannelColor(firstDropdown, firstSignalGraph, firstGraphColor.value);
});

secondGraphColor.addEventListener("change", () => {
  changeChannelColor(secondDropdown, secondSignalGraph, secondGraphColor.value);
});

PlayPauseone.addEventListener("click", function () {
  isFirstPlaying = !isFirstPlaying;
});
PlayPausetwo.addEventListener("click", function () {
  isSecondPlaying = !isSecondPlaying;
});

firstRewind.addEventListener("click", function () {
  if (firstGraphFinish) {
    allFirstGraphTraces = [];
    getAllGraphTraces(firstSignalGraph, 1);// gets all traces in first graph each signal=2Darray
    firstGraphChannelCounter = 0;
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
        plotSignal(
          allFirstGraphTraces[i],
          firstSignalGraph,
          1,
          firstGraphChannelCounter
        );
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
        plotSignal(
          allSecondGraphTraces[i],
          secondSignalGraph,
          1,
          secondGraphChannelCounter
        );
        secondGraphChannelCounter++;
      }, 100);
    }
  }
});

createPDFButton.addEventListener("click", async () => {
  allFirstGraphTraces = [];
  allSecondGraphTraces = [];
  getAllGraphTraces(firstSignalGraph, 1);
  getAllGraphTraces(secondSignalGraph, 2);
  var imgOpts = {
    format: "png",
    width: 500,
    height: 400,
  };
  let imgData1;
  let imgData2;
  allFirstGraphTraces.length!=0? imgData1 = await Plotly.toImage(firstSignalGraph, imgOpts):null;
  allSecondGraphTraces.length!=0? imgData2= await Plotly.toImage(secondSignalGraph, imgOpts):null;
  // const imgData1 = await Plotly.toImage(firstSignalGraph, imgOpts);
  // const imgData2 = await Plotly.toImage(secondSignalGraph, imgOpts);
  await createPDF(
    allFirstGraphTraces,
    allSecondGraphTraces,
    imgData1,
    imgData2
  );
}); 


async function createPDF(tracesArr1,tracesArr2,imgData1,imgData2) {
  await fetch("/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      statistics1: signal_statistics(tracesArr1),
      statistics2: signal_statistics(tracesArr2),
      img1: imgData1,
      img2: imgData2,
    }),
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

function signal_statistics(traces) {
  // Extract the column of values and duration from the data
  let allStatistics=[]
  for(i=0;i<traces.length;i++){
    const durationColumn = traces[i][0];//.map((row) => parseFloat(row[0]));//xaxis
    const column =traces[i][1];//.map((row) => parseFloat(row[1]));//yaxis

  // Compute the average of the values column
  const average = column.reduce((sum, value) => sum + value) / column.length;

  // Compute the standard deviation of the values column
  const variance =
    column.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) /
    (column.length - 1);
  const standardDeviation = Math.sqrt(variance);

  // Compute the minimum and maximum values in the values column
  const minValue = Math.min(...column);
  const maxValue = Math.max(...column);

  // Compute the duration of the signal
  const duration =
    durationColumn[durationColumn.length - 1] - durationColumn[0];

  let statistics= {
    var: variance,
    std: standardDeviation,
    avg: average,
    min: minValue,
    max: maxValue,
    duration: Math.abs(duration),
  };
  allStatistics.push(statistics);
}
return allStatistics;
}