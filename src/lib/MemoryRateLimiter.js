class MemoryRateLimiter{
    constructor(){}

    consumer(uniqueId,limitedCalls=10,windowPeriod=1){
        console.log(uniqueId)
        const throttle = new Promise((resolve,reject)=>{
            
        })

    }
}

module.exports = MemoryRateLimiter