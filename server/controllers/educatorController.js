import { clerkClient } from '@clerk/express'
import Course from '../models/Course.js';

import { v2 as cloudinary } from 'cloudinary'
import  {Purchase}  from '../models/Purchase.js';


import User from '../models/User.js';


// update role to educator
export const updateRoleToEducator = async (req, res) => {

    try {

        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        })

        res.json({ success: true, message: 'You can publish a course now' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}


// add new course

export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail not attached' })
        }
        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId

        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        newCourse.courseThumbnail = imageUpload.secure_url

        await newCourse.save()

        res.json({ success: true, message: 'Course Added' })


    } catch (error) {
        console.error('addCourse failed:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}


//get educator courses

// export const getEducatorCourses = async (req,res)=>{
//     try{
//         const userId = req.auth.userId
//         const courses = await Course.find({educator})
//         res.json({success:true,courses})
//     }catch(error){
//         res.json({success:false , message:error.message})
//     }
// }


export const getEducatorCourses = async (req, res) => {
    try {
        const educatorId = req.auth.userId;
        if (!educatorId) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated as educator'
            });
        }

        // query by educatorId
        const courses = await Course.find({ educator: educatorId })
            .sort({ createdAt: -1 }); // optional: newest first

        return res.json({ success: true, courses });
    } catch (error) {
        console.error('getEducatorCourses failed:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


//get educator dashboard data

export const educatorDashboardData = async (req,res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const totalCourses = courses.length;

        const courseId = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseId },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
        // Collect unique enrolled student IDs with their course titles
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}




// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        // Fetch all courses created by the educator
        const courses = await Course.find({ educator });

        // Get the list of course IDs
        const courseIds = courses.map(course => course._id);

        // Fetch purchases with user and course data
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        // enrolled students data
        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({
            success: true,
            enrolledStudents
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};
