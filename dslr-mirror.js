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
        this.gphoto = new GPhoto(this.config.ghoto);


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
    }


    init(){
    	var app = this.app;
    	app.use((req, res, next)=>{
    		res.locals.jsFiles = [];
    		next();
    	});

    	app.get("/", (req, res, next)=>{
    		res.render("index", {page:{title: "Please click to take a great selfie"}});
    	});

    	app.post("/api/action/capture", (req, res)=>{
    		var result = {
    			success:true
    		}

    		this.gphoto.capture(()=>{
    			res.json(result);
    		})
    		
    	})


    	app.use(express.static("http"))
    }

}


new App(__dirname);
