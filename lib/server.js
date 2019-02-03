const dateFormat 	= require('dateformat');
const fs          	= require('fs');
const path        	= require("path");
const _        		= require("underscore");
const request  		= require("request");
const Api 			= require('./api');

class Server extends Api{
	constructor(app, config){
		super(app, config, {});
		
	}
	init(){
	}
	
	formData(formData, callback){
		console.log('server formdata', formData);
		request.post(this.config.endpoint, {formData}, this.callback(callback));
	}
	json(json, callback){
		request.post(this.config.endpoint, {json}, this.callback(callback));
	}
	sendFiles(files, task, callback){
		request.post(this.config.endpoint, {
			formData:{
				task,
				attachments: files.map((filePath)=>{
					return fs.createReadStream(filePath)
				})
			}
		}, this.callback(callback));
	}
	
	callback(callback){
		return (err, httpResponse, body) => {
			if(err){
				callback({error:"Please try again later.(ERROR:SS100)"});
				return console.error('upload failed:', err);
			}
			console.log('server body:', body);
			if(_.isString(body)){
				try{
					var result = JSON.parse(body)
				}catch(e){
					return callback({error:"Please try again later.(ERROR:SS101)"});
				}
			}else{
				var result = body;
			}

			if(!result.success)
				return callback({error:"Invalid server responce. (ERROR:SS102)"});

			this.log('Upload successful!  Server responded with:', result);
			callback(null, result)
		}
	}
}

module.exports = Server;