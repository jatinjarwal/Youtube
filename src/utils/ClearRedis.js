import {redis} from "../db/redis.js"
const ClearRedis= async function (username){
    await redis.del(`channel_profile:${username.toLowerCase()}`);
    
}
export default ClearRedis;