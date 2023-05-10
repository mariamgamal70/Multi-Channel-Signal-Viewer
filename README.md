<h1> Multi-Channel Signal Viewer</h1>
<h3>Table of contents</h3>
<a href="#introduction">Introduction</a><br>
<a href="#requirements">Requirements</a><br>
<a href="#projectstructure">Project Structure</a><br>
<a href="#projectfeatures">Project Features</a><br>
<a href="#runtheproject">Run the project</a><br>
<a href="#team">Team members</a><br>

<h3 id="introduction">Introduction</h3>
<p> A web application that illustrates a real time signal using a multi-channel signal viewer.</p>
<h3 id="requirements">Requirements</h3>
    <ul>
    <li>Contain two main identical graphs. The user can open different signals in each graph</li>
    <li>Each graph has to have its own UI controls such as:
    <ul> 
    <li>Zooming</li>
    <li>panning through the mouse movements</li>
    <li>Scrolling through sliders</li>
    <li>Changing color</li>
        ![](data/readme%20data/feature%20gifs/color%20change%20gif)
    <li>Adding a label/title for each signal</li>
        
    <li>Pausing/playing/rewinding</li>
    <li>Exporting & Reporting ( PDF that has data statistics such as mean, std, duration, min and max values for each signal ) </li>
    </ul>
    </li>
    <li>Link both graphs via a button in the UI. When the graphs are linked, the two graphs must display the same time frames, signal speed</li>
</ul>
<h3 id="projectfeatures">Project Features</h3>


https://user-images.githubusercontent.com/104398513/230252169-5cfad823-3deb-488c-958c-54e23758562d.mp4


<h3 id="projectstructure">Project Structure</h3>
<p>The web app is built using:
<ul>
    <li><h4>Frontend: </h4>
    <ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>Javascript</li>
    <li>Bootstrap</li>
    </ul>
    </li>
    <li><h4>Backend:</h4>
    <ul>
    <li>Node.js</li>
    <li>Express.js</li>
    </ul></li>
</ul>

```
master
├─ website (Front-end)
│  ├─ app.js
│  ├─ plotly-2.18.2.min
|  ├─ style.css
|  └─ index.html
├─ data 
│  ├─ datasets
|  └─ project statement
├─ .gitattributes
├─ .gitignore
├─ readme.txt
├─ package
├─ package-lock
└─ server.js (Back-end)
```

<h3 id="runtheproject">Run the project</h3>
<ol>
<li>Download the project</li> 
<li>Download the following packages through the terminal:
<br><code>npm install</code> <br>
to download all the packages in package.json which are: express, cors, body-parser, node, fs, csv-parser, path, plotly, binary-parser, pdfkit, pdfkit-table, papaparse, util
or download each package manually by writing <br>
<code>npm install -packagename-</code>  
</li>
<li>Run the server by writing this in the terminal : 
<br><code> node server.js </code></li>
</ol>

<h3 id="team">Team</h3>
<p>Biomedical Signal Processing (SBEN311) class task created by:</p>
<table>
  <thead>
    <tr>
      <th>Team Members</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://github.com/NadaAlfowey">Nada Mohamed</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/AbdulmonemElsherif">Abdulmonem Elsherif</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/asmaakhaledd">Asmaa Khalid</a></td>
    </tr>
    <tr>
      <td><a href="https://github.com/mariamgamal70">Mariam Gamal</a></td>
    </tr>
  </tbody>
</table>
<h2>Submitted to:</h2>
<ul>
<li>Dr. Tamer Basha &amp; Eng. Christina Adly</li>
</ul>
