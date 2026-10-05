import { Queue, Worker } from 'bullmq';
import { Subscription } from '../models/subscription.model.js';
import{User} from "../models/user.model.js"
import {redis} from '../db/redis.js';


     const SubscriptionQueue = new Queue('SubscriptionQueue', { 
    connection: redis 
});


const SubscriptionWorker = new Worker('SubscriptionQueue', async (job) => {
    const { user_id, channel_id } = job.data;
    const existingSubscription = await Subscription.findOne({ 
        subscriber: user_id, 
        channel: channel_id 
    });
     
    let action='subscribe'

    if (!existingSubscription) {
        
        await Subscription.create({ subscriber: user_id, channel: channel_id });
    } else {
        action ='unsubscribe'
        await existingSubscription.deleteOne();
    }
    const channelUser = await User.findById(channel_id).select("username");
    
    if (channelUser) {
        const cacheKey = `channel_profile:${channelUser.username.toLowerCase()}`;
        
      
        const cachedData = await redis.get(cacheKey);
        
        if (cachedData) {
            let profile = JSON.parse(cachedData);
            
           
            if (action === 'subscribe') {
                profile.subsCount += 1;
            } else {
                profile.subsCount = Math.max(0, profile.subsCount - 1);
            }
            
           
            await redis.set(cacheKey, JSON.stringify(profile));
        }
    }

},{
    connection:redis
});

SubscriptionWorker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err.message);
});

export{
    SubscriptionQueue,
    SubscriptionWorker
}