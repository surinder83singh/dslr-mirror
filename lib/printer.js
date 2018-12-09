const process 		= require('./process');
const dateFormat 	= require('dateformat');
const fs          	= require('fs');
const path        	= require("path");
const _        		= require("underscore");

class Printer{
	constructor(app, config){
		this.app = app;
		this.config = _.extend({
			folder:"event_xyz"
		}, config || {});

		this.init();
	}
	init(){
		this.folder = path.join(this.app.appFolder, "..", this.config.folder);
		console.log("Printer:folder", this.folder)
		if(!fs.existsSync(this.folder))
			fs.mkdirSync(this.folder);
		//@TODO
		this.checkPrinter((result)=>{

		})
	}
	checkPrinter(callback){
		process("lpstat", ["-p"], (err, result)=>{
			console.log("Printer:checkPrinter:result", err, result)
		})
	}
	print(filename, args, callback){
		if(!callback){
			callback = args;
			args = [];
		}
		args = args.slice(0);
		args.unshift(filename);

		process("lp", args, {
			cwd: this.folder
		},(err, result)=>{
			console.log("Printer:print:result", err, result)
			if(err)
				return callback({error: "Please try again later"});

			result.filename = filename;

			callback(null, result);
		})
	}
	buildFilePath(filename){
		return path.join(this.folder, filename);
	}
}

module.exports = Printer;