import style from './home.module.scss'
import React from 'react'
import TrialList from '../../components/TrialList'


const Home = () => {
  return (
    <div className={style.container}>
        <TrialList />
      </div>    
  )
}

 
export default Home