const _        		= require("underscore");
class Api{
	constructor(app, config, defaults){
		this.app = app;
		this.config = _.extend(defaults, config || {});
		this.init();
	}
	log(...args){
		args.unshift(this.constructor.name+"::");
		console.log.apply(console, args);
	}
	renderEmailTpl(tplName, data, callback){
		this.app.app.render("email/"+tplName, data, (err, result)=>{
			this.log("renderEmailTpl:err, result", err, result)
			callback(err, result)
		});
	}
}

module.exports = Api;