originalSignal = document.getElementById("originalsignal");
sampledSignal = document.getElementById("sampledsignal");
Plotly.plot(
  originalSignal,
  [
    {
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 4, 8, 16],
    },
  ],
  {
    margin: { t: 0 },
  },
  { showSendToCloud: true }
);

Plotly.plot(
  sampledSignal,
  [
    {
      x: [1, 2, 3, 4, 5],
      y: [1, 2, 4, 8, 16],
    },
  ],
  {
    margin: { t: 0 },
  },
  { showSendToCloud: true }
);
/* Current Plotly.js version */
console.log(Plotly.BUILD);
