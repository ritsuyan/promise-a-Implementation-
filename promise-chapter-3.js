/*
*** implementation chainning invoke then method.
*** then method return also a Promise Object which implicit invocation resolve method
*** this resolve method invoke value is the return value of last Promise onFulfilled 
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
        console.log(value,this.onFulfilledCallbacks)
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
        let promise2 = null;
        promise2 = new MyPromise((resolve,reject) => {
            if(this.state === PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    try {
                      let x = onFulfilled(this.value);
                      resolve(x)
                    //  this.resolvePromise(promise2, x, resolve, reject)
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
}

 let p = new MyPromise((resolve, reject) => {
     setTimeout(() => {
        resolve(123)
     }, 0);
    }).
  then(res => {console.log(res + 666);return 7}).
  then(res => {console.log(res)})