import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'


const app = express()

//connect db
await connectDB()

//middleware
app.use(cors())
app.use(express.json())


//routes
app.get('/', (req, res) => {
    res.send('Hello from server')
})

app.post('/clerk', express.json(), clerkWebhooks)




const PORT = process.env.PORT || 5000

app.listen(PORT, () =>{ 
    console.log(`Server is running on port ${PORT}`)
})