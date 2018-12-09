const process 		= require('./process');
const dateFormat 	= require('dateformat');
const fs          	= require('fs');
const path        	= require("path");
const _        		= require("underscore");
const Api 			= require('./api');

class GPhoto extends Api{
	constructor(app, config){
		super(app, config, {});
	}
	init(){
		//@TODO
		this.checkCamera((result)=>{

		})
	}
	checkCamera(callback){
		process("gphoto2", ["--auto-detect"], (err, result)=>{
			this.log("checkCamera:result", err, result)
		})
	}
	capture(callback){
		var filename = dateFormat(new Date(), "yyyymmdd_HHMMss")+".jpg";
		process("gphoto2", [
			//"--debug",
			"--capture-image-and-download",
			"--force-overwrite",
			"--filename="+filename
		], {
			cwd: this.app.imageFolder
		},(err, result)=>{
			this.log("capture:result", err, result)
			if(err)
				return callback({error: "Please try again later"});

			//result.file = this.buildFilePath(filename);
			result.filename = filename;

			callback(null, result);
		})
	}
}

module.exports = GPhoto;