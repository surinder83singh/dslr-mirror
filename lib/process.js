const { spawn } = require('child_process');

function process(command, args, callback) {
	let called = false;
	let cb = (err, result)=>{
		if(called)
			return;
		called = true;
		callback(err, result);
	}

	console.log("command:::: "+command+" "+args.join(" "))

	let cmd = spawn(command, args || []);

	var result = {};
	cmd.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
		result.data = data;
	});

	cmd.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
		result.errorData = data;
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