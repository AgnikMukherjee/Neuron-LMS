import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Searchbar from '../../components/student/Searchbar'
import { useParams } from 'react-router-dom'
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'

const CourseList = () => {

  const { navigate, allCourses } = useContext(AppContext)
  const { input } = useParams()

  const [filteredCourses, setFilteredCourses] = useState([])
  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourse = allCourses.slice()

      input ? setFilteredCourses(tempCourse.filter((item) => item.courseTitle.toLowerCase().includes(input.toLowerCase())
      )
      )
        : setFilteredCourses(tempCourse)
    }
  }, [allCourses, input])

  return (
    <>
      <div className='relative md:px-36 px-8 pt-20 text-left'>
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
          <div>
            <h1 className='text-3xl font-semibold text-gray-800'>Course List</h1>
            <p className='text-gray-500'>
              <span className='text-blue-600 cursor-pointer' onClick={() => navigate('/')}>Home</span> / <span>Course List</span></p>
          </div>
          <Searchbar data={input} />
        </div>
        {
          input && <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 mb-5 text-gray-500 rounded'>
            <p>{input}</p>
            <img src={assets.cross_icon} alt="" className='cursor-pointer' onClick={() => navigate('/course-list')} />
          </div>
        }
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 my-16 px-2 md:px-0 '>
          {filteredCourses.map((course, index) => <CourseCard key={index} course={course} />)}
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default CourseList