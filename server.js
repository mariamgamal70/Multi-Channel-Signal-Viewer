const port=5500

/*INCLUDE MODULES*/
const express=require('express');
const bodyParser= require('body-parser');
const cors=require('cors');
const multer = require("multer");
const app=express();
const upload = multer({ dest: "uploads/" }); //dest is a property in multer has full path and name of file
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");


/*USING MIDDLEWARES*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));/* used especially when making a form, return info in form of objects we can use ,with no complicated data thats why extended:false ,only return json data , not objects within objects*/
app.use(cors());

/*CONNECTS STATIC FILES TO BACKEND */
app.use(express.static('website'));

/*ENDPOINTS*/
app.post('/upload',upload.single('uploadedsignal'),(req, res, next)=>{
const file = req.file; //multer reads the file and saves it in object called file
const fileName = file.originalname;
//const fileData = file.buffer;
const fileExtension = path.extname(file.originalname);
fs.readFile(fileName,(err, data) => {
if (err) {
    console.error(err);
} else {
    if(fileExtension=='.csv'){ //data is an array of objects
        csv.parse(data);
        console.log(data.toString());
    }
}
})

})/*upload.single('file') -> file in here is supposed to be file name, next is a reference to the next middleware in the chain (chains middleware)*/
app.get('/recieveupload',(req,res)=>{})
app.listen(port,()=>{console.log(`server is on http://localhost:${port}`);});

//npm install express
//npm install cors
//npm install body-parser
//npm install node
//npm install fs
//npm install csv-parser
//npm install path
//start server using node -serversidefilename-