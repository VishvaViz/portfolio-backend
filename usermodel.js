const mongoose = require('mongoose')
const bcrypt=require('bcrypt')

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
        },
        password: {
            type: String,
        },

    }
)
userSchema.pre("save", async function (){
    if(this.isModified("password")){
        const salt = await bcrypt.genSaltSync(10);
        this.password=await bcrypt.hash(this.password,salt)
    }
})
module.exports=mongoose.model('users',userSchema)

