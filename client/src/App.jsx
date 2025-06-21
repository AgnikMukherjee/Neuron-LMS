import React from 'react'
import {Route, Routes, useLocation} from 'react-router-dom'
import Home from './pages/student/Home.jsx'
import CourseList from './pages/student/CourseList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import DashBoard from './pages/educator/Dashboard.jsx'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentEnrolled from './pages/educator/StudentEnrolled'
import Navbar from './components/student/Navbar'
const App = () => {

  const location = useLocation();
  const isEducatorRoute = location.pathname.startsWith('/educator');
  return (
    <div className='text-default min-h-screen bg-white '>
      {!isEducatorRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course-list' element={<CourseList />} />
        <Route path='/course-list/:input' element={<CourseList />} />
        <Route path='/course/:id' element={<CourseDetails />} />
        <Route path='/my-enrollments' element={<MyEnrollments />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='/loading/:path' element={<Loading />} />
        
        <Route path='/educator' element={<Educator/>}>
          <Route path='/educator' element={<DashBoard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='student-enrolled' element={<StudentEnrolled />} />

        </Route>
      </Routes>
    </div>
  )
}

export default App