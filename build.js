const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const dbFolderPath = path.join(__dirname, 'db');
const fileNames = []; // Add more file names as needed

// Step one: Delete and recreate the files
function deleteAndRecreateFiles() {
    return new Promise((resolve, reject) => {
        const deletePromises = fileNames.map((fileName) => {
            const filePath = path.join(dbFolderPath, fileName);

            return new Promise((resolve, reject) => {
                fs.unlink(filePath, (err) => {
                    if (err && !fs.existsSync(filePath)) {
                        console.error('Error deleting file:', err);
                        reject(err);
                        return;
                    }
                    fs.writeFile(filePath, '', (err) => {
                        if (err) {
                            console.error('Error recreating file:', err);
                            reject(err);
                            return;
                        }
                        console.log('Recreated file:', filePath);
                        resolve();
                    });
                });
            });
        });

        Promise.all(deletePromises)
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Step two: Run 'yarn run build' script
function runBuildScript() {
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

// Execute the steps sequentially
deleteAndRecreateFiles()
    .then(() => runBuildScript())
    .then(() => {
        console.log('Build script completed successfully.');
    })
    .catch((error) => {
        console.error('Error encountered:', error);
    });
