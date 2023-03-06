let firstSignalData;
let secondSignalData;

const firstSignalGraph = document.getElementById("firstsignalgraph");
const secondSignalGraph = document.getElementById("secondsignalgraph");

const addFirstSignalChannelInput = document.getElementById("firstsignaladdchannelinput");
const addSecondSignalChannelInput = document.getElementById("secondsignaladdchannelinput");

const linkingButton = document.getElementById("linkingbutton");

const createpdf1 = document.getElementById("Export1");
const createpdf2 = document.getElementById("Export2");

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
    // zoommode: false,
  };
  let config = {
    editable: true,
    displaylogo: false,
    modeBarButtonsToRemove: ["toImage", "zoom2d", "lasso2d","pan2d"],
  };

  Plotly.newPlot(graphElement, [], layout, config);
}

function plotSignal(data, graphElement, graphno, channelCounter = 0) {
  // let xData = data.map((row) => row[0]);
  // let xMin = Math.min(...xData);
  let xMin = 0;
  let xMax ;
  // let yData = data.map((row) => row[1]);
  // let yMin = Math.min(...yData);
  // let yMax = Math.max(...yData);

  let i = 0;
  let mintick = 0;
  let maxtick = 4;
  let interval;
  let checkPlayingInterval;
  let time;
  Plotly.relayout(graphElement, { "xaxis.fixedrange": false, dragmode: "pan" });
  // Plotly.react(graphElement, [trace], layout, { editable: true, displaylogo: false, modeBarButtonsToRemove: ['toImage', 'zoom2d', 'lasso2d', 'pan2d'], displayModeBar: true });
  let plot = graphElement._fullLayout;

  function actualplotting() {
    if (
      i < data.length &&
      ((isFirstPlaying && graphno === 1) || (isSecondPlaying && graphno === 2))
    ) {
      const row = data[i];
      i++;
      Plotly.extendTraces(graphElement, { x: [[row[0]]], y: [[row[1]]] }, [
        channelCounter,
      ]);
      if (row[0] > maxtick) {
        mintick = maxtick;
        maxtick += 4;
        Plotly.relayout(graphElement, {
          "xaxis.range": [mintick, maxtick],
          "xaxis.tickmode": "linear",
          "xaxis.dtick": 1,
        });
      }
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
  

  function limitsUpdate()
  {
    let xaxis = plot.xaxis;
    // let yaxis = plot.yaxis;
    let xRange = xaxis.range;
    // let yRange = yaxis.range;
    if (xRange[0] < xMin) {
      // xaxis.range = [xMin, xRange[1] - xRange[0] + xMin];
      xaxis.range = [ 0, maxtick ];
    } else if (xRange[1] > xMax) {
      // xaxis.range = [xMax - (xRange[1] - xRange[0]), xMax];
      xMin=mintick;
      xaxis.range = [xMin, maxtick];
    }
    // if (yRange[0] < yMin) {
    //   yaxis.range = [yMin, yRange[1] - yRange[0] + yMin];
    // } else if (yRange[1] > yMax) {
    //   yaxis.range = [yMax - (yRange[1] - yRange[0]), yMax];
    // }
    Plotly.update(graphElement, {}, { "xaxis.range": xaxis.range});
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
      Plotly.addTraces(graphElement, {
        x: [],
        y: [],
        name: `Channel ${channelCounter + 1}`,
        showlegend: true,
        type: "scatter",
      });
      plotSignal(ChannelData, graphElement, graphno, channelCounter);
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
    console.log(linkFlag);
    var xaxis = firstGraph.layout.xaxis;
    var yaxis = firstGraph.layout.yaxis;
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
    // secondIntervalTime=firstIntervalTime;
    linkSpeed();
    // console.log("A", firstIntervalTime, secondIntervalTime);
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

function getAllGraphTraces(graphElement, num) {
  let traces = graphElement.data;
  for (i = 0; i < traces.length; i++) {
    const traceX = traces[i].x;
    const traceY = traces[i].y;
    let traceXY = [];
    for (let j = 0; j < traceX.length; j++) {
      traceXY.push([traceX[j], traceY[j]]);
    }
    num === 1
      ? allFirstGraphTraces.push(traceXY)
      : allSecondGraphTraces.push(traceXY);
  }
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

createpdf1.addEventListener("click", async () => {
  allFirstGraphTraces = [];
  getAllGraphTraces(firstSignalGraph, 1);
  var imgOpts = {
    format: "png",
    width: 500,
    height: 400,
  };
  const imgData = await Plotly.toImage(firstSignalGraph, imgOpts);
  await createPDF(allFirstGraphTraces, imgData);
});

createpdf2.addEventListener("click", async () => {
  allSecondGraphTraces = [];
  getAllGraphTraces(secondSignalGraph, 2);
  var imgOpts = {
    format: "png",
    width: 500,
    height: 400,
  };
  const imgData = await Plotly.toImage(secondSignalGraph, imgOpts);
  await createPDF(allSecondGraphTraces, imgData);
});

async function createPDF(tracesArr, imgData) {
  await fetch("/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ statistics: signal_statistics(tracesArr), img: imgData }),
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
  let allStatistics = []
  for (i = 0; i < traces.length; i++) {
    const durationColumn = traces[i][0];//.map((row) => parseFloat(row[0]));//xaxis
    const column = traces[i][1];//.map((row) => parseFloat(row[1]));//yaxis

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