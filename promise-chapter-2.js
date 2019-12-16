/*
*** add then function which accept two callback function named onFulfilled and onRejected 
*** the then function execute order is after resolve method. inner this then method should 
*** judge the state if state already fulfilled then execute onFulfilled(value) method or if 
*** state turn into rejected then execute onRejected(reason) method
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
                fulfilledCallback(this.value)
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
        if(this.state === PENDING) {
            this.onFulfilledCallbacks.push(onFulfilled);
        }
        if(this.state === FULFILLED){
            onFulfilled(this.value)
        }
        if(this.state === REJECTED){
            onRejected(this.reason)
        }
    }
}

 let p = new MyPromise((resolve, reject) => {
     setTimeout(() => {
        resolve(123)
     }, 0);
    }).
  then(res => {console.log(res + 666)})