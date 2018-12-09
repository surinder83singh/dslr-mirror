const fs          = require('fs');
const path        = require("path");
const _           = require('underscore');
const express     	= require('express');
const ejs     		= require('ejs');
const GPhoto 		= require('./lib/gphoto');


class App {
    constructor(__dirname){
    	this.appFolder = __dirname;
    	this.readConfig();

        this.app   = express();
        this.gphoto = new GPhoto(this, this.config.gphoto);


        this.app.engine("ejs", ejs.renderFile);
        this.app.set("view engine", "ejs");



        const port  = 3000;
        this.app.listen(port, () => {
        	console.log(`App listening on port ${port}!`)
        });


        this.initStaticParams();

        this.init();
    }

    readConfig(){
    	this.configFile = path.join(this.appFolder, "config", "config.json");
    	this.config 	= JSON.parse(fs.readFileSync(this.configFile)+"");
    }

    initStaticParams(){
    	let locals = this.app.locals;
    	locals.siteName = this.config.siteName;
    	locals._ = _;
    	locals.counterConfig = this.config.counter;
    }


    init(){
    	var testing = true;
    	var app = this.app;
    	app.use((req, res, next)=>{
    		res.locals.jsFiles = [];
    		next();
    	});

    	app.get("/", (req, res, next)=>{
    		res.render("index", {page:{title: "Please click to take a great selfie"}});
    	});

    	app.get("/image/:filename", (req, res, next)=>{
    		var filename = req.params.filename;
    		var file = this.gphoto.buildFilePath(filename);
    		res.writeHead(200, {'content-type':'image/jpg'});
			fs.createReadStream(file).pipe(res);
    	});

    	app.post("/api/action/capture", (req, res)=>{
    		var result = {
    			success:true
    		}
    		if(testing){
    			result.filename = "http://192.168.178.56:3000/image/20181209_051032.jpg";
    			res.json(result);
    			return
    		}

    		this.gphoto.capture((err, r)=>{
    			if(err)
    				return res.json({error: "Could not capture image"});
    			console.log("filename", r.filename);
    			result.filename = "/image/"+r.filename;
    			res.json(result);
    		})
    		
    	})


    	app.use(express.static("http"))
    }

}


new App(__dirname);
