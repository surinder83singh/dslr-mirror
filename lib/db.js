const _        		= require("underscore");
const Api 			= require('./api');
const MongoClient 	= require('mongodb').MongoClient;

class DB extends Api{
	constructor(app, config){
		super(app, config, {url:'mongodb://localhost:27017', dbname:'dslr'});
	}

	init(){
		// Connect using MongoClient
		MongoClient.connect(this.config.url, (err, client)=>{
			if(err)
				return this.log("MongoClient.connect:error", err)
			if(!client)
				return this.log("MongoClient.connect:no client")
			// Use the admin database for the operation
			this.db = client.db(this.config.dbname);
			this.log("this.db", this.db)

			const adminDb = this.db.admin();
			// List all the available databases
			adminDb.listDatabases((err, dbs)=>{
				console.log("dbs", dbs)
				//client.close();
			});
		});
	}
}

module.exports = DB;