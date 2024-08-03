const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const multer = require('multer')
const user = require('./usermodel')
const post = require('./postmodel')
const upload = multer({ storage: multer.memoryStorage() })
require('dotenv').config();

const app = express()
// Middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors({
    origin: "*",
    credentials: true
}));

// Connect to MongoDB
// const URI = 'mongodb+srv://designshoods:Uhlgtpf36JVm8vwI@cluster0.gtnnqqg.mongodb.net/designhood?retryWrites=true&w=majority'
const URI = process.env.DB
mongoose.connect(URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err))



app.post('/api/register', (req, resp) => {
    const { email, password } = req.body

    if (email, password) {
        const usercreate = new user(
            {
                email: email,
                password: password
            }
        )
        usercreate.save()
    }
    resp.status(201).json({ success: true, message: 'user created' })
})

app.post('/api/login', async (req, resp) => {
    const { email, password } = req.body
    const login = await user.findOne(
        {
            email: email,
        }
    )
    if (login) {
        const match = await bcrypt.compare(password, login.password)
        if (match) {
            resp.status(200).json({ success: true, message: 'login successful' })
        }
        else {
            resp.status(401).json({ success: false, message: 'invalid password' })
        }
    }
    else {
        resp.status(404).json({ success: false, message: 'invalid email' })
    }
})

app.post('/api/uploadimage', upload.single('postimg'), async (req, resp) => {
    console.log('req.bdoy', req.body)
    try {
        if (!req.file) {
            return resp.status(400).send('No file uploaded.');
        }

        const newPost = new post({
            postfile: req.file.buffer,
            filename: req.file.originalname,
            type: req.body.imageType,
        });

        await newPost.save();
        resp.status(201).send('File uploaded and saved successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
        resp.status(500).send('Error uploading file');
    }
})

app.get('/api/getpost/:type', async (req, resp) => {
    const type = req.params.type
    const posts = await post.find({ type: type })
    
    // Convert Buffer to base64 string
    const formattedPosts = posts.map(post => ({
        ...post.toObject(),
        postfile: post.postfile.toString('base64') // Convert Buffer to base64
    }));

    resp.status(200).json(formattedPosts);
})
















const PORT=process.env.PORT
app.listen(PORT, () => {
    console.log('Server is running on port 4000')
})




