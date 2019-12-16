/*
*** base framework 
*** accept an executor function which has two function parameter named resolve and reject.
*** status machine: when call resolve function if current status is PENDING then turn it to FUIFILLED
*** while execute reject function then turn the state to REJECTED
*/
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise {
    constructor (executor) {
        this.value = null;
        this.reason = null;
        this.state = PENDING;
        try {
            executor(this.resolve,this.reject)
        } catch (reason) {
            this.reject(reason)
        }
    }
    resolve (value) {
        if(this.state === PENDING) {
            this.state = FULFILLED
        }
    }
    reject (reason) {
        if(this.state === PENDING) {
            this.state = REJECTED
        }
    }
}

// let p = new MyPromise((resolve, reject) => {resolve(123)})