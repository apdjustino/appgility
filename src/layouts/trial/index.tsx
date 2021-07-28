import style from './trial.module.scss'

import React from 'react'
import { Icon } from 'semantic-ui-react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'

type TrialLayoutProps = {
  children: React.ReactNode
}

const TrialLayout = ({ children }: TrialLayoutProps) => {
  const { pathname } = useLocation()
  const { url } = useRouteMatch()
  const history = useHistory()
  
  return (
    <div className={style.trialContainer}>
      <div className={style.sidebar}>
        <div 
          className={`${style.item} ${pathname.includes('configuration') ? style.selected : ''}`} onClick={() => history.push(`${url}/configuration`)}>Configuration</div>
        <div className={`${style.item} ${pathname.includes('registration') ? style.selected : ''}`} onClick={() => history.push(`${url}/registration`)}>Registration</div>
        <div className={`${style.item} ${pathname.includes('schedule') ? style.selected : ''}`} onClick={() => history.push(`${url}/schedule`)}>Run Orders</div>
        <div className={`${style.item} ${pathname.includes('scoring') ? style.selected : ''}`} onClick={() => history.push(`${url}/scoring`)}>Scoring</div>
        <div className={`${style.item} ${pathname.includes('reports') ? style.selected : ''}`} onClick={() => history.push(`${url}/reports`)}>Reports</div>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default TrialLayout