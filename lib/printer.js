const process 		= require('./process');
const dateFormat 	= require('dateformat');
const fs          	= require('fs');
const path        	= require("path");
const _        		= require("underscore");
const Api       	= require("./api");

class Printer extends Api{
	constructor(app, config){
		super(app, config, {});
	}
	init(){
		//@TODO
		this.checkPrinter((result)=>{

		})
	}
	checkPrinter(callback){
		process("lpstat", ["-p"], (err, result)=>{
			this.log("checkPrinter:result", err, result)
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
			cwd: this.app.imageFolder
		},(err, result)=>{
			this.log("print:result", err, result)
			if(err)
				return callback({error: "Please try again later"});

			result.filename = filename;

			callback(null, result);
		})
	}
}

module.exports = Printer;