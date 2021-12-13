import React, { useContext, useState } from 'react'
import moment from 'moment'
import { AuthContext } from '../../utils/contexts'
import { useQuery } from '@apollo/client'
import { GET_PERSON_EVENTS } from '../../queries/trials/trials'
import history from '../../utils/history'
import { Spinner } from 'react-bootstrap'
import { PersonEvent } from '../../types/event'

type OwnProps = {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>
}

type QueryResponse = {
  getPersonEvents: PersonEvent[]
}

const EventList = ({ setShowDialog }: OwnProps) => {
  const userAuth = useContext(AuthContext)  
  
  const { data, loading } = useQuery<QueryResponse>(GET_PERSON_EVENTS, { variables: { personId: userAuth.userId }})
  return (    
    <div className="card">
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col">
            <h4 className="card-header-title">Events</h4>
          </div>
          <div className="col-auto">
            <button className="btn btn-sm btn-white" onClick={() => setShowDialog(true) }>Add</button>
          </div>
        </div>                  
      </div>
      <div className="table-responsive mb-0" style={{minHeight: "300px"}}>
        <table className="table table-sm table-nowrap table-hover card-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Dates</th>
              <th>Location</th>
              <th>Trial Site</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="list">
            {!!data && !!data.getPersonEvents && data.getPersonEvents.length > 0 ? data.getPersonEvents.map((event: any) => (
              <tr key={event.id} className="border-bottom" onClick={() => history.push(`/secretary/events/${event.eventId}/configuration/trials`)} style={{cursor: "pointer"}}>
                <td>{event.name}</td>
                <td>{moment(event.startDate).format('MM/DD/YY')} - {moment(event.endDate).format('MM/DD/YY')}</td>
                <td>{event.locationCity}, {event.locationState}</td>
                <td>{event.trialSite}</td>
                <td>{event.status}</td>
              </tr>
            )) : !loading ? (
              <tr>
                <td colSpan={5} className="text-center fst-italic fs-3">No Events to Show</td>
              </tr>
            ) : (
              <tr>
                <td colSpan={5} className="text-center"><Spinner animation="border"/></td>
              </tr>
            )}          
          </tbody>
        </table>
      </div>
    </div>          
  )
}

export default EventList