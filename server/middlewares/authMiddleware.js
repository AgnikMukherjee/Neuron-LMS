import { clerkClient } from "@clerk/express";
 
//protect educator routes
export const protectEducator = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        const response = await clerkClient.users.getUser(userId);
        if(response.publicMetadata.role !== "educator"){
            return res.json({success : false, messege: 'Unauthorized access' })
        }
        next();
    } catch (error) {
        res.json({success : false, messege: error.message })
    }
};