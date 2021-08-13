import React from 'react'
import { useParams } from 'react-router'
import { Switch, useRouteMatch } from 'react-router-dom'
import TrialLayout from '../../layouts/trial'
import ProtectedRoute from '../../components/ProtectedRoute'
import Configuration from '../Configuration'


type params = {
  eventId: string
}

const TrialHome = () => {
  const { eventId } = useParams<params>()
  const { path } = useRouteMatch()
  console.log(path)
  return (
    <TrialLayout>
      <Switch>
        <ProtectedRoute path={`${path}/configuration`} component={Configuration} />
      </Switch>
    </TrialLayout>
  )
}

export default TrialHome