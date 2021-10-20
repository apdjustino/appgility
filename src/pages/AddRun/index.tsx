import style from './AddRun.module.scss'

import React from 'react'
import { Switch, useRouteMatch } from 'react-router-dom'
import { makeVar } from '@apollo/client'
import AddRunLayout from '../../layouts/addRun'
import ProtectedRoute from '../../components/ProtectedRoute'
import AddPerson from '../../components/AddPerson'
import AddRunForm from '../../components/AddRun'

export type RunData = {
  trialId: string,
  agilityClass: string,
  ability: string,
  preferred: boolean,
  needsMeasured: boolean,
}

export type AddRunFormData = {
  personId: string,
  dogId: string,
  runs: RunData[]
}

export const addRunFormVar = makeVar<AddRunFormData>({ personId: '', dogId: '', runs: []})

const AddRun = () => {  
  const { path } = useRouteMatch()
  const { personId } = addRunFormVar()
  return (
    <div className={style.container}>
      <AddRunLayout>
        <Switch>
            <ProtectedRoute path={`${path}/person`} component={() => <AddPerson />} />
            <ProtectedRoute path={`${path}/config`} component={() => <AddRunForm />} />
            <ProtectedRoute path={`${path}/confirm`} component={() => <div>Add confirm placeholder</div>} />
        </Switch>
      </AddRunLayout>
    </div>
  )
}

export default AddRun