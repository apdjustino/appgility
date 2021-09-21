import style from './main.module.scss'

import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { UserAuth } from '../../types/authentication'
import { AuthContext } from '../../utils/contexts'

type LayoutProps = {
  children: React.ReactNode
}

const MainLayout = ({
  children
}: LayoutProps) => {
  const { logout, user, getAccessTokenSilently } = useAuth0()
  const [userAuth, setUserAuth] = useState<UserAuth>({accessToken: '', userId: ''})
  const history = useHistory() 

  useEffect(() => {   
    const storedToken = localStorage.getItem('accessToken')
    if (!storedToken) {
      getAccessTokenSilently({ audience: 'https://graph.appgility.com'}).then(response => {      
      localStorage.setItem('accessToken', response)  
      setUserAuth({
          accessToken: response,
          userId: !!user ? user['https://graph.appgility.com/personId'] : ''
        })      
      }).catch(() => {
        // don't really need to log this error
      })
    } else {
      setUserAuth({
        accessToken: storedToken,
        userId: !!user ? user['https://graph.appgility.com/personId'] : ''
      })  
    }     
  }, [user, getAccessTokenSilently])

  
  return (
    <AuthContext.Provider value={userAuth}>
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.title} onClick={() => history.push('/home')}>Appgility</div>
          <div className={style.controls}>
            <div className={style.logout} onClick={() => {
              logout()
              localStorage.removeItem('accessToken')
            }}/>
          </div>        
        </div>
        {children}
      </div>
    </AuthContext.Provider>
    
  )
}

export default MainLayout