const fs = require('fs')
const path = require('path');

const symbols = require('log-symbols')
const chalk = require('chalk');

function newMd(folder: string, fileName: string, buffer: string) {
    if(!fileName) {
        let folderPath = path.resolve(__dirname, `../../docs/post`)
        fileName = folder
        folder = 'post'
        isFileExisted(folderPath)
            .then(() => {}, () => {
                fs.mkdirSync(folderPath)
            })
    }
    const filePath = path.resolve(__dirname, `../../docs/${folder}/${fileName}.md`);
    console.log(chalk.blue('Create markdown file in: '), chalk.underline(filePath))
    console.log('')

    isFileExisted(filePath)
        .then((response) => {
            console.log(symbols.error, chalk.red(response));
        }, () => {
            fs.writeFile(filePath, buffer, function (err: Object) {
                if (err) console.log(symbols.error, chalk.red(err));
                else console.log(chalk.green(symbols.success, 'File created successfully!'));
            })
        });
}


function isFileExisted(file: string) {
    return new Promise(function (resolve, reject) {
        fs.access(file, (err: any) => {
            if (err) {
                reject(err.message);
            } else {
                resolve('File already exists!');
            }
        });
    })
}

module.exports = {
    isFileExisted,
    newMd
}