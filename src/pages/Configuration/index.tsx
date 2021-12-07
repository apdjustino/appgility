import React from 'react'
import { useParams } from 'react-router-dom'
import { Link, Switch } from "react-router-dom"
import ConfigureEvent from '../../components/ConfigureEvent'
import { useLocation } from 'react-router'
import ProtectedRoute from '../../components/ProtectedRoute'
import { makeVar } from '@apollo/client'
import { getEventId } from '../../reactiveVars'

type EventParams = {
  eventId: string;
}

const Configuration = () => {
  const { pathname } = useLocation();
  const params = useParams<EventParams>() 
  
  React.useEffect(() => {
    getEventId(params.eventId);
  }, [params])

  return (
    <div className="container-fluid">
      <div className="header mb-4">
        <div className="header-body">
          <div className="row align-items-end">
            <div className="col">
              <h6 className="header-pretitle">Event Configuration</h6>
              <h1 className="header-title">Event 1</h1>
            </div>
            <div className="col-auto">
              <ul className="nav nav-tabs header-tabs fs-3">
                <li className="nav-item">
                  <Link to={`/secretary/events/${params.eventId}/configuration/trials`} className={`nav-link text-center ${pathname.includes("trials") ? "active" : null}`}>
                    Trials
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={`/secretary/events/${params.eventId}/configuration/basic`} className={`nav-link text-center ${pathname.includes("basic") ? "active" : null}`}>
                    Basic
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={`/secretary/events/${params.eventId}/configuration/registration`} className={`nav-link text-center ${pathname.includes("registration") ? "active" : null}`}>
                    Registration
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <Switch>
            <ProtectedRoute path="/secretary/events/:eventId/configuration/trials" component={() => <p>Trials placeholder</p>} />
            <ProtectedRoute path="/secretary/events/:eventId/configuration/basic" component={() => <p>Basic placeholder</p>} />
            <ProtectedRoute path="/secretary/events/:eventId/configuration/registration" component={() => <p>Registration placeholder</p>} />            
          </Switch>
        </div>
      </div>
    </div>    
  )
}

export default Configuration