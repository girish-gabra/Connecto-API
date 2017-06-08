var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var cors = require('cors');

var hostname = 'localhost';
var port = 7777;

var app = express();
app.use(bodyParser.json());
app.use(cors());

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

app.get("/getFileNames",function(req,res){
	//console.log("Get file names called");
	fs.readdir(__dirname+"/Images",function(err,files){
		if(files.length==0){
			res.send("No Files");
		}
		else{
			
			files-files.sort(function(a,b){
							return fs.statSync(__dirname+"/Images/"+b).mtime.getTime()-fs.statSync(__dirname+"/Images/"+a).mtime.getTime(); 
			});
			//console.log(files);
			var fileStr = files.toString();
			res.send(JSON.stringify(fileStr));
		}
	})
});

app.post("/uploadPost", function(req, res) {
	//console.log('uploadPost called');
     upload(req, res, function(err) {
         if (err) {
             return res.end("Something went wrong!");
         }
         return res.end("File uploaded sucessfully!.");
     });
 });

/*app.post("/uploadTest",function(req,res){
	console.log('uploadTest called');
	return res.end("test success");
});*/

app.get("/getPost/:fileName",function(req,res){
	
	var filename = req.params.fileName;
	//console.log(filename);
	var path = __dirname+"/Images/"+filename;
	if(fs.existsSync(path))	// check if file exists
	{
		res.sendFile(path);	
	}
	else{
		res.end("File Not Found");	// incase file is not present on server
	}
	
});


app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});