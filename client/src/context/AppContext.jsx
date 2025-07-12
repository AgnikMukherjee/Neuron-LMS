import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration"
import {useAuth , useUser} from '@clerk/clerk-react'
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    const {getToken} = useAuth()
    const {user} = useUser()

    const [allCourses, setAllCourses] = useState([])  
    const [isEducator, setIsEducator] = useState(false)  
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)

    //fetching all courses
    const fetchAllCourses = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/course/all')
            if(data.success){
                setAllCourses(data.courses)
            }else{
                toast.error(data.messege)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //fetching user data
      const fetchUserData = async () => {
        if(user.publicMetadata.roll === 'educator'){
            setIsEducator(true)
        }
          try {
            const token = await getToken()
            const {data} = await axios.get(backendUrl + '/api/user/data' , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(data.success){
                setUserData(data.user)
            }else{
                toast.error(data.messege)
            }
          } catch (error) {
            toast.error(error.message)
          }
      }

    //function for claculating avg rating
    const calculateRating = (course) => {
        if(course.courseRatings.length === 0){
            return 0
        }

        let totalRating = 0
        course.courseRatings.forEach((rating) => {
            totalRating += rating.rating
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    //calculating course chapter time
    const calculateChapterTime = (chapter) => {
        let time = 0
        chapter.chapterContent.map((lecture) => 
           time += lecture.lectureDuration
        )
        return humanizeDuration(time*60*1000 , {units: ['h', 'm']})
    }

    //calculating course time
    const calculateCourseDuration = (course) => {
        let time = 0
        course.courseContent.map((chapter) => 
            chapter.chapterContent.map((lecture) => 
                time += lecture.lectureDuration)
        )
        return humanizeDuration(time*60*1000 , {units: ['d', 'h', 'm']})
    }

    //calculating no. of lectures in course
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0
        course.courseContent.forEach((chapter) =>{
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length
            }
        } )
        return totalLectures
    }

    //fetching user enrolled courses
    const fetchUserEnrolledCourses = async () => {
        try {
            const token = await getToken()
            const {data} = await axios.get(backendUrl + '/api/user/enrolled-courses' , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(data.success){
                setEnrolledCourses(data.enrolledCourses.reverse())
            }else{
                toast.error(data.messege)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchAllCourses()
         
    }, [])

    // const logToken = async ()=>{
    //     console.log(await getToken())
    // }

    useEffect(() => {
        if(user){
        //    logToken()
            fetchUserData()
            fetchUserEnrolledCourses()
        }
    }, [user])

    const value = {
        currency , 
        allCourses,
        navigate,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateChapterTime,
        calculateCourseDuration,
        calculateNoOfLectures,
        enrolledCourses,
        fetchUserEnrolledCourses,
        backendUrl,
        userData,
        setUserData,
        getToken,
        fetchAllCourses

    }

    return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
    )
};