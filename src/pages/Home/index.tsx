import React, { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
const Home = () => {
  const { logout, getAccessTokenSilently, getIdTokenClaims } = useAuth0()
  useEffect(() => {
    getAccessTokenSilently({ audience: 'https://graph.appgility.com'}).then(response => console.log(response))
    getIdTokenClaims().then((response => console.log(response)))
  }, [getAccessTokenSilently, getIdTokenClaims])
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