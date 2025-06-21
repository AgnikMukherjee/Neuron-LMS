import React, { useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets'

const SideBar = () => {
  const { isEducator } = useContext(AppContext)
  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
  ];
  return isEducator && (
    <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-400 py-2 flex flex-col '>
      {menuItems.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          end={item.path === '/educator'} 
          className={({isActive})=>`flex items-center md:flex-row flex-col md:justify-start justify-center gap-3 md:px-10 py-3.5 ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90' : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}` }>
          <img src={item.icon} alt="" className='w-6 h-6' />
          <p className='md:block hidden text-center'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default SideBar