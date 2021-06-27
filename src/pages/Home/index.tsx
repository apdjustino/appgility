import style from './home.module.scss'
import React from 'react'
import Layout from '../../layouts/main'
import TrialList from '../../components/TrialList'


const Home = () => {
  return (
    <Layout>
      <div className={style.container}>
        <TrialList />
      </div>
    </Layout>
    
  )
}

 
export default Home