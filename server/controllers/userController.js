import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";

//getting user dta
export const getuserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, messege: error.message });
    }
};

//user enrolled courses with lecture links
export const userEnrolledCourses = async (req, res) => {
    try {
        const { userId } = req.auth();
        const userData = await User.findById(userId).populate('enrolledCourses');

        res.json({ success: true, enrolledCourses: userData.enrolledCourses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//payment 
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const  origin  = req.headers.origin
        const { userId } = req.auth()

        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if (!userData || !courseData) {
            return res.json({ success: false, message: 'User or course not found' });
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            courseTitle: courseData.courseTitle,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData)

        //stripe gateway initialization
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLowerCase()

        //creating line items from stripe
        const line_items = [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: courseData.courseTitle,
                    },
                    unit_amount: Math.floor(parseFloat(newPurchase.amount) * 100),
                },
                quantity: 1,
            },
        ]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString(),
            },
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//update user course progress

export const updateUserCourseProgress = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { courseId, lectureId } = req.body
        const progessData = await CourseProgress.findOne({ userId, courseId })

        if (progessData) {
            if (progessData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: 'You have already completed this lecture' });
            } else {
                progessData.lectureCompleted.push(lectureId)
                await progessData.save()
            }
        } else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }

        res.json({ success: true, message: 'Progress updated successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// get user course progress

export const getUserCourseProgress = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { courseId } = req.body
        let progressData = await CourseProgress.findOne({ userId, courseId })

        if (!progressData) {
            // If no progress, return an empty structure
            progressData = {
                userId,
                courseId,
                lectureCompleted: []
            }
        }

        // Ensure lectureCompleted is always an array
        progressData.lectureCompleted = progressData.lectureCompleted || [];

        res.json({ success: true, progressData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//add user rating to course

export const addUserRating = async (req, res) => {
    const { userId } = req.auth()
    const { courseId, rating } = req.body

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {

        return res.json({ success: false, message: 'Invalid details' });
    }
    try {
        const course = await Course.findById(courseId)
        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        const user = await User.findById(userId)
        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User has bot purchased this course' });
        }

        const existingRatingindex = course.courseRatings.findIndex(rating => rating.userId === userId)
        if (existingRatingindex > -1) {
            course.courseRatings[existingRatingindex].rating = rating
        } else {
            course.courseRatings.push({ userId, rating })
        }

        await course.save()
        res.json({ success: true, message: 'Rating added successfully' });
    }
     catch (error) {
        res.json({ success: false, message: error.message });
    }
}