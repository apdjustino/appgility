import React from 'react'
import { Switch, useRouteMatch } from 'react-router-dom'
import TrialLayout from '../../layouts/trial'
import ProtectedRoute from '../../components/ProtectedRoute'
import Configuration from '../Configuration'
import Registration from '../../pages/Registration'
import AddRun from '../../pages/AddRun'


type params = {
  eventId: string
}

const TrialHome = () => {  
  const { path } = useRouteMatch()
  console.log(path)
  return (
    <TrialLayout>
      <Switch>
        <ProtectedRoute path={`${path}/configuration`} component={Configuration} />
        <ProtectedRoute path={`${path}/registration/add`} component={AddRun} />
        <ProtectedRoute path={`${path}/registration`} component={Registration} />
      </Switch>
    </TrialLayout>
  )
}

export default TrialHome