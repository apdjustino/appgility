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
          <div className={style.items}>
            {data.getPersonEvents.map((event: any) => (
              <div className={style.item} key={event.eventId} onClick={() => history.push(`/events/${event.eventId}/configuration`)}>
                <div className={style.icon} />
                <div className={style.col1}>
                  <div className={style.title}>{event.name}</div>
                  <div>Status: {event.status}</div>                  
                </div>
                <div className={style.col2}>
                  <div className={style.date}>
                    {moment(event.startDate).format('MM/DD/YY')} -
                    {moment(event.endDate).format('MM/DD/YY')}
                  </div>                                    
                  <div>{event.locationCity}, {event.locationState}</div>
                </div>
              </div>
            ))}
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