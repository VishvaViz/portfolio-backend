const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
    {
        postfile: {
            type: Buffer,
            required: true,
        },
        filename: {
            type: String,
            required: true,
        },
        type:{
            type:String,
        }
    }
)
module.exports = mongoose.model('post', postSchema)