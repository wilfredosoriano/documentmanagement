import React from 'react'

export default function ImageFormat({ src }) {

const formattedImageUrl = `data:image/jpeg;base64,${src}`;

  return (
    <img src={formattedImageUrl} className='w-14 h-14 object-cover' />
  )
}
