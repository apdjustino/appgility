import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
const Home = () => {
  const { logout } = useAuth0()
  return (
    <div>
      This is the home pages
      <button onClick={() => {
        localStorage.setItem('accessToken', '')
        logout()
      }}>Logout</button>
    </div>
  )
}

export default Home