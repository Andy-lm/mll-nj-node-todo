// Mac用户发包前执行这句话
// chmod +x cli.js     
const db = require("./db");
const inquirer = require("inquirer");

module.exports.add = async (title) => {
  // 这是面向接口编程的概念，所有操作都是从接口去取
  // 从根目录中读数据
  const list = await db.read();
  // 添加数据
  list.push({
    title,
    done: false,
  });
  // 将数据写进文件
  await db.write(list);
};

module.exports.clear = async () => {
  await db.write([]);
};

module.exports.showAll = async () => {
  // 读取文件
  const list = await db.read();
  if (!list || list.length === 0) console.log("任务数为零，请先去添加任务");
  // 打印所有的任务
  printAllTasks(list);
};

const printAllTasks = (list) => {
  // 打印之前的任务
  inquirer
    .prompt({
      type: "list",
      name: "index",
      message: "选择一个你想操作的任务",
      choices: [
        { name: "x 退出", value: "-1" },
        ...list.map((task, index) => {
          return {
            name: `${task.done ? "[x]" : "[_]"} ${index + 1}.${task.title}`,
            value: index.toString(),
          };
        }),
        { name: "+ 创建新任务", value: "-2" },
      ],
    })
    .then((answer) => {
      const index = parseInt(answer.index);
      if (index >= 0) {
        // 操作子任务
        askForTaskOption(list,index)
      } else if (index === -2) {
        inquirer
          .prompt({
            type: "input",
            name: "title",
            message: "输入任务标题",
          })
          .then((answer) => {
            list.push({ title: answer.title, done: false });
            db.write(list);
          });
      }
    });
};

/**
 * 任务操作
 */
const askForTaskOption = (list,index) => {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "请选择一个操作",
      choices: [
        { name: "退出", value: "quit" },
        { name: "已完成", value: "markAsDone" },
        { name: "未完成", value: "markAsUnDone" },
        { name: "改标题", value: "updateTitle" },
        { name: "删除", value: "remove" },
      ],
    })
    .then((answer2) => {
      // 取出相应的操作
      const operate = mapChoiceToTaskOptions[answer2.action]
      // 执行操作
      operate(list,index)
    });
};


const markAsDone = (list,index) => {
  list[index].done = true;
  db.write(list);
}

const markAsUnDone = (list,index) => {
  list[index].done = false;
  db.write(list);
}

const updateTitle = (list,index) => {
  inquirer
  .prompt({
    type: "input",
    name: "title",
    message: "请输入新标题",
    default: list[index].title,
  })
  .then((answer) => {
    list[index].title = answer.title;
    db.write(list);
  });
}

const remove = (list,index) => {
  list.splice(index, 1);
  db.write(list);
}

const mapChoiceToTaskOptions = {  
  markAsDone,
  markAsUnDone,
  updateTitle,
  remove
}
