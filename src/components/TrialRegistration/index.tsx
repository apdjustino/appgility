import style from './TrialRegistration.module.scss'

import React from 'react'
import { useQuery } from '@apollo/client'
import { Button, Grid, Icon, Popup, List } from 'semantic-ui-react'
import { useHistory, useRouteMatch } from 'react-router'
import { GET_TRIAL_RUNS } from '../../queries/runs/runs'

type ButtonGroupItem = {
  key: string,
  icon: string
}

type OwnProps = {
  trialId: string
}

const TrialRegistration = ({ trialId } : OwnProps) => { 
  const history = useHistory()
  const { url } = useRouteMatch()
  const trialRunsQuery = useQuery(GET_TRIAL_RUNS, { variables: { trialId }})

  return (
    <div className={style.container}>
      <div className={style.buttonGroupContainer}>          
          <Button.Group>
            <Popup content='Add trial run' trigger={<Button icon onClick={() => history.push(`${url}/add/person`)}><Icon name='add circle' /></Button>}/>
            <Popup content='Configure online registration' trigger={<Button icon><Icon name='settings' /></Button>}/>            
            <Popup content='Upload trial data' trigger={<Button icon><Icon name='cloud upload' /></Button>}/>                        
          </Button.Group>          
        </div>
        <div className={style.tableContainer}>
          <List divided verticalAlign='middle'>
            { !!trialRunsQuery.data ? trialRunsQuery.data.getTrialRuns.map((run: any) => (
              <List.Item>{run.trialId}, {run.group} </List.Item>
            )) : null}
          </List>
        </div>     
    </div>
  )
}

export default TrialRegistration