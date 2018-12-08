const process = require('./process');
const dateFormat = require('dateformat');

class GPhoto{
	constructor(config){
		this.config = config || {prefix:"event_xyz"};
	}
	init(){
		this.checkCamera((result)=>{

		})
	}
	checkCamera(callback){
		process("gphoto2", ["--auto-detect"], (err, result)=>{
			console.log("checkCamera:result", err, result)
		})
	}
	capture(callback){
		var d = dateFormat(new Date(), "yyyymmdd_HHMMss");
		var filename = this.config.prefix+"_"+d;
		process("gphoto2", [
			"--debug",
			"--capture-image-and-download",
			"--force-overwrite",
			"--filename="+filename+".jpg"
		], (err, result)=>{
			console.log("capture:result", err, result)
			if(err)
				return callback({error: "Please try again later"});

			callback(null, result)
		})
	}
}

module.exports = GPhoto;