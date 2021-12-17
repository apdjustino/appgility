import React from 'react'
import Layout from "../../layouts/main";
import { Switch } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import Configuration from '../Configuration';
import Registration from '../Registration';
import EventDashboard from '../EventDashboard';

const Home = () => {
  return (
    <Layout>
      <Switch>
        <ProtectedRoute path='/secretary/events/:eventId/configuration' component={Configuration} />        
        <ProtectedRoute path='/secretary/events/:eventId/registration' component={Registration} />
        <ProtectedRoute path="/secretary/home" component={EventDashboard}/>        
      </Switch>      
    </Layout>    
  )
}

 
export default Home