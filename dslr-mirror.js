const fs          = require('fs');
const path        = require("path");
const _           = require('underscore');
const express     	= require('express');
const ejs     		= require('ejs');
const GPhoto 		= require('./lib/gphoto');
const Printer       = require('./lib/printer');
const bodyParser    = require('body-parser');


class App {
    constructor(__dirname){
    	this.appFolder = __dirname;
    	this.readConfig();

        this.app   = express();
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());

        this.gphoto = new GPhoto(this, this.config.gphoto);
        this.printer = new Printer(this, this.config.printer);
        this.copyDummyImage();


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
        var localConfigFile = path.join(this.appFolder, "config", "config-local.json");
        if(fs.existsSync(localConfigFile)){
            var localConfig     = JSON.parse(fs.readFileSync(localConfigFile)+"");
            this.config = _.extend(this.config, localConfig);
        }
    }

    copyDummyImage(){
        var filePath = path.join(this.gphoto.folder, "dummy.jpg");
        if(fs.existsSync(filePath))
            return;
        var content = fs.readFileSync(path.join(this.appFolder, "http", "img", "dummy.jpg"));
        fs.writeFileSync(filePath, content);
    }

    initStaticParams(){
    	let locals = this.app.locals;
    	locals.siteName = this.config.siteName;
    	locals._ = _;
    	locals.counterConfig = this.config.counter;
    }

    init(){
    	var testing = !!this.config.testing;
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
    		var result = {success:true};

    		if(testing){
    			result.image     = "/image/dummy.jpg";//file://"+this.gphoto.folder.replace(/\\/g, "/")+"/dummy.jpg";
                result.filename  = "dummy.jpg";
    			res.json(result);
    			return
    		}

    		this.gphoto.capture((err, r)=>{
    			if(err)
    				return res.json({error: "Could not capture image"});

    			console.log("filename", r.filename);
    			result.image = "/image/"+r.filename;
                result.filename = r.filename;
    			res.json(result);
    		});
    	});

        app.post("/api/action/print", (req, res)=>{
            var result  = {success:true};
            var data    = req.body;
            var filename = data.filename;

            this.printer.print(filename, (err, r)=>{
                if(err)
                    return res.json({error: "Could not print image"});
                res.json(result);
            });
        });

    	app.use(express.static("http"))
    }

}


new App(__dirname);
