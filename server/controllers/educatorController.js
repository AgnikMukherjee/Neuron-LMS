import {clerkClient} from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'



//updating role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const {userId} = req.auth()

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role: "educator"
            }
        })
        res.json({success : true, messege: 'Now, you can publish new courses' })

    } catch (error) {
        res.json({success : false, messege: error.message })
    }
}

//add new course
export const addCourse = async (req, res) => {
    try {
        const courseData = req.body
        const imageFile = req.file
        const { userId: educatorId } = req.auth();

        if(!imageFile){
            return res.json({success : false, messege: 'Please upload a thumbnail image of your course' })
        }

        const parsedCourseData = await JSON.parse(courseData.courseData)
        parsedCourseData.educator = educatorId;
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({success : true, messege: 'Course added successfully' })
    } catch (error) {
        res.json({success : false, messege: error.message })
    }
}