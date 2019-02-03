const dateFormat 	= require('dateformat');
const fs          	= require('fs');
const path        	= require("path");
const _        		= require("underscore");
const nodemailer 	= require('nodemailer');
const Api 			= require('./api');

class Mailer extends Api{
	constructor(app, config){
		super(app, config, {});
	}
	init(){
		this.transporter = nodemailer.createTransport(this.config.transport);
	}
	send(args, callback){
		this.transporter.sendMail(args, (err, result)=>{
			this.log("Mailer:transporter.sendMail:err, result", err, result)
			if(err)
				return callback({error:err})

			callback(null, {success:true});
		})
	}
	sendImage(args, callback){
		var c = this.config;
		var filePath = this.app.buildImagePath(args.filename);
		var cid = Date.now()+"@InfinitySelfieMirror.com";
		var options = {
			to: args.email,
			from: c.from,
			subject: c.subject,
			text: c.text,
			attachments:[{
				filename: "InfinitySelfieMirror.jpg",
				path: filePath,
				cid
			}]
		}

		this.log("sendImage:options", options)

		this.renderEmailTpl("photo", {options, imageCID:cid}, (err, html)=>{
			if(err)
				return callback(err);

			//this.log("renderEmailTpl:err, html", err, html)

			options.html = html;
			this.send(options, (err, result)=>{
				this.log("sendImage:err, result", err, result)
				if(err)
					return callback({error:err})

				callback(null, {success:true});
			})
		})
	}

	sendImages(args, callback){
		var c = this.config;
		this.log("sendImages:args", args)

		var attachments = [];
		_.each(args.images, (image, index)=>{
			attachments.push({
				filename:'InfinitySelfieMirror-'+index+'.jpg',
				path: this.app.buildThumbPath(image),
				cid: Date.now()+(Math.random()*10000000).toFixed(0)+"@InfinitySelfieMirror.com"
			})
		})

		//var imageCIDs = attachments.map((o)=>{return o.cid; });

		var options = {
			to: args.email,
			from: c.from,
			subject: c.subject,
			text: c.text,
			attachments
		}

		this.log("sendImages:options", options)
		var imagesLink = this.app.config.server.imagesLink;
		this.renderEmailTpl("photos", {
			options, attachments, imagesLink, hash:args.hash,
			time:this.time()
		}, (err, html)=>{
			if(err)
				return callback(err);

			//this.log("renderEmailTpl:err, html", err, html)

			options.html = html;
			this.send(options, (err, result)=>{
				this.log("sendImages:err, result", err, result)
				if(err)
					return callback({error:err})

				callback(null, {success:true});
			})
		})
	}
	time(){
		return dateFormat(new Date(), "yyyy mmmm dd HH:MM:ss");
	}
}

module.exports = Mailer;