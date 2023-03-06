<h1> Multi-Channel Signal Viewer</h1>
<h3>Table of contents</h3>

<h3>Introduction</h3>
<p> Develop a web application that illustrates multi-channel signal viewer that monitors the vital signals is a crucial aim in any ICU room</p>
<h3>Requirements</h3>
    <ul>
    <li>Contain two main identical graphs. The user can open different signals in each graph</li>
    <li>Each graph has to have its own UI controls such as:
    <ul> 
    <li>Zooming</li>
    <li>panning through the mouse movements</li>
    <li>Scrolling through sliders</li>
    <li>Cchanging color</li>
    <li>Adding a label/title for each signal</li>
    <li>Adding a label/title for each signal</li>
    <li>Pausing/playing/rewinding</li>
    <li>Exporting & Reporting ( PDF that has data statistics such as mean, std, duration, min and max values for each signal ) </li>
    </ul>
    </li>
    <li>Link both graphs via a button in the UI. When the graphs are linked, the two graphs must display the same time frames, signal speed</li>
</ul>
<h3>Project Structure</h3>
<p>The web app is built using:
<ul>
    <li>Frontend: 
    <ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>Javascript</li>
    <li>Bootstrap</li>
    </ul>
    </li>
    <li>Backend:
    <ul>
    <li>Node.js</li>
    <li>Express.js</li>
    </ul></li>
</ul>

<h3>Run the project</h3>
<ol>
<li>Download the project</li> 
<li>Download the following packages through the terminal:
<br><code>npm install</code> <br>
to download all the packages in package.json which are: express, cors, body-parser, node, fs, csv-parser, path, plotly, binary-parser, pdfkit, pdfkit-table, papaparse, util
or download each package manually by writing <br>
<code>npm install -packagename-</code>
</li>
<li>Then run the server by writing this in the terminal : 
<br><code> node server.js </code></li>
</ol>