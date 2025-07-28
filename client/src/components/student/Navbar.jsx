import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'


const Navbar = () => {



    const { navigate , isEducator ,setIsEducator ,backendUrl, getToken  } = useContext(AppContext)

    const isCourseListPage = location.pathname.includes('/course-list')

    const { openSignIn } = useClerk()
    const { user } = useUser()

    const becomeEducator = async () => {
        try {
            if(isEducator){
                navigate('/educator')
                return;
            }
            const token = await getToken()
            const { data } = await axios.get(backendUrl + '/api/educator/update-role' , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(data.success){
                setIsEducator(true)
                toast.success(data.messege)

            }else{
                toast.error(data.messege)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'} `}>
            <img onClick={() => navigate('/')} src={assets.logo_frame} alt="logo" className='w-28 lg:w-32 cursor-pointer' />
            <div className='hidden md:flex items-center gap-5 text-gray-500'>
                <div className='flex items-center gap-5'>
                    {user &&
                        <>
                            <button onClick={becomeEducator} className="cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1"> {isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>

                            <div className="hidden sm:block h-6 w-px bg-gray-500"></div>

                             <Link to='/my-enrollments'
                             className="transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1">My Enrollments</Link>
                        </>
                    }

                    {user ? <UserButton /> :
                        <button className='bg-blue-600 text-white px-5 py-2 rounded-full' onClick={() => openSignIn()}>Create Account</button>}
                </div>
            </div>

            {/* smaller screen  */}
            <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
                <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
                    {user && <>
                        <button onClick={becomeEducator} className='text-center cursor-pointer transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1'> {isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>

                        {/* <div className="h-6 w-px bg-gray-500"></div> */}

                        <Link to='/my-enrollments' className='text-center transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1'
                        >My Enrollments</Link>
                    </>
                    }
                </div>
                <div>
                    {
                        user ? <UserButton /> :
                            <button onClick={() => openSignIn()}><img src={assets.user_icon} alt="" /></button>

                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar