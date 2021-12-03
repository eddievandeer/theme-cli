const inquirer = require('inquirer')

interface Questions {
    name: string,
    type: string,
    message: string
}

async function initInquirer() {
    const questions = [
        {
            name: 'title',
            type: 'input',
            message: '项目标题：',
            validate: (input: string) => {
                const reg: RegExp = /[\\\/:\*\?"<>\|]/g
                const trim: string = input.replace(/\s/g, '')

                if (trim.length == 0 || reg.test(input)) {
                    return '项目名称不合法'
                }
                return true
            }
        },
        {
            name: 'description',
            type: 'input',
            message: '描述：',
            default: 'description'
        },
        {
            name: 'author',
            type: 'input',
            message: '作者：',
            default: 'author'
        }
    ]

    return openInquirer(questions)
}

async function createInquirer() {
    const questions = [
        {
            name: 'folder',
            type: 'input',
            message: '文件所属文件夹：',
            default: 'post'
        },
        {
            name: 'fileName',
            type: 'input',
            message: '文件名：',
            validate: (input: string) => {
                const reg: RegExp = /[\\\/:\*\?"<>\|]/g
                const trim: string = input.replace(/\s/g, '')

                if (trim.length == 0 || reg.test(input)) {
                    return '文件命名不合法'
                }
                return true
            }
        },
        {
            name: 'title',
            type: 'input',
            message: '文章标题：'
        },
        {
            name: 'category',
            type: 'input',
            message: '文章分类(二级分类以 - 隔开)：',
            default: '默认分类',
            validate: (input: string) => {
                const arr = input.split('-')

                if (arr.length > 2) {
                    return '最多只支持二级分类'
                }
                return true
            }
        },
        {
            name: 'tag',
            type: 'input',
            message: '文章标签(二级标签以 , 隔开，可放空)：'
        },
        {
            name: 'abstract',
            type: 'confirm',
            message: '启用摘要？'
        }
    ]

    return openInquirer(questions)
}

async function configInquirer() {
    const questions = [
        {
            name: 'title',
            type: 'input',
            message: '项目标题：'
        },
        {
            name: 'description',
            type: 'input',
            message: '描述：'
        },
        {
            name: 'author',
            type: 'input',
            message: '作者：'
        },
        {
            name: 'appId',
            type: 'input',
            message: 'LeanCloud应用的appId'
        },
        {
            name: 'appKey',
            type: 'input',
            message: 'LeanCloud应用的appKey'
        }
    ]

    return openInquirer(questions)
}

function openInquirer(questions: Questions[]) {
    return new Promise((resolve, reject) => {
        inquirer
            .prompt(questions)
            .then((answers: any) => {
                resolve(answers)
            })
            .catch((err: any) => {
                reject(err)
            })
    })
}

module.exports = {
    initInquirer,
    createInquirer,
    configInquirer
}