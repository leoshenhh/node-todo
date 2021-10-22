const db = require('../db')
const fs = require('fs')

jest.mock('fs')


describe('db', () => {
    it('can read', async () => {
        const data = [{title: '1233',done: true}]
        fs.setReadFileMock('/xxx',null,JSON.stringify(data))
        const list = await db.read('/xxx')
        expect(list).toStrictEqual(data)
    })
    it('can write', () => {
        fs.setWriteFileMock('/xxx',(path,data)=>{

        })
    })
})
