import style from './main.module.scss'

import React, { useEffect, useState } from 'react'
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

  useEffect(() => {
    getAccessTokenSilently({ audience: 'https://graph.appgility.com'}).then(response => {
      setUserAuth({
        accessToken: response,
        userId: !!user ? user['https://graph.appgility.com/personId'] : ''
      })
    })
  }, [user, getAccessTokenSilently])

  
  return (
    <AuthContext.Provider value={userAuth}>
      <div className={style.container}>
        <div className={style.header}>
          <div className={style.title}>Appgility</div>
          <div className={style.controls}>
            <div className={style.logout} onClick={() => logout()}/>
          </div>        
        </div>
        {children}
      </div>
    </AuthContext.Provider>
    
  )
}

export default MainLayout