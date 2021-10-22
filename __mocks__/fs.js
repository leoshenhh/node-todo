const fs = jest.genMockFromModule('fs')
const _fs = jest.requireActual('fs')

Object.assign(fs, _fs)

const readMocks = {}

fs.setReadFileMock = (path, error, data) => {
    readMocks[path] = [error, data]
    console.log(readMocks)
}

fs.readFile = (path, options, callback) => {
    if (callback === undefined) {
        callback = options
    }
    if (path in readMocks) {
        callback(...readMocks[path])
    } else {
        _fs.readFile(path, options, callback)
    }

}

const writeMocks = {}

fs.setWriteFileMock = (path, fn) => {
    writeMocks[path] = fn
}

fs.writeFile = (path,data,options,callback)=>{
    if(callback === undefined){options = callback}
    if(path in writeMocks){
        writeMocks[path](path,data,options,callback)
    }else{

    }
}


module.exports = fs
