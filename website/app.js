//----------------------------------------------DOM VARIABLES---------------------------------------------
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
//---------------------------------------GLOBAL VARIABLES---------------------------------------------------
let firstGraphData=[];
let secondGraphData=[];
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
let mintick ;
let maxtick ;
let firstcurrentindex;
let secondcurrentindex;
let continued=true;
// let secondmintick ;
// let secondmaxtick ;

//------------------------------------------EVENT LISTENERS-------------------------------------------------
addFirstSignalChannelInput.addEventListener("change", (submission) => {
  //ADDS SIGNAL TRACE
  submission.preventDefault();
  const file = addFirstSignalChannelInput.files[0];
  if (!file) {
    alert("No file selected");
  } else {
    const formDataObject = new FormData();
    formDataObject.append("firstsignaladdchannelinput", file);
    //fetch the data from backend
    handleChannelFetch(formDataObject,firstSignalGraph,firstGraphChannelCounter,1);
    //add channel to dropdown
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
    //fetch the data from backend
    handleChannelFetch(formDataObject,secondSignalGraph,secondGraphChannelCounter,2);
    //add channel to dropdown
    addToDropdown(secondDropdown, secondGraphChannelCounter);
    secondGraphChannelCounter++;
  }
});

//UI button to link graphs
linkingButton.addEventListener("click", () => {
  //flag initially set to false
  linkFlag = !linkFlag;
  //apply changes from first graph onto the second graph in case of zooming and panning
  firstSignalGraph.on("plotly_relayout", () => {
    linking(firstSignalGraph, secondSignalGraph, linkFlag);
  });
  //apply changes from second graph onto the first graph in case of zooming and panning
  secondSignalGraph.on("plotly_relayout", () => {
    linking(secondSignalGraph, firstSignalGraph, linkFlag);
  });
});

//UI button to change color of first graph
firstGraphColor.addEventListener("change", () => {
  changeChannelColor(firstDropdown, firstSignalGraph, firstGraphColor.value);
});

//UI button to change color of second graph
secondGraphColor.addEventListener("change", () => {
  changeChannelColor(secondDropdown, secondSignalGraph, secondGraphColor.value);
});

//UI button to play/pause first graph
PlayPauseone.addEventListener("click", function () {
  //flag initially set to true
  isFirstPlaying = !isFirstPlaying;
});

//UI button to play/pause second graph
PlayPausetwo.addEventListener("click", function () {
  //flag initially set to true
  isSecondPlaying = !isSecondPlaying;
});

//UI button to rewind if plotting is finished; by  deleting traces and replotting them
firstRewind.addEventListener("click", function () {
  if (firstGraphFinish) {
    //clears global array for second graph traces
    allFirstGraphTraces = [];
    // gets all traces in second graph each 2Darray signal to push into the global graph traces array again
    getAllGraphTraces(firstSignalGraph, 1);
    //reset number of channels in first graph
    firstGraphChannelCounter = 0;
    //deletes all traces in first graph
    for (let deleteIterator = 0; deleteIterator < allFirstGraphTraces.length; deleteIterator++) {
      Plotly.deleteTraces(firstSignalGraph, 0);
    }
    //replots all traces all over again
    for (let addIterator = 0; addIterator < allFirstGraphTraces.length; addIterator++) {
      setTimeout(() => {
        Plotly.addTraces(firstSignalGraph, {
          x: [],
          y: [],
          name: `Channel ${firstGraphChannelCounter + 1}`,
          showlegend: true,
          type: "scatter",
        });
        plotSignal(allFirstGraphTraces[addIterator],firstSignalGraph,1,firstGraphChannelCounter);
        firstGraphChannelCounter++;
      }, 100);
    }
  }
});

//UI button to rewind if plotting is finished; by  deleting traces and replotting them
secondRewind.addEventListener("click", function () {
  if (secondGraphFinish) {
    //clears global array for first graph traces
    allSecondGraphTraces = [];
    // gets all traces in first graph each 2Darray signal to push into the global graph traces array again
    getAllGraphTraces(secondSignalGraph, 2);
    //reset number of channels in first graph
    secondGraphChannelCounter = 0;
    //deletes all traces in first graph
    for (let deleteIterator = 0; deleteIterator < allSecondGraphTraces.length; deleteIterator++) {
      Plotly.deleteTraces(secondSignalGraph, 0);
    }
    //replots all traces all over again
    for (let addIterator = 0; addIterator < allSecondGraphTraces.length; addIterator++) {
      setTimeout(() => {
        Plotly.addTraces(secondSignalGraph, {
          x: [],
          y: [],
          name: `Channel ${secondGraphChannelCounter + 1}`,
          showlegend: true,
          type: "scatter",
        });
        plotSignal(allSecondGraphTraces[addIterator],secondSignalGraph,1,secondGraphChannelCounter);
        secondGraphChannelCounter++;
      }, 100);
    }
  }
});

createPDFButton.addEventListener("click", async () => {
  //clear global array and then push the channels into them again to avoid array data repetition
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
  await createPDF(allFirstGraphTraces,allSecondGraphTraces,imgData1,imgData2);
  // const imgData1 = await Plotly.toImage(firstSignalGraph, imgOpts);
  // const imgData2 = await Plotly.toImage(secondSignalGraph, imgOpts);
}); 

//----------------------------------------------FUNCTIONS---------------------------------------------------

//create initial empty plots
document.onload = createPlot(firstSignalGraph);
document.onload = createPlot(secondSignalGraph);

//function to create plot
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
    //able to change channel names and graph title
    editable: true,
    //remove logo of plotly
    displaylogo: false,
    //remove unused buttons
    modeBarButtonsToRemove: ["toImage", "zoom2d", "lasso2d","pan2d"],
  };

  Plotly.newPlot(graphElement, [], layout, config);
}

//main plotting function
function plotSignal(data, graphElement, graphno, channelCounter = 0) {
  //if first channel set the mintick=0 and maxtick=4 that is going to change to view plot as if realtime
  if(channelCounter==0 ){
    mintick = 0;
    maxtick = 4;
  }
  // else if(channelCounter==0 && graphno==2){
  //   secondmintick = 0;
  //   secondmaxtick = 4;
  // }

  //set index=0 to increment to go through all the points in signal
  let index = 0;
  let interval;
  let checkPlayingInterval;
  let time;
  Plotly.relayout(graphElement, { "xaxis.fixedrange": false, dragmode: "pan" });
  
  //function that plots point by point and change the time interval accordingly to plot dynamically
  function actualplotting() {
    if (index < data.length &&((isFirstPlaying && graphno === 1) || (isSecondPlaying && graphno === 2))) {
      const row = data[index];
      //const prevrow=data[index-1];
      if(channelCounter == 0){
        graphno==1 ? firstcurrentindex = index:secondcurrentindex = index
      }
      index++;
      //if(row[0]>=prevrow[0]){
      Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [channelCounter,]);
    //}

    //if condition used to change the time interval dynamically
      if (row[0] > maxtick) {
        mintick = maxtick;
        maxtick += 4;
        Plotly.relayout(graphElement, {
          "xaxis.range": [mintick, maxtick],
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

      //check if plotting is finished or no, if yes, then user can rewind
      graphno === 1 ? (firstGraphFinish = false) : (secondGraphFinish = false);
    } else {
      if (index === data.length) {
        graphno === 1 ? (firstGraphFinish = true) : (secondGraphFinish = true);
      }
      clearInterval(interval);
    }
  }

//function that starts plotting asynchronously
  function startInterval() {
    graphno === 1 ? (time = firstIntervalTime) : (time = secondIntervalTime);
    if (interval) {
      clearInterval(checkPlayingInterval);
      clearInterval(interval);
    }
    interval = setInterval(actualplotting, time);
    checkPlaying();
  }

//function used to check if it is currently plotting, used for play and pause
//if the plotting function is called again on clicking play/pause it calls start interval 
//that then calls checkPlaying that checks if boolean variables are true, 
//it clears the plotting interval until called again with false boolean variable
  function checkPlaying() {
    checkPlayingInterval = setInterval(() => {
      if ((isFirstPlaying && graphno === 1) || (isSecondPlaying && graphno === 2 && index < data.length)) {
        startInterval();
      }
    }, 100);
  }

//start plotting 
  startInterval();
  
  //eventlistener for cine speed sliders
  firstCineSpeed.addEventListener("change", () => {
    firstIntervalTime = parseInt(firstCineSpeed.value);
    //restart interval in order to apply speed changes
    startInterval();
  });
  secondCineSpeed.addEventListener("change", () => {
    secondIntervalTime = parseInt(secondCineSpeed.value);
    //restart interval in order to apply speed changes
    startInterval();
  });
}

//function that handles data fetch requests
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
      //if(channelCounter!=0){ 
        //plot statically initially using x and y then plot dynamically using rest
        if(graphno==1){
          const { x: newX, y: newY, rest: newData } = splitData(ChannelData,firstcurrentindex)
          x = newX;
          y = newY;
          rest = newData;
        }else{
          const { x: newX, y: newY, rest: newData } = splitData(ChannelData,firstcurrentindex)
          x = newX;
          y = newY;
          rest = newData;
        }
      //}
      // else{
      //   if(graphno==2){
      //     const { x: newX, y: newY, rest: newData } = splitData(ChannelData,firstcurrentindex)
      //     x = newX;
      //     y = newY;
      //     rest = newData;
      //   }
      //}
      graphno==1? firstGraphData.push(ChannelData):secondGraphData.push(ChannelData);
      Plotly.addTraces(graphElement, {
        x: x,
        y: y,
        name: `Channel ${channelCounter + 1}`,
        showlegend: true,
        type: "scatter",
      });
      plotSignal(rest, graphElement, graphno, channelCounter);
    })
    .catch((error) => console.error(error));
}

//function that links speed slider 
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

//linking function
function linking(firstGraph, secondGraph, linkFlag) {
  if (linkFlag == true) {
    var xaxis = firstGraph.layout.xaxis;
    //var yaxis = firstGraph.layout.yaxis;
    //link time frame 
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
    //link speed
    linkSpeed();
  } else {
    //unlink speed
    secondIntervalTime = parseInt(secondCineSpeed.value);
    firstIntervalTime = parseInt(firstCineSpeed.value);
  }
}

//function that add to dropdown list the added channels
function addToDropdown(dropdownElement, counter) {
  let newChannel = document.createElement("option");
  let num = counter + 1;
  newChannel.value = `Channel${num}`;
  newChannel.textContent = `Channel${num}`;
  dropdownElement.appendChild(newChannel);
  dropdownElement.value = `Channel${num}`;
}

//function that changes color of the selected channel in dropdown
function changeChannelColor(dropdownElement, graphElement, color) {
  const channelIndex = dropdownElement.selectedIndex;
  Plotly.restyle(graphElement, { "line.color": `${color}` }, [channelIndex]);
}

//function that adds all channels into its global array
function getAllGraphTraces(graphElement, graphNum) {
  let traces = graphElement.data;
  for (traceIndex = 0; traceIndex < traces.length; traceIndex++) {
    const traceX = traces[traceIndex].x;
    const traceY = traces[traceIndex].y;
    let traceXY = [];
    for (let tracedataIterator = 0; tracedataIterator < traceX.length; tracedataIterator++) {
      traceXY.push([traceX[tracedataIterator], traceY[tracedataIterator]]);
    }
    graphNum === 1 ? allFirstGraphTraces.push(traceXY) : allSecondGraphTraces.push(traceXY);
  }
}

//function that splits channel data into part that is plotted statically and dynamically
function splitData(data, endIndex) {
  //data to plot statically
  const x = [];
  const y = [];
  //data to plot dynamically
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
  return {x,y,rest};
}

// //function to get the maximum data
// function getMaxMin(data) {
//   let max = 0;
//   let length = 0;
//   for (i = 0; i < data.length; i++) {
//     data[i][0] > max ? (max = data[i][0]) : null;
//     length++;
//   }
//   return { max: Math.round(max), length: length };
// }

//function that creates pdf
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
    //xaxis
    const durationColumn = traces[i][0];
    //yaxis
    const column =traces[i][1];
  // Compute the average of the values column
  const average = column.reduce((sum, value) => sum + value) / column.length;
  // Compute the standard deviation of the values column
  const variance =
    column.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) / (column.length - 1);
  const standardDeviation = Math.sqrt(variance);
  // Compute the minimum and maximum values in the values column
  const minValue = Math.min(...column);
  const maxValue = Math.max(...column);
  // Compute the duration of the signal
  const duration = durationColumn[durationColumn.length - 1] - durationColumn[0];
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
