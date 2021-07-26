import React from 'react';
import { Router, Switch} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import TrialHome from './pages/TrialHome'
import Layout from './layouts/main'
import history from './utils/history'

import './App.css';

function App() {
  return (
    <Router history={history}>
      <Layout>
        <Switch>      
          <ProtectedRoute path='/trials/:trialId' component={TrialHome} />
          <ProtectedRoute path='/' component={Home} />       
        </Switch>
      </Layout>      
    </Router>

  );
}

export default App;
