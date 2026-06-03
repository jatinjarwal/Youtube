import mongoose from 'mongoose';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique:true,
        trim:true,
        lowercase:true,
        index:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        
    },
    avatar:{
        type:String,// using cloudinary
        required:true
    },
    coverImage:{
        type:String,// using cloudinary
        required:false
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
        required:false
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Video'
        }
    ]
}, { timestamps: true });



userSchema.pre('save', async function() {  
    if(!this.isModified('password')) return ;
    this.password = await bcrypt.hash(this.password, 11);
    
});
userSchema.methods.checkpassword = async function(password){
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = function(){
    return Jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })}
    userSchema.methods.generateRefreshToken = function(){
        return Jwt.sign({
            _id: this._id
          
        }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        });
}
export const User = mongoose.model('User', userSchema);