const fs = jest.createMockFromModule('fs');
const _fs = jest.requireActual("fs");

Object.assign(fs, _fs);

// 读文件
let readMocks = {};

fs.setReadFileMock = (path, error, data) => {
    readMocks[path] = [error, data];
}

fs.readFile = (path, options, callback) => {
    if (callback === undefined) {
        callback = options
    }
    if (path in readMocks) {
        callback(...readMocks[path]);
    } else {
        // 个人理解一般不会走到这里
        _fs.readFile(path, options, callback);
    }
}

// 写文件
let writeMocks = {};

fs.setWriteFileMock = (path, fn) => {
    writeMocks[path] = fn;
}

fs.writeFile = (path, data, options, callback) => {
    if (path in writeMocks) {
        writeMocks[path](path, data, options, callback)
    } else {
        // 个人理解一般不会走到这里
        _fs.writeFile(path, data, options, callback);
    }
}

// 清楚缓存
fs.clearMocks = () => {
    readMocks = {};
    writeMocks = {};
}

module.exports = fs