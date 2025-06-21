import React from 'react'
import Hero from '../../components/student/Hero'
import Companies from '../../components/student/Companies'
import CourseSection from '../../components/student/CourseSection'
import TestimonialSections from '../../components/student/TestimonialSections'
import CallToAction from '../../components/student/CallToAction'
import Footer from '../../components/student/Footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center '>
      <Hero/>
      <Companies/>
      <CourseSection/>
      <TestimonialSections/>
      <CallToAction/>
      <Footer/>
    </div>
  )
}

export default Home