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
	
	send(formData, method, callback){
		console.log('server formdata', formData);
		request.post(this.config.endpoint, {formData}, this.callback(callback));
	}

	json(json, callback){
		request.post(this.config.endpoint, {json}, this.callback(callback));
	}
	
	callback(callback){
		return (err, httpResponse, body) => {
		  if(err){
			  callback({error:"Please try again later.(ERROR:SS100)"});
			return console.error('upload failed:', err);
		  }
		  console.log('server body:', body);
		  try{
			var result = JSON.parse(body)
		  }catch(e){
			  return callback({error:"Please try again later.(ERROR:SS101)"});
		  }
		  
		  if(!result.success){
			  return callback({error:"Invalid server responce. (ERROR:SS102)"});
		  }
		  
		  //console.log('Upload successful!  Server responded with:', httpResponse, body);
		  callback(null, result)
		}
	}
	
	post(data, callback){
		this.send(data, 'post', callback);
	}
}

module.exports = Server;