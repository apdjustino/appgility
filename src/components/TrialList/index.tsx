import style from './TrialList.module.scss'

import React, { useContext, useState } from 'react'
import { AuthContext } from '../../utils/contexts'

const TrialList = () => {
  const userAuth = useContext(AuthContext)
  const [trials, setTrials] = useState([])
  console.log(userAuth)
  return (
    <div className={style.container}>
      {trials.length > 0 ? (
        <div>Trial List</div>
      ): (
        <div className={style.noTrials}>
          <div className={style.title}>No Trials to Display</div>
          <div className={style.button}>Click to Add Trial</div>
        </div>
      )}
    </div>
  )
}

export default TrialList