import style from './main.module.scss'

import React, { useEffect, useState } from 'react'
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { UserAuth } from '../../types/authentication'
import { AuthContext } from '../../utils/contexts'
import { Tool, BookOpen, List, Edit3, Sliders, Home, Bell } from "react-feather"
import { Link, useLocation } from "react-router-dom";
import { getEventId } from '../../reactiveVars'

type LayoutProps = {
  children: React.ReactNode
}

const MainLayout = ({
  children
}: LayoutProps) => {
  const { logout, user, getAccessTokenSilently } = useAuth0()
  const [userAuth, setUserAuth] = useState<UserAuth>({accessToken: '', userId: ''})
  const history = useHistory() 
  const { pathname } = useLocation();
  const eventId = getEventId();  

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
      <Navbar expand="md" className="navbar-vertical fixed-start fs-2" collapseOnSelect={true}>
        <Container fluid>
          {pathname.includes("home") ? (
            <Nav>
              <Link to="/">
                <Navbar.Brand>
                  <img className="navbar-brand-img" src="/img/logo.svg" alt="..." />
                </Navbar.Brand>
              </Link>
              <Nav.Item>
                <Nav.Link href="/secretary/home" role="button" active={pathname.includes("home")}>
                  <Home size="17" className="me-3"/>
                  Event Dashboard
                </Nav.Link>
              </Nav.Item>
            </Nav>
          ) : (
            <Nav>
              <Link to="/secretary/home">
                <Navbar.Brand>
                  <img className="navbar-brand-img" src="/img/logo.svg" alt="..." />
                </Navbar.Brand>
              </Link>
              <Nav.Item>
                <Nav.Link onClick={() => history.push(`/secretary/events/${eventId}/configuration/trials`)} role="button" active={pathname.includes("/configuration")}>
                  <Tool size="17" className="me-3"/>
                  Configuration
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => history.push(`/secretary/events/${eventId}/registration`)} role="button" active={pathname.includes("/registration")}>
                  <BookOpen size="17" className="me-3"/>
                  Registration
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link role="button">
                  <List size="17" className="me-3"/>
                  Run Order
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link role="button">
                  <Edit3 size="17" className="me-3"/>
                  Scoring
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link role="button">
                  <Sliders size="17" className="me-3"/>
                  Reports
                </Nav.Link>
              </Nav.Item>
            </Nav>
          )}
          <div className="navbar-user d-none d-md-flex">
            <a className="navbar-user-link" role="button">
              <div className="icon">
                <Bell size="17" />
              </div>
            </a>
            <Dropdown drop="up">
              <Dropdown.Toggle as="div" size="sm" role="button">
              <div className="rounded-circle bg-primary p-1 ms-2 mt-1 me-4" data-testid="user-icon-wrapper">
                <span className="fw-bold text-white">
                  JM
                </span>
              </div>                
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Link to="/profile-posts">
                  <Dropdown.Item>Profile</Dropdown.Item>
                </Link>
                <Link to="/account-general">
                  <Dropdown.Item>Settings</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Link to="/secretary/home" className="navbar-user-link" role="button">
              <div className="icon">
                <Home size="17"/>
              </div>
            </Link>
          </div>
        </Container>
      </Navbar>
      <div className="main-content">
        {children}
      </div>
      
    </AuthContext.Provider>
    
  )
}

export default MainLayout