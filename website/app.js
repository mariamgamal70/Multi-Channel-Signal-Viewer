let originalSignalData;
let sampledSignalData;
const uploadForm=document.getElementById("uploadfile")
const originalSignal = document.getElementById("originalsignal");
const sampledSignal = document.getElementById("sampledsignal");
const fileElement=document.getElementById("fileinput");
const submitBtn=document.getElementById("submitbtn");


uploadForm.addEventListener('submit',(submission)=>{
  submission.preventDefault();
  const file=fileElement.files[0];
  if(!file){
    alert("No file selected");
  }
  else{
    const formDataObject = new FormData();
    formDataObject.append("signalfile", file);
    fetch("/", {
      maxContentLength: 10000000,
      maxBodyLength: 10000000,
      method: "POST",
      credentials: "same-origin",
      body: formDataObject,
    })
      .then((response) => {
        return response.text();
      })
      .then((responseMsg) => {
        console.log(responseMsg);
      })
      .catch((error) => console.error(error));
    }
});
// Plotly.plot(
//   originalSignal,
//   [
//     {
//       x: [1, 2, 3, 4, 5],
//       y: [1, 2, 4, 8, 16],
//     },
//   ],
//   {
//     margin: { t: 0 },
//   },
//   { showSendToCloud: true }
// );

// Plotly.plot(
//   sampledSignal,
//   [
//     {
//       x: [1, 2, 3, 4, 5],
//       y: [1, 2, 4, 8, 16],
//     },
//   ],
//   {
//     margin: { t: 0 },
//   },
//   { showSendToCloud: true }
// );
// /* Current Plotly.js version */
// console.log(Plotly.BUILD);
