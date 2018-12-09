const { spawn } = require('child_process');

function process(command, args, options, callback) {
	if(!callback){
		callback = options;
		options = {};
	}
	let called = false;
	let cb = (err, result)=>{
		if(called)
			return;
		called = true;
		callback(err, result);
	}

	console.log("command:: "+command+" "+args.join(" "))
	let cmd;
	try{
		cmd = spawn(command, args || [], options);
	}catch(e){
		console.log("e", e)
	}

	var result = {};
	cmd.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
		result.data = data+"";
	});
	cmd.on('error', (data) => {
		console.log(`error: ${data}`);
		result.errorData = data+"";
		cb(result);
	});

	cmd.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
		result.errorData = data+""
	});

	cmd.on('close', (code) => {
		console.log(`child process exited with code ${code}`);
		result.code = code;
		if(result.errorData)
			return cb(result);
		cb(null, result);
	});
}

module.exports = process;