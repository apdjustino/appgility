import style from './AddRun.module.scss'

import React from 'react'
import { Switch, useRouteMatch } from 'react-router-dom' 
import AddRunLayout from '../../layouts/addRun'
import ProtectedRoute from '../../components/ProtectedRoute'
import AddPerson from '../../components/AddPerson'

const AddRun = () => {
  const { path } = useRouteMatch()
  return (
    <div className={style.container}>
      <AddRunLayout>
        <Switch>
          <ProtectedRoute path={`${path}/person`} component={AddPerson} />
          <ProtectedRoute path={`${path}/config`} component={() => <div>Add config placeholder</div>} />
          <ProtectedRoute path={`${path}/confirm`} component={() => <div>Add confirm placeholder</div>} />
        </Switch>
      </AddRunLayout>
    </div>
  )
}

export default AddRun