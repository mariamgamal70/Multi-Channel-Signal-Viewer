const express=require('express');
const bodyParser= require('body-parser');
const cors=require('cors');
const multer = require("multer");
const app=express();
const upload = multer({ dest: "uploads/" }); //dest is a property in multer has full path and name of file

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));/* used especially when making a form, return info in form of objects we can use ,with no complicated data thats why extended:false ,only return json data , not objects within objects*/
app.use(express.static('website'));
app.use(cors());
app.post('/upload', upload.single('file'), function (req, res, next) {})/*upload.single('file') -> file in here is supposed to be file name, next is a reference to the next middleware in the chain (chains middleware)*/

const port=5500
app.listen(port,()=>{console.log('server is on')});

//npm install express
//npm install cors
//npm install body-parser
//npm install node
//start server using node -serversidefilename-