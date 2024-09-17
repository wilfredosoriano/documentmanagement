import React from 'react'

export default function ImageFormat({ src, className }) {

const formattedImageUrl = `data:image/jpeg;base64,${src}`;

  return (
    <img src={formattedImageUrl} className={className}/>
  )
}
