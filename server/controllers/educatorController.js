import { clerkClient } from '@clerk/express'
import Course from '../models/Course.js'
import { v2 as cloudinary } from 'cloudinary'
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'


//updating role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const { userId } = req.auth()

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "educator"
            }
        })
        res.json({ success: true, messege: 'Now, you can publish new courses' })

    } catch (error) {
        res.json({ success: false, messege: error.message })
    }
}

//add new course
export const addCourse = async (req, res) => {
    try {
        const courseData = req.body
        const imageFile = req.file
        const { userId: educatorId } = req.auth();

        if (!imageFile) {
            return res.json({ success: false, messege: 'Please upload a thumbnail image of your course' })
        }

        const parsedCourseData = await JSON.parse(courseData.courseData)
        // 2) attach educator & publish flag
        parsedCourseData.educator = educatorId
        parsedCourseData.isPublished = true
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({ success: true, messege: 'Course added successfully' })
    } catch (error) {
        res.json({ success: false, messege: error.message })
    }

}



//get edicator courses
export const getEducatorCourses = async (req, res) => {
    try {
        const { userId: educator } = req.auth();
        const courses = await Course.find({ educator })
        res.json({ success: true, courses })
    } catch (error) {
        res.json({ success: false, messege: error.message })
    }
}


//get educator dashboard data : earnings , enrolled sstudents and no. of courses
export const educatorDashboardData = async (req, res) => {
    try {
        const { userId: educator } = req.auth();
        const courses = await Course.find({ educator })
        const totalCourses = courses.length

        const courseIds = courses.map(course => course._id)

        //calculate total earnings
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed"
        })
        const totalEarnings = purchases.reduce((sum, purchase) =>
            sum += purchase.amount, 0)

        //collect uniquw student ids enrolled in courses
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: {
                    $in: course.enrolledStudents
                }
            }, 'name imageUrl')
            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }
        res.json({ success: true, dashboardData: { totalEarnings, totalCourses, enrolledStudentsData } })
    } catch (error) {
        res.json({ success: false, messege: error.message })
    }
}


//get enrolledStudentsData with purchase data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const { userId: educator } = req.auth();
        const courses = await Course.find({ educator })
        const courseIds = courses.map(course => course._id)

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: "completed"
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId,
            purchaseDate: purchase.createdAt

        }), 'name imageUrl')

        res.json({ success: true, enrolledStudents })
    } catch (error) {
        res.json({ success: false, messege: error.message })
    }
}