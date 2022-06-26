const db = require("../db.js");
const fs = require("fs");
jest.mock("fs");

describe("db", () => {
    // 在每一个测试用例执行后删除缓存
    afterEach(() => {
        fs.clearMocks()
    });
    it("can read", async () => {
        expect(db.read instanceof Function).toBe(true);
        const mockData = [{ title: "mockTitle", done: true }];
        fs.setReadFileMock("/xxx", null, JSON.stringify(mockData));
        /**
         * 也就是说在db.read方法中我们并没有通过fs.readFile去真实的读文件，
         * 而是只是将fs.setReadFileMock的参数传给callback
         */
        /**
         * 测试读文件的逻辑，只要我们最终读到的文件和预期相符那就代表成功，其次就是需要mock readFile的逻辑
         * 核心就是mock其callback让其执行便好
         */
        const list = await db.read("/xxx")
        expect(list).toStrictEqual(mockData);
    })
    it("can write", async () => {
        expect(db.write instanceof Function).toBe(true);
        let mockFile;
        fs.setWriteFileMock("/zzz", (path, data, callback) => {
            mockFile = data;
            callback(null);
        })
        /**
         * 测试写文件的逻辑，核心是mock writeFile方法，只要我们让需要被写入的目标内容被记录就好，
         * 之后就是让其回调函数正常执行
         */
        const list = [{ title: '吃饭', done: true }, { title: "写代码", done: true }];
        await db.write(list, "/zzz");
        expect(mockFile).toBe(JSON.stringify(list) + "\n");
    })
})
