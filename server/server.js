import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoute.js'



const app = express()

//connect db
await connectDB()
await connectCloudinary()

//middleware
app.use(cors())
app.use(clerkMiddleware())

//routes
app.get('/', (req, res) => {
    res.send('Hello from server')
})

app.post('/clerk', express.json(), clerkWebhooks)

app.use('/api/educator',express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)


const PORT = process.env.PORT || 5000

app.listen(PORT, () =>{ 
    console.log(`Server is running on port ${PORT}`)
})