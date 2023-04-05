//----------------------------------------------DOM VARIABLES---------------------------------------------
const firstSignalGraph = document.getElementById("firstsignalgraph");
const secondSignalGraph = document.getElementById("secondsignalgraph");
const addFirstSignalChannelInput = document.getElementById("firstsignaladdchannelinput");
const addSecondSignalChannelInput = document.getElementById("secondsignaladdchannelinput");
const linkingButton = document.getElementById("linkingbutton");
const createPDFButton = document.getElementById("Export");
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
let minTick ;
let maxTick ;
let firstCurrentIndex;
let secondCurrentIndex;
let continued=true;

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
    getAllGraphChannels(firstSignalGraph, 1);
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
    getAllGraphChannels(secondSignalGraph, 2);
    //reset number of channels in first graph
    secondGraphChannelCounter = 0;
    //deletes all traces in first graph
    for (let deleteIterator = 0; deleteIterator < allSecondGraphTraces.length; deleteIterator++) {
      Plotly.deleteTraces(secondSignalGraph, 0);
    }
    //replots all traces all over again
    for (let addIterator = 0; addIterator < allSecondGraphTraces.length; addIterator++) {
      //settimeout is used to wait for the data to load 
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
  getAllGraphChannels(firstSignalGraph, 1);
  getAllGraphChannels(secondSignalGraph, 2);
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
function plotSignal(data, graphElement, graphNum, channelCounter = 0) {
  //if first channel set the minTick=0 and maxTick=4 that is going to change to view plot as if realtime
  if(channelCounter==0 ){
    minTick = 0;
    maxTick = 4;
  }

  //set index=0 to increment to go through all the points in signal
  let index = 0;
  let plottingInterval;
  let checkPlayingInterval;
  let time;
  Plotly.relayout(graphElement, { "xaxis.fixedrange": false, dragmode: "pan" });
  
  //function that plots point by point and change the time interval accordingly to plot dynamically
  function actualPlotting() {
    if (index < data.length &&((isFirstPlaying && graphNum === 1) || (isSecondPlaying && graphNum === 2))) {
      const row = data[index];
      //const prevrow=data[index-1];
      if(channelCounter == 0){
        graphNum==1 ? firstCurrentIndex = index:secondCurrentIndex = index
      }
      index++;
      Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [channelCounter,]);

    //if condition used to change the time interval dynamically
      if (row[0] > maxTick) {
        minTick = maxTick;
        maxTick += 4;
        Plotly.relayout(graphElement, {
          "xaxis.range": [minTick, maxTick],
          "xaxis.tickmode": "linear",
          "xaxis.dtick": 1,
        });
      } 
       // Get current x-axis range
      const currentRange = graphElement.layout.xaxis.range;
       // Adjust x-axis range if necessary
        if (row[0] < currentRange[0] || row[0] > currentRange[1]) {
          minTick = row[0];
          maxTick = row[0] + 4;
          Plotly.relayout(graphElement, {
            "xaxis.range": [minTick, maxTick],
            "xaxis.tickmode": "linear",
            "xaxis.dtick": 1,
          });
        }

      //check if plotting is finished or no, if yes, then user can rewind
      graphNum === 1 ? (firstGraphFinish = false) : (secondGraphFinish = false);
    } else {
      if (index === data.length) {
        graphNum === 1 ? (firstGraphFinish = true) : (secondGraphFinish = true);
      }
      clearInterval(plottingInterval);
    }
  }

//function that starts plotting asynchronously
  function startInterval() {
    graphNum === 1 ? (time = firstIntervalTime) : (time = secondIntervalTime);
    if (plottingInterval) {
      clearInterval(checkPlayingInterval);
      clearInterval(plottingInterval);
    }
    plottingInterval = setInterval(actualPlotting, time);
    checkPlaying();
  }

//function used to check if it is currently plotting, used for play and pause
//if the plotting function is called again on clicking play/pause it calls start plottingInterval 
//that then calls checkPlaying that checks if boolean variables are true, 
//it clears the plotting plottingInterval until called again with false boolean variable
  function checkPlaying() {
    checkPlayingInterval = setInterval(() => {
      if ((isFirstPlaying && graphNum === 1) || (isSecondPlaying && graphNum === 2 && index < data.length)) {
        startInterval();
      }
    }, 100);
  }

//start plotting 
  startInterval();
  
  //eventlistener for cine speed sliders
  firstCineSpeed.addEventListener("change", () => {
    firstIntervalTime = parseInt(firstCineSpeed.value);
    //restart plottingInterval in order to apply speed changes
    startInterval();
  });
  secondCineSpeed.addEventListener("change", () => {
    secondIntervalTime = parseInt(secondCineSpeed.value);
    //restart plottingInterval in order to apply speed changes
    startInterval();
  });
}

//function that handles data fetch requests
function handleChannelFetch(formObject, graphElement, channelCounter, graphNum) {
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
      let time=[],amplitude=[],restData=ChannelData;
      //plot statically initially using x and y then plot dynamically using rest
      if(graphNum==1){
        const { time: newTime, amplitude: newAmplitude, restData: newData } = splitData(ChannelData,firstCurrentIndex)
        time = newTime;
        amplitude = newAmplitude;
        restData = newData;
      }else{
        const { time: newTime, amplitude: newAmplitude, restData: newData } = splitData(ChannelData,firstCurrentIndex)
        time = newTime;
        amplitude = newAmplitude;
        restData = newData;
      }
    graphNum==1? firstGraphData.push(ChannelData):secondGraphData.push(ChannelData);
    Plotly.addTraces(graphElement, {
      x: time,
      y: amplitude,
      name: `Channel ${channelCounter + 1}`,
      showlegend: true,
      type: "scatter",
    });
    plotSignal(restData, graphElement, graphNum, channelCounter);
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
  let channelNum = counter + 1;
  newChannel.value = `Channel${channelNum}`;
  newChannel.textContent = `Channel${channelNum}`;
  dropdownElement.appendChild(newChannel);
  dropdownElement.value = `Channel${channelNum}`;
}

//function that changes color of the selected channel in dropdown
function changeChannelColor(dropdownElement, graphElement, selectedColor) {
  const channelIndex = dropdownElement.selectedIndex;
  Plotly.restyle(graphElement, { "line.color": `${selectedColor}` }, [channelIndex]);
}

//function that adds all channels into its global array
function getAllGraphChannels(graphElement, graphNum) {
  let channels = graphElement.data;
  for (channelIndex = 0; channelIndex < channels.length; channelIndex++) {
    const channelTime = channels[channelIndex].x;
    const channelAmplitude = channels[channelIndex].y;
    let channelsArr = [];
    for (let channelDataIterator = 0; channelDataIterator < channelTime.length; channelDataIterator++) {
      channelsArr.push([channelTime[channelDataIterator], channelAmplitude[channelDataIterator]]);
    }
    graphNum === 1 ? allFirstGraphTraces.push(channelsArr) : allSecondGraphTraces.push(channelsArr);
  }
}

//function that splits channel data into part that is plotted statically and dynamically
function splitData(data, lastPlottedIndex) {
  //data to plot statically
  const time = [];
  const amplitude = [];
  //data to plot dynamically
  const restData = [];
  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const row = data[rowIndex];
    if (rowIndex < lastPlottedIndex) {
      time.push(row[0]);
      amplitude.push(row[1]);
    } else {
      restData.push(row);
    }
  }
  return { time, amplitude, restData };
}

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
      const anchorElement = document.createElement("a");
      anchorElement.href = url;
      anchorElement.download = "output.pdf";
      anchorElement.click();
    });
}

function signal_statistics(channels) {
  // Extract the column of values and duration from the data
  let allStatistics=[]
  for (channelNumIndex = 0; channelNumIndex < channels.length; channelNumIndex++) {
    //xaxis
    const durationColumn = channels[channelNumIndex][0];
    //yaxis
    const column = channels[channelNumIndex][1];
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
    let statistics = {
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
