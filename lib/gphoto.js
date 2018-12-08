const process = require('./process');
const dateFormat = require('dateformat');

class GPhoto{
	constructor(app, config){
		this.app = app;
		this.config = config || {folder:"event_xyz"};
		this.init();
	}
	init(){
		this.folder = path.join(this.app.appFolder, "..", this.config.folder);
		console.log("this.folder", this.folder)
		if(!fs.existsSync(this.folder))
			fs.mkdirSync(this.folder);

		//@TODO
		this.checkCamera((result)=>{

		})
	}
	checkCamera(callback){
		process("gphoto2", ["--auto-detect"], (err, result)=>{
			console.log("checkCamera:result", err, result)
		})
	}
	capture(callback){
		var filename = dateFormat(new Date(), "yyyymmdd_HHMMss");
		process("gphoto2", [
			//"--debug",
			"--capture-image-and-download",
			"--force-overwrite",
			"--filename="+filename+".jpg"
		], {
			cwd: this.folder
		},(err, result)=>{
			console.log("capture:result", err, result)
			if(err)
				return callback({error: "Please try again later"});

			callback(null, result)
		})
	}
}

module.exports = GPhoto;