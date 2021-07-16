import React from 'react';
import { Router, Switch} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import TrialHome from './pages/TrialHome'
import history from './utils/history'

import './App.css';

function App() {
  return (
    <Router history={history}>
      <Switch>      
        <ProtectedRoute path='/trials/:trialId' component={TrialHome} />
        <ProtectedRoute path='/' component={Home} />       
      </Switch>
    </Router>

  );
}

export default App;
