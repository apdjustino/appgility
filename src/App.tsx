import React from 'react';
import { Router, Route, Switch} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import history from './utils/history'

import './App.css';

function App() {
  return (
    <Router history={history}>
      <Switch>      
        <ProtectedRoute path='/' component={Home} />        
      </Switch>
    </Router>

  );
}

export default App;
