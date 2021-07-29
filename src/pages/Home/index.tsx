import style from './home.module.scss'
import React from 'react'
import EventList from '../../components/EventList'


const Home = () => {
  return (
    <div className={style.container}>
        <EventList />
      </div>    
  )
}

 
export default Home