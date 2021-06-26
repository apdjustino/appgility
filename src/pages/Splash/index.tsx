import React from 'react'
import logo from './../../logo.svg'
import { useAuth0 } from '@auth0/auth0-react'

const Splash = () => {
  const { loginWithRedirect, logout } = useAuth0() 

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => loginWithRedirect()}>Log in</button>
        <button onClick={() => logout({ returnTo: 'http://localhost:3000' })}>Logout</button>
      </header>
    </div>
  )
}

export default Splash