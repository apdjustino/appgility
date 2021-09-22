import style from './TrialRegistration.module.scss'

import React from 'react'
import { Button, Grid, Icon, Popup } from 'semantic-ui-react'
import { useHistory, useRouteMatch } from 'react-router'

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
  
  return (
    <div className={style.container}>
      <div className={style.buttonGroupContainer}>          
          <Button.Group>
            <Popup content='Add trial run' trigger={<Button icon onClick={() => history.push(`${url}/add/person`)}><Icon name='add circle' /></Button>}/>
            <Popup content='Configure online registration' trigger={<Button icon><Icon name='settings' /></Button>}/>            
            <Popup content='Upload trial data' trigger={<Button icon><Icon name='cloud upload' /></Button>}/>                        
          </Button.Group>          
        </div>
        <div>{trialId}</div>     
    </div>
  )
}

export default TrialRegistration