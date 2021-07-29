import React from 'react'
import { useParams } from 'react-router-dom'
import ConfigureEvent from '../../components/ConfigureEvent'

const Configuration = () => {

  const params = useParams()
  console.log(params)
  return (
    <ConfigureEvent />
  )
}

export default Configuration