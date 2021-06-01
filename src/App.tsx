import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Splash from './pages/Splash'
import Home from './pages/Home'

import './App.css';

function App() {
  return (
    <Router>
      <Switch>      
        <ProtectedRoute path='/home' component={Home} />                  
        <Route path='/'>
          <Splash />
        </Route>
      </Switch>
    </Router>

  );
}

export default App;
