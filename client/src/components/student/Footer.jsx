import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
        <div className='flex flex-col md:items-start items-center w-full' >
          <img src={assets.logo_dark} alt="" />
          <p className='mt-6 text-center md:text-left text-sm text-white/80'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe autem iste, consectetur, sint ipsum corporis repellendus natus soluta exercitationem cum et atque quod sit fuga!</p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Comapny</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2 '>
            <li><a href="#">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#"></a>Private policy</li>
          </ul>
        </div>
        <div className='hideen md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Subscribe to our news letter</h2>
          <p className='text-sm text-white/80'>The latest news, articles and resources, sent to your inbox weekly.</p>
          <div className='flex items-center gap-2 pt-4'>
            <input className='border border-gray-500/30 bg-gray-800 text-gray-500 placeholder:text-gray-500 outline-none w-64 h-9 px-2 rounded text-sm' type="email" placeholder='Enter your email' />
            <button className='bg-blue-600 text-white w-24 h-9  rounded'>Subscribe</button>
          </div>
        </div>
      </div>
      <p className='py-4 text-center text-xs md:text-sm text-white/60'>Copyright 2025 © Agnik Mukherjee. | All Rights Reserved.</p>
    </footer>
  )
}

export default Footer