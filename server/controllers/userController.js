import User from "../models/User.js";


//getting user dta
export const getuserData = async (req, res) => {
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({success : true, user});

        res.status(200).json(user);
    } catch (error) {
        res.json({success : false, messege: error.message });
    }
};

//user enrolled courses with lecture links
export const userEnrolledCourses = async (req, res) => {
    try {
        const {userId} = req.auth();
        const userData = await User.findById(userId).populate('enrolledCourses');

        res.json({success : true, enrolledCourses: userData.enrolledCourses});
    } catch (error) {
        res.json({success : false, messege: error.message });
    }
}