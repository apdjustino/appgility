import React from 'react'
import { useParams } from 'react-router-dom'

const Configuration = () => {

  const params = useParams()
  console.log(params)
  return (
    <div>Configuration page</div>
  )
}

export default Configuration