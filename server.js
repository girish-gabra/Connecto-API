var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var hostname = 'localhost';
var port = 7777;

var app = express();
app.use(bodyParser.json());


var Storage = multer.diskStorage({
	destination: function(req,file,callback){
		callback(null,"./Images")
	},
	filename: function(req,file,callback){
		//var changedName = 
		var fileNumber=0;
		fs.readdir(__dirname+"/Images",function(err,files){
			if(err)	{
				console.log(err);
				return;
			}	
			// increment the number for the next file
			fileNumber=files.length+1;
			var originalName = file.originalname;
			var index = originalName.lastIndexOf(".");
			var changedName =  fileNumber+originalName.substr(index);
			callback(null,changedName);
		});
		
	}
});

var upload = multer({
     storage: Storage
 }).array("fileUpload"); 

app.get("/", function(req, res) {
     res.sendFile(__dirname + "/public/index.html");
 });
app.post("/post/Upload", function(req, res) {
     upload(req, res, function(err) {
         if (err) {
         	 console.log("error in uploading file"+err);
             return res.end("Something went wrong!");
         }
         return res.end("File uploaded sucessfully!.");
     });
 });


app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});