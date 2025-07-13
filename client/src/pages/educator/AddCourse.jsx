import React, { useContext, useEffect, useRef, useState } from 'react'
import uniquid from 'uniqid'
import Quill from 'quill'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const AddCourse = () => {

  const { backendUrl, getToken } = useContext(AppContext)
  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState("")
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapter, setChapter] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [chapterId, setChapterId] = useState(null)
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false
  })

  const handleChapter = (action) => {
    if (action === "add") {
      const title = prompt("Enter chapter Name")
      if (title) {
        const newChapter = {
          chapterId: uniquid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapter.length > 0 ? chapter.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapter([...chapter, newChapter]);
      }
    } else if (action === "remove") {
      setChapter(chapter.filter((chapter) => chapter.chapterId !== chapterId))
    } else if (action === "toggle") {
      setChapter(chapter.map((chapter) => chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter))
    }
  }

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setChapterId(chapterId)
      setShowPopup(true)
    } else if (action === "remove") {
      setChapter(chapter.map((chapter) => {
        if (chapter.chapterId === chapterId) {
          chapter.chapterContent.splice(lectureIndex, 1)
        }
        return chapter
      }))
    }
  }

  const addLecture = () => {
    setChapter(chapter.map((chapter) => {
      if (chapter.chapterId === chapterId) {
        const newLecture = {
          ...lectureDetails,
          lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
          lectureId: uniquid(),
          lectureUrl: extractYouTubeVideoId(lectureDetails.lectureUrl)
        }
        // chapter.chapterContent.push(newLecture)
        return {
          ...chapter,
          chapterContent: [...chapter.chapterContent, newLecture]
        }
      }
      return chapter
    }))
    setShowPopup(false)
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false
    })
  }

  const extractYouTubeVideoId = (url) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.slice(1);
      } else if (parsedUrl.hostname.includes("youtube.com")) {
        return parsedUrl.searchParams.get("v");
      }
    } catch (e) {
      return url; // fallback if it's already an ID
    }
  };


  const handleSubmit = async (e) => {
    // console.log("👉 handleSubmit fired")
    try {
      e.preventDefault()
      console.log(chapter)
      // console.log("👉 image is:", image)
      if (!image) {
        toast.error("Please upload course thumbnail")
        return
      }
      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapter
      }

      const formData = new FormData()
      formData.append('courseData', JSON.stringify(courseData))
      formData.append('image', image)

      // console.log("👉 courseData:", courseData)
      // console.log("👉 formData keys:", Array.from(formData.keys()))
      const token = await getToken()
      // console.log("👉 token:", token)
      // console.log("👉 about to call axios.post to:", `${backendUrl}/api/educator/add-course`);

      const { data } = await axios.post(backendUrl + '/api/educator/add-course', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // console.log("👉 axios returned:", data);

      if (data.success) {
        toast.success(data.message)
        setCourseTitle("")
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapter([])
        quillRef.current.root.innerHTML = ""

        console.log("Course published!")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    //initializing quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow"
      })
    }
  }, [])


  return (

    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0 '>
      <form onSubmit={handleSubmit} action="" className='flex flex-col gap-4 max-w-full text-gray-500'>
        <div className='flex flex-col gap-1'>
          <p>Course Title</p>
          <input onChange={(e) => setCourseTitle(e.target.value)} type="text" value={courseTitle} placeholder='Enter course title' className='oultline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' required />
        </div>
        <div className='flex flex-col gap-1'>
          <p>Course Description</p>
          <div ref={editorRef}></div>
        </div >

        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex flex-col gap-1'>
            <p>Course Price</p>
            <input onChange={(e) => setCoursePrice(e.target.value)} type="number" value={coursePrice} placeholder='0' className='oultline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' required />
          </div>

          <div className='flex md:flex-row flex-col items-center gap-3'>
            <p>Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className='flex items-center gap-3'>
              <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded' />
              <input type="file" id="thumbnailImage" onChange={(e) => setImage(e.target.files[0])} accept='image/*' hidden />
              <img className='max-w-10' src={image ? URL.createObjectURL(image) : null} alt="" />
            </label>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <p>Discount (%)</p>
          <input onChange={(e) => setDiscount(e.target.value)} type="number" value={discount} placeholder='0' min={0} max={100} className='oultline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' required />
        </div>
        {/* adding chapter & lectures */}
        <div>
          {chapter.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className='bg-white border rounded-lg mb-4'>
              <div className='flex items-center justify-between p-4 border-b'>
                <div className='flex items-center'>
                  <img onClick={() => handleChapter('toggle', chapter.chapterId)}
                    src={assets.dropdown_icon} width={14} alt="" className={`mr-2 cursor-pointer transition-all ${chapter.collapsed && "-rotate-90"}`} />
                  <span className='font-semibold'>{chapterIndex + 1} {chapter.chapterTitle}</span>
                </div>
                <span className='text-gray-500'>{chapter.chapterContent.length} Lectures</span>
                <img onClick={() => handleChapter('remove', chapter.chapterId)} src={assets.cross_icon} alt="" className='cursor-pointer' />
              </div>
              {!chapter.collapsed && (
                <div className='p-4'>
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className='flex items-center justify-between mb-2'>
                      <span>{lectureIndex + 1} {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl} target='_blank' className='text-blue-500'>Link</a> - {lecture.isPreviewFree ? "Free Preview" : "Paid"}</span>
                      <img src={assets.cross_icon} alt="" className='cursor-pointer' onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} />
                    </div>
                  ))}
                  <div className='inline-flex bg-gray-100 gap-2 p-2 cursor-pointer rounded mt-2' onClick={() => handleLecture('add', chapter.chapterId)}>+ Add Lectures</div>
                </div>
              )}
            </div>
          ))}

          <div className='flex justify-center items-center bg-blue-100 p-2 cursor-pointer rounded-lg' onClick={() => handleChapter('add')}>+ Add Chapter</div>
          {/* showPopup------------------------------------------------- */}
          {showPopup && (
            <div className='fixed inset-0 flex items-center justify-center bg-gray-800/30'>
              <div className='bg-white text-gray-700 rounded-md p-4 relative w-full max-w-80'>
                <h2 className='text-lg font-semibold mb-4'>Add Lecture</h2>

                <div className='mb-2'>
                  <p>Lecture Title</p>
                  <input type="text" className='mt-1 block w-full border rounded py-1 px-2' value={lectureDetails.lectureTitle} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })} />
                </div>

                <div className='mb-2'>
                  <p>Duration (minutes)</p>
                  <input type="number" className='mt-1 block w-full border rounded py-1 px-2' value={lectureDetails.lectureDuration} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })} />
                </div>

                <div className='mb-2'>
                  <p>Lecture URL</p>
                  <input type="text" className='mt-1 block w-full border rounded py-1 px-2' value={lectureDetails.lectureUrl} onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })} />
                </div>

                <div className='mb-2'>
                  <p>Is Preview free?</p>
                  <input type="checkbox" className='mt-1 scale-125' checked={lectureDetails.isPreviewFree} onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })} />
                </div>

                <button type='button' className='w-full bg-blue-400 text-white px-4 py-2 rounded' onClick={addLecture}>Add</button>

                <img onClick={() => setShowPopup(false)} className='absolute top-4 right-4 w-4 cursor-pointer'
                  src={assets.cross_icon} alt="" />

              </div>
            </div>
          )
          }
        </div>
        <button type='submit' className='bg-black text-white w-max px-8 py-2.5 rounded my-4 rounded'>Publish</button>
      </form>
    </div>
  )
}

export default AddCourse