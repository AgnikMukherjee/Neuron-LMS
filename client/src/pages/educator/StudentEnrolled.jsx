import React, { useContext, useEffect, useState } from 'react'
import { dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'



const StudentEnrolled = () => {
  const {backendUrl ,isEducator, getToken} = useContext(AppContext)
  const[enrolledStudents, setEnrolledStudents] = useState(null)

  const fetchEnrolledStudents = async () => {
   try {
    const token = await getToken()
    const {data} = await axios.get(backendUrl + '/api/educator/enrolled-students' , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if(data.success){
      setEnrolledStudents(data.enrolledStudents.reverse())
    }else{
      toast.error(data.messege)
    }
   } catch (error) {
    toast.error(error.message)
   }
  } 

  useEffect(() => {
    if(isEducator){
      fetchEnrolledStudents()
    }
  }, [isEducator])
  return enrolledStudents ? (
    <div className='min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0 '>
      <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
        <table className='table-fixed md:table-auto w-full overflow-hidden pb-4'>
          <thead className='text-gray-900 border border-gray-500/20 text-sm text-left'>
            <tr>
              <th className='px-4 py-3 font-semi-bold text-center hidden md:table-cell'>#</th>
              <th className='px-4 py-3 font-semi-bold'>Student Name</th>
              <th className='px-4 py-3 font-semi-bold'>Course Title</th>
              <th className='px-4 py-3 font-semi-bold hiidden sm:table-cell'>Date</th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='px-4 py-3 text-center hidden md:table-cell'>{index + 1}</td>
                <td className='px-4 py-3 flex items-center space-x-3'>
                  {/* ✅ Safe access with fallback image */}
                  <img src={item?.student?.imageUrl || dummyStudentEnrolled} alt="" className='w-9 h-9 rounded-full' />  
                  <span className='truncate'>{item?.student?.name || 'Unknown'}</span></td>
                <td className='px-4 py-3 truncate'>{item?.courseTitle?.courseTitle || 'Untitled Course'}</td>
                <td className='px-4 py-3 hidden sm:table-cell'>{item?.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading/>
}

export default StudentEnrolled