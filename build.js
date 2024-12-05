const {exec} = require('child_process');

const runBuildScript = () => {
	return new Promise((resolve, reject) => {
		exec('yarn run build', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing 'yarn run build' command: ${error.message}`);
				reject(error);
				return;
			}
			if (stderr) {
				console.error(`Command error: ${stderr}`);
				reject(stderr);
				return;
			}
			console.log(`Command output: ${stdout}`);
			resolve();
		});
	});
}


runBuildScript()
	.then(() => {
		console.log('Build script completed successfully.');
	})
	.catch((error) => {
		console.error('Error encountered:', error);
	});