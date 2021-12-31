import style from './main.module.scss'

import React, { useEffect, useState } from 'react'
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { UserAuth } from '../../types/authentication'
import { Tool, BookOpen, List, Edit3, Sliders, Home, Bell } from "react-feather"
import { Link, useLocation, useMatch } from "react-router-dom";
import { getEventId, selectedEventMenu } from '../../reactiveVars'
import logo from "../../assets/icons/logo.svg";

type RouteParams = {
  eventId: string
}

const MainLayout = () => {
  const { logout } = useAuth0()
  const { eventId } = useParams<RouteParams>()
  const navigate = useNavigate()
  const { pathname } = useLocation();
  const eventMenu = selectedEventMenu();
  
  const onConfigRoot = !!useMatch(`secretary/events/${eventId}/configuration/*`)
  const onRegistrationRoot = !!useMatch(`secretary/events/${eventId}/registration/*`)
  return (
    <>
      <Navbar expand="md" className="navbar-vertical fixed-start fs-2" collapseOnSelect={true}>
        <Container fluid>        
        <Navbar.Brand>
          <Link to="/secretary/home">
          <img className="navbar-brand-img" src={logo} alt="..." />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse>
          {pathname.includes("home") ? (
              <Nav>              
                <Nav.Item>
                  <Nav.Link href="/secretary/home" role="button" active={pathname.includes("home")}>
                    <Home size="17" className="me-3"/>
                    Event Dashboard
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            ) : (
              <Nav>                
                <Nav.Item>
                  <Nav.Link onClick={() => navigate(`events/${eventId}/configuration/trials`)} role="button" active={onConfigRoot}>
                    <Tool size="17" className="me-3"/>
                    Configuration
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link onClick={() => navigate(`events/${eventId}/registration`)} role="button" active={onRegistrationRoot} >
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
        </Navbar.Collapse>          
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
                <Dropdown.Item onClick={() => {
                  localStorage.removeItem("appgilityAccessToken");
                  logout()
                }}>Logout</Dropdown.Item>
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
        <Outlet />
      </div>
    </>
      
    
    
  )
}

export default MainLayout