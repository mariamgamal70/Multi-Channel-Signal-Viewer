from flask import Flask, render_template, redirect, url_for, request
# Handle the HTTP request
app = Flask(__name__)

@app.route('/',methods=["POST","GET"])
def getpath():
    if request.method == 'POST':
        filePath = request.form['filePath']
        print(filePath)
    return render_template("/index.html")    
if __name__ == '__main__':
    app.run(debug=True)
