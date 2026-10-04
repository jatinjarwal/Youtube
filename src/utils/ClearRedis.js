const ClearRedis= async function (username){
    await redis.del(`channel_profile:${username.toLowerCase()}`);
    
}
export default ClearRedis;