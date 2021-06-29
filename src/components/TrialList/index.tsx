import style from './TrialList.module.scss'

import React, { useContext, useState } from 'react'
import { AuthContext } from '../../utils/contexts'
import { Modal } from 'semantic-ui-react'
import { useQuery } from '@apollo/client'
import AddNewTrial from '../AddNewTrial'
import { GET_PERSON_TRIALS } from '../../queries/trials/trials'


const TrialList = () => {
  const userAuth = useContext(AuthContext)
  const [trials, setTrials] = useState([])
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  console.log(userAuth)

  const { data } = useQuery(GET_PERSON_TRIALS, { variables: { personId: 'a-person-Id' }})
  console.log(data)
  return (
    <div className={style.container}>
      {trials.length > 0 ? (
        <div>Trial List</div>
      ): (
        <>
          <div className={style.noTrials}>
            <div className={style.title}>No Trials to Display</div>
            <div className={style.button} onClick={() => setAddDialogOpen(true)}>Click to Add Trial</div>
          </div>
          <div className={style.addButton} onClick={() => setAddDialogOpen(true)}></div>
          <Modal open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
            <Modal.Header>Create New Trial</Modal.Header>
            <AddNewTrial />
          </Modal>
        </>
      )}
    </div>
  )
}

export default TrialList