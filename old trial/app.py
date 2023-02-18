from flask import Flask, render_template, redirect, url_for, request, Response
import pandas as pd #reads csv file
import wfdb #reads dat and hea file directly
import numpy as np #signals library
#import scipy.io #reads hea file but needs numpy
# Handle the HTTP request
app = Flask(__name__)

@app.route('/',methods=["POST","GET"])
def getpath():
    if request.method == 'POST':
        file = request.files.get('uploadedsignal') #uploadedsignal is the name attribute of the input element
        filename = file.filename
        # check format type and choose the correct way to read it (dont forget to download the required library to read such files)
        if filename[-3:]=='csv':
            signal = pd.read_csv(filename, header=None) #dataframeobject
        elif filename[-3:]=='dat' or filename[-3:]=='hea':
            signal = wfdb.rdrecord(filename) #record object
            print(signal)
        # sample that data after reading it
        #ONE WAY IS TO USE CHART.JS , ANOTHER WAY IT TO USE plotly.graph_objs AND plotly.express USING PYTHON AND CONVERT IT INTO AN HTML STRING THAT CONTAINS THE PLOT
        # transform that data into json (jsonify it )
        # send it back to the web and use chart.js to draw the plot on web
    return render_template("/index.html")    

if __name__ == '__main__':
    app.run(debug=True)
