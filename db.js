const home = process.env.HOME || require('os').homedir()
const path = require('path')
const fs = require("fs");
const dbPath = path.join(home, '.todo')

const db = {
    read(path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {flag: 'a+'}, (err, data) => {
                if (err) return reject(err)

                let list
                try {
                    list = JSON.parse(data.toString())
                } catch (err2) {
                    list = []
                }
                resolve(list)

            })
        })

    },
    write(list, path = dbPath) {
        return new Promise((resolve, reject) => {
            const string = JSON.stringify(list)
            fs.writeFile(path, string, err => {
                if (err) return reject(err)
                resolve()

            })
        })

    }
}
module.exports = db
