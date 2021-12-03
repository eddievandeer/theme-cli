const fs = require('fs')
const path = require('path');

const symbols = require('log-symbols')
const chalk = require('chalk');
const ora = require('ora')

const spinner = ora()

interface InitChoices {
  title: string,
  description: string,
  author: string
}

interface NewChoices {
    folder: string,
    fileName: string,
    title: string,
    category: string,
    tag: string,
    abstract: boolean
}  

interface ConfigChoices extends InitChoices {
    appId: string,
    appKey: string
}

function newMd(folder: string, fileName: string, buffer: string) {
    const filePath = folderCheck(folder, fileName)
    
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

function folderCheck(folder: string, fileName: string) {
    const rootPath = process.cwd()
    let folderPath = path.resolve(rootPath, `./docs/${folder}`)

    if(!fileName) {
        folderPath = path.resolve(rootPath, `./docs/post`)
        fileName = folder
        folder = 'post'
    }
    isFileExisted(folderPath)
        .then(() => {}, () => {
            fs.mkdirSync(folderPath)
        })

    return folderPath + `/${fileName}.md`
}

function changeConfig(choices: ConfigChoices) {
    const configPath = `${process.cwd()}/docs/.vuepress/config.js`
    const themeConfigPath = `${process.cwd()}/docs/.vuepress/themeConfig.js`

    const _config = require(configPath)
    const _themeConfig = require(themeConfigPath)

    _config.title = choices.title
    _config.description = choices.description
    _themeConfig.author = choices.author
    _themeConfig.appId = choices.appId
    _themeConfig.appKey = choices.appKey
    _themeConfig.footer.createYear = new Date().getFullYear()

    modifyFile(configPath, 'config.js', `module.exports = ${JSON.stringify(_config, null, 4)}`)
    modifyFile(themeConfigPath, 'themeConfig.js', `module.exports = ${JSON.stringify(_themeConfig, null, 4)}`)
}

function changePackageJSON(choice: InitChoices) {
    const path = `${process.cwd()}/package.json`
    const _json = require(path)
    
    _json.name = choice.title
    _json.author = choice.author
    _json.description = choice.description
    
    modifyFile(path, 'package.json', `${JSON.stringify(_json, null, 2)}`)
}

function modifyFile(filePath: string, fileName: string, str: string|object) {
    spinner.start(chalk.blue(`Edit ${fileName}`))

    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err: Object, data: Object) => {
            if (err) throw err

            fs.writeFile(filePath, str, function (err: Object) {
                if (!err) {
                    spinner.succeed(chalk.blue(`Edit ${fileName}`))
                    resolve(true)
                } else {
                    spinner.fail(chalk.blue(`Edit ${fileName}`))
                    throw err
                }
            })
        })
    })
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

function toYmlArr(arr: string[]): string {
    let result = ''

    arr.forEach((item: string) => {
        result += '\n- ' + item
    })

    return result
}

module.exports = {
    isFileExisted,
    folderCheck,
    changeConfig,
    changePackageJSON,
    newMd,
    toYmlArr
}