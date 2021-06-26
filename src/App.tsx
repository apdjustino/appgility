import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'

import './App.css';

function App() {
  return (
    <Router>
      <Switch>      
        <ProtectedRoute path='/' component={Home} />        
      </Switch>
    </Router>

  );
}

export default App;
