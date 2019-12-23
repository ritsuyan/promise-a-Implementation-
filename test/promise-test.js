
const MyPromise = require('../promise-chapter-4')
const expect = require('expect.js')
describe('#promise-4.js', () => {
    describe('#promise-test()', () => {
        it('同步promise', () => { 
            return new MyPromise(resolve => resolve('666')).then(res => {
                console.log(res)
                expect(res).to.be('666')}) 
        })
        it('异步promise', () => { 
            return new MyPromise(resolve => {
                setTimeout(() => {
                    resolve('666')
                }, 1000);
            }).then(res => {
                console.log(res)
                expect(res).to.be('666')}) 
        })
    })
})

