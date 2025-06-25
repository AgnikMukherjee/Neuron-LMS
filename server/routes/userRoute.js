import express from 'express'
import { getuserData, purchaseCourse, userEnrolledCourses } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/data', getuserData)

userRouter.get('/enrolled-courses', userEnrolledCourses)

userRouter.post('/purchase', purchaseCourse)

export default userRouter;