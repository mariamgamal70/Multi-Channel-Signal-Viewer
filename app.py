from flask import Flask, render_template, redirect, url_for, request, Response
# Handle the HTTP request
app = Flask(__name__)

@app.route('/',methods=["POST","GET"])
def getpath():
    if request.method == 'POST':
        file = request.files.get('uploadedsignal') #uploadedsignal is the name attribute of the input element
        
        # check format type and choose the correct way to read it (dont forget to download the required library to read such files)
        # sample that data after reading it
        # transform that data into json (jsonify it )
        # send it back to the web and use chart.js to draw the plot on web
        return render_template("/index.html",sampleddata , normaldata)
    return render_template("/index.html")    

if __name__ == '__main__':
    app.run(debug=True)
