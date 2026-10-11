import Redis from 'ioredis'

const redis_Url=process.env.REDIS_URI;
if(!redis_Url){
    console.warn("REDIS_URL is missing. Check your environment variables.");
}
const redis= new Redis(redis_Url,{
    maxRetriesPerRequest: null,
    tls: { rejectUnauthorized: false },
    family: 4 
});

redis.on("error",(err)=>{
    console.log(err,"failing to connect redis")
})
redis.on("connect",()=>{
    console.log("redis connected successfully")
})



export{
    redis
}