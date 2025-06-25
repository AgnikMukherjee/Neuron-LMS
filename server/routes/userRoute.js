import express from 'express'
import { getuserData, userEnrolledCourses } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/data', getuserData)

userRouter.get('/enrolled-courses', userEnrolledCourses)

export default userRouter;