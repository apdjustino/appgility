import style from './AddRunLayout.module.scss'

import React from 'react'
import { useLocation, useHistory, useRouteMatch} from 'react-router'
import { Step, Icon } from 'semantic-ui-react'

type OwnProps = {
  children: React.ReactNode
}

const AddRunLayout = ({ children } : OwnProps) => {
  const { pathname } = useLocation()
  const history = useHistory()
  const { url } = useRouteMatch()
  
  return (
    <div className={style.container}>
      <div className={style.stepContainer}>
        <Step.Group>
          <Step link active={pathname.includes('add/person')} onClick={() => history.push(`${url}/person`)}>
            <Icon name='find' />
            <Step.Content>
              <Step.Title>Exhibitor</Step.Title>
              <Step.Description>Find or add exhibitor</Step.Description>
            </Step.Content>
          </Step>
          <Step link active={pathname.includes('add/config')} onClick={() => history.push(`${url}/config`)}>
            <Icon name='configure' />
            <Step.Content>
              <Step.Title>Run</Step.Title>
              <Step.Description>Configure new run details</Step.Description>
            </Step.Content>
          </Step>
          <Step link active={pathname.includes('add/confirm')} onClick={() => history.push(`${url}/confirm`)}>
            <Icon name='check circle' />
            <Step.Content>
              <Step.Title>Confirm</Step.Title>
              <Step.Description>Run selections</Step.Description>
            </Step.Content>
          </Step>
        </Step.Group>
      </div>      
      <div className={style.childContainer}>
        {children}
      </div>
    </div>
  )
}

export default AddRunLayout