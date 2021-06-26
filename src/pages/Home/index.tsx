import React, { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
const Home = () => {
  const { logout, getAccessTokenSilently, getIdTokenClaims, user } = useAuth0()
  useEffect(() => {
    getAccessTokenSilently({ audience: 'https://graph.appgility.com'}).then(response => console.log(response))
    getIdTokenClaims().then((response => console.log(response)))
    console.log(user)
  }, [getAccessTokenSilently, getIdTokenClaims, user])
  return (
    <div>
      This is the home page. UserID: {!!user ? user['https://graph.appgility.com/personId'] : 'n/a'}
      <button onClick={() => {
        localStorage.setItem('accessToken', '')
        logout()
      }}>Logout</button>
    </div>
  )
}

export default Home