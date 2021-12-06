import style from './EventList.module.scss'

import React, { useContext, useState } from 'react'
import moment from 'moment'
import { AuthContext } from '../../utils/contexts'
import { Loader, Modal } from 'semantic-ui-react'
import { useQuery } from '@apollo/client'
import AddNewEvent from '../AddNewEvent'
import { GET_PERSON_EVENTS } from '../../queries/trials/trials'
import history from '../../utils/history'


const EventList = () => {
  const userAuth = useContext(AuthContext)  
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  console.log(userAuth)

  const { data, loading } = useQuery(GET_PERSON_EVENTS, { variables: { personId: userAuth.userId }})
  return (
    <div className={style.container}>
      {!!data && data.getPersonEvents.length > 0 ? (
        <div>
          <div className="row px-5 py-3">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="row align-items-center">
                    <div className="col">
                      <h4 className="card-header-title">Events</h4>
                    </div>
                    <div className="col-auto">
                      <button className="btn btn-sm btn-white">Add</button>
                    </div>
                  </div>                  
                </div>
                <div className="table-responsive mb-0" style={{minHeight: "300px"}}>
                    <table className="table table-sm table-nowrap card-table">
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
                        {data.getPersonEvents.map((event: any) => (
                          <tr key={event.id} className="border-bottom" onClick={() => history.push(`/secretary/events/${event.eventId}/configuration`)} style={{cursor: "pointer"}}>
                            <td>{event.name}</td>
                            <td>{moment(event.startDate).format('MM/DD/YY')} - {moment(event.endDate).format('MM/DD/YY')}</td>
                            <td>{event.locationCity}, {event.locationState}</td>
                            <td>{event.trialSite}</td>
                            <td>{event.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              </div>
            </div>
          </div>          
         
          
        </div>
      ): (
        <>          
          <div className={style.noTrials}>
            {loading ? (
              <Loader active={true}/>
            ) : (
              <>
                <div className={style.title}>No Events to Display</div>
                <div className={style.button} onClick={() => setAddDialogOpen(true)}>Click to Add Event</div>
              </>
              
            )}
            
          </div>                    
        </>
      )}
      <div className={style.addButton} onClick={() => setAddDialogOpen(true)}></div>
      <Modal open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <Modal.Header>Create New Event</Modal.Header>
        <AddNewEvent setAddDialogOpen={setAddDialogOpen}/>
      </Modal>
    </div>
  )
}

export default EventList