import style from './Registration.module.scss'

import React from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router'
import { Tab, Dimmer, Loader } from 'semantic-ui-react'
import moment from 'moment'
import { GET_TRIALS } from '../../queries/trials/trials'
import { EventTrial } from '../../types/trial'
import TrialRegistration from '../../components/TrialRegistration'

type ConfigureParams = {
  eventId: string
}

const Registration = () => {
  const params = useParams<ConfigureParams>()
  const { data, loading, error} = useQuery(GET_TRIALS, { variables : {eventId: params.eventId}})
  
  let panes = []
  if (data && data.getEventTrials) {
    panes = data.getEventTrials.map((trial: EventTrial)  => ({
      menuItem: moment(trial.trialDate, 'YYYY-MM-DD').format('MM/DD/YYYY'),
      render: () => <Tab.Pane style={{padding: '0px'}}><TrialRegistration trialId={trial.trialId}/></Tab.Pane>
    }))
  }

  
  
  return !loading && !error ? (
    <div className={style.contentContainer}>
      <Tab panes={panes} />
    </div>    
  ) : (
    <Dimmer active>
      <Loader>Loading</Loader>
    </Dimmer>
  )
}

export default Registration