#!/usr/bin/env node

const program = require("commander");
const api = require("./index");
const pkg = require("./package.json");

// option只是在写-h的时候做提示的作用
program.version(pkg.version);

program
  .command("add <taskName>")
  .description("add a task")
  .action((...args) => {
    let words = args.slice(0, -1).join(" ");
    api
      .add(words.replace(" [object Object]", ""))
      .then(() => {
        console.log("添加成功！");
      })
      .catch((e) => {
        console.log("添加失败！", e);
      });
  });

program
  .command("clear")
  .description("clear all tasks")
  .action(() => {
    api
      .clear()
      .then(() => {
        console.log("清除成功！");
      })
      .catch((e) => {
        console.log("清除失败！", e);
      });
  });

program.parse(process.argv);

// 当用户只输入node cli.js时走到这里
if (process.argv.length === 2) {
  api.showAll();
}

console.log("-----running");

// must be before .parse() since
// node's emit() is immediate
