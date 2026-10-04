import Redis from 'ioredis'

const redis= new Redis(process.env.REDIS_URL);

redis.on("error",(err)=>{
    console.log(err,"failing to connect redis")
})
redis.on("connect",()=>{
    console.log("redis connected successfully")
})

const connectredis= async ()=>{
   await redis.connect();
}

export{
    redis,
    connectredis
}