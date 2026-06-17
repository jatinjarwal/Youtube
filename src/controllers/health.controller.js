import asynchandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const healthStatus= asynchandler(async(req,res)=>{
   
    return res.status(200)
    .json(new ApiResponse(200,{},"OK"))


    
})

export{
    healthStatus
}