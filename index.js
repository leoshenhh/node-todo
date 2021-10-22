const db = require('./db')
const inquirer = require("inquirer");

module.exports.add = async (title) => {
    // 读取之前的任务
    const list = await db.read()
    // 往里面添加一个任务
    list.push({title, done: false})
    // 储存任务到文件
    await db.write(list)

}

module.exports.clear = async (title) => {
    await db.write([])
}

module.exports.showAll = async () => {
    //  读取之前的任务
    const list = await db.read()
    showAllTasks(list)
    //  打印之前的任务

}

function showAllTasks(list){
    inquirer
        .prompt({
            type: 'list',
            name: 'index',
            message: '请选择你想操作的任务',
            choices: [{name: '退出', value: -1}, ...list.map((task, index) => {
                return {name: `${task.done ? '[x]' : '[_]'}${index + 1} - ${task.title}`, value: index}
            }), {name: '+ 创建任务', value: -2}]
        })
        .then(({index}) => {
            if (index >= 0) {
                askForAction(list,index)
            }
            if (index === -2) {
                // 选中创建任务
                askForAddTask(list)
            }
        });
}

function markAsDone(list,index){
    list[index].done = true;
    db.write(list)
}

function markAsUndone(list,index){
    list[index].done = false;
    db.write(list)
}

function updateTitle(list,index){
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: "新的标题",
        default: list[index].title
    }).then(({title}) => {
        list[index].title = title
        db.write(list)
    });
}

function remove(list,index){
    list.splice(index, 1)
    db.write(list)
}

function askForAction(list,index){
    const actions = {markAsDone, markAsUndone, updateTitle, remove}
    // 选中了一个任务
    inquirer.prompt({
        type: 'list',
        name: 'actionName',
        message: '请选择操作',
        choices: [
            {name: '退出', value: 'quit'},
            {name: '已完成', value: 'markAsDone'},
            {name: '未完成', value: 'markAsUndone'},
            {name: '改标题', value: 'updateTitle'},
            {name: '删除', value: 'remove'},
        ]
    }).then(({actionName}) => {
        const action = actions[actionName]
        action && action(list,index)
    })
}

function askForAddTask(list){
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: "输入任务标题"
    }).then(({title}) => {
        list.push({
            title,
            done: false
        })
        db.write(list)
    });
}
