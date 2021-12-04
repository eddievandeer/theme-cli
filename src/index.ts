#!/usr/bin/env node
export {}

const program = require('commander')
const download = require('download-git-repo')
const { newMd, changeConfig, changePackageJSON, toYmlArr, } = require('./utils')
const { initInquirer, createInquirer, configInquirer } = require('./inquirer')

const chalk = require('chalk');
const ora = require('ora')

const spinner = ora()

program.version('1.0.1')

program
    .command('init')
    .description('初始化目录结构')
    .action(() => {
        initInquirer()
            .then((choices: InitChoices) => {
                console.log(choices);
                spinner.start(chalk.blue(`Load file from git`))
                
                download("github:eddievandeer/vuepress-theme-vivek-template#main", `${process.cwd()}/${choices.title}`, (err: Object) => {
                    if (!err) {
                        spinner.succeed(chalk.blue('Load file from git'))
                        let buffer = '---\n' +
                            'categoriesPage: true\n' +
                            '---';
                        newMd('categories', 'README', buffer)
                        buffer = '---\n' +
                            'tagsPage: true\n' +
                            '---';
                        newMd('tags', 'README', buffer)
                        changePackageJSON(choices)
                    } else {
                        spinner.fail(chalk.redBright('Load file from git'))
                        console.info(err)
                        spinner.stop()
                    }
                })
            })
    })

program
    .command('new')
    .description('创建一个带初始化配置的新md文件')
    .action(() => {
        createInquirer()
            .then((choices: NewChoices) => {
                const { folder, fileName, title, category, tag, abstract } = choices
                const date = new Date().toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')

                const categories = category.split('-')
                const tags = tag.split(',')
                
                const buffer = '---\n' +
                        `title: ${title}\n` +
                        `postTime: ${date}\n` +
                        `categories: ${categories.length > 1 ? toYmlArr(categories) : category}\n` +
                        `tags: ${tags.length > 1 ? toYmlArr(tags) : tag}\n` +
                        '---\n' +
                        `${abstract ? '::: slot abstract\n\n在此填写摘要内容\n\n:::' : ''}`
        
                newMd(folder, fileName, buffer)
            })
    })

program
    .command('download <project>')
    .description('修改config')
    .action((project: string) => {
        spinner.start(chalk.blue(`Load file from git`))
        download("github:eddievandeer/vuepress-theme-vivek-template#main", `${process.cwd()}/${project}`, (err: Object) => {
            if (!err) {
              spinner.succeed(chalk.blue(`Load file from git`))
            } else {
              spinner.fail(chalk.redBright(`Load file from git`))
              console.info(err)
              spinner.stop()
            }
        })
    })

program
    .command('config')
    .description('修改config，但会使js对象的键变成字符串')
    .action(() => {
        configInquirer().then((choice: ConfigChoices) => {
            changeConfig(choice)
        })
    })

program.parse(process.argv)