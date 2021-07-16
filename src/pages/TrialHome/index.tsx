import React from 'react'
import { useParams } from 'react-router'

type params = {
  trialId: string
}

const TrialHome = () => {
  const { trialId } = useParams<params>()
  return (
    <div>Route param: {trialId}</div>
  )
}

export default TrialHome