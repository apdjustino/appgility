import style from './home.module.scss'
import React from 'react'
import EventList from '../../components/EventList'
import Layout from "../../layouts/main";
import { Switch } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import Configuration from '../Configuration';
import AddRun from '../AddRun';
import Registration from '../Registration';


const Home = () => {
  return (
    <Layout>
      <Switch>
        <ProtectedRoute path='/secretary/events/:eventId/configuration' component={Configuration} />
        <ProtectedRoute path='/secretary/events/:eventId/registration/add' component={AddRun} />
        <ProtectedRoute path='/secretary/events/:eventId/registration' component={Registration} />
        <ProtectedRoute path="/secretary/home" component={EventList}/>        
      </Switch>      
    </Layout>    
  )
}

 
export default Home