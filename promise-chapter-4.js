/*
*** add resolvePromise function
*/ 
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise {
    constructor (executor) {
        this.value = null;
        this.reason = null;
        this.state = PENDING;
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []
        try {
            executor(this.resolve.bind(this),this.reject.bind(this))
        } catch (reason) {
            this.reject(reason)
        }
    }
    resolve (value) {
        //console.log(value,this.onFulfilledCallbacks)
        if(this.state === PENDING) {
            this.state = FULFILLED
            this.value = value
            this.onFulfilledCallbacks.forEach(fulfilledCallback => {
                fulfilledCallback()
            });
        }
    }
    reject (reason) {
        if(this.state === PENDING) {
            this.state = REJECTED
            this.reason = reason
            this.onRejectedCallbacks.forEach(rejectedCallback => {
                rejectedCallback()
            });
        }
    }

    then (onFulfilled, onRejected){
        //if (typeof onFulfilled)
        let promise2 = null;
        //console.log(onFulfilled.toString())
        promise2 = new MyPromise((resolve,reject) => {
            if(this.state === PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    try {
                       
                      let x = onFulfilled(this.value);
                      this.resolvePromise(promise2, x, resolve, reject)
                    } catch (reason) {
                        reject(reason)
                    }
                });
                this.onRejectedCallbacks.push(() => {
                    try {
                      let x = onRejected(this.reason);
                      this.resolvePromise(promise2, x, resolve, reject);
                    } catch(reason) {
                      reject(reason);
                    }
                });
            }
            if(this.state === FULFILLED){
                try {
                    
                    let x = onFulfilled(this.value)
                    this.resolvePromise(promise2, x, resolve, reject);
                } catch (reason) {
                    reject(reason)
                }
                
            }
            if(this.state === REJECTED){
                try {
                    let x = onRejected(this.reason)
                    this.resolvePromise(promise2, x, resolve, reject);
                } catch (reason) {
                    reject(reason)
                }
            }

        });
        return promise2;
    }

    resolvePromise(promise2, x, resolve, reject){
       // let called = false;
       // promise2 当前需要返回的promise x 需要拿到为完成时的值 ==> promise2.resolve(val)
       //console.log('需要拿到为完成态的值',x)
        if(promise2 === x){
            return reject(new TypeError('Circular reference'));
        }
        if (x !== null && (Object.prototype.toString.call(x) === '[object Object]' || Object.prototype.toString.call(x) === '[object Function]')) {
            try {
                let then = x.then;
                if(typeof then === 'function'){
                     // x.then(onFulfilled,onRejected)
                    then.call(x, (y) => {
                     //   if(called) return; called = true;
                     //console.log('this',this)
                        this.resolvePromise(promise2, y, resolve, reject)
                    }, (reason) => {
                        if(called) return; called = true;
                        reject(reason)
                    })
                } else {
                    if(called) return; called = true;
                    resolve(x)
                }
            } catch (reason) {
                if(called) return; called = true; reject(reason)
            }
        } else {resolve(x)}
    }
}

module.exports = MyPromise
