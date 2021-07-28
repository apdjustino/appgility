import React from 'react'
import { useParams } from 'react-router-dom'
import ConfigureTrial from '../../components/ConfigureTrial'

const Configuration = () => {

  const params = useParams()
  console.log(params)
  return (
    <ConfigureTrial />
  )
}

export default Configuration