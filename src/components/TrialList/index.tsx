import style from './TrialList.module.scss'

import React, { useContext, useState } from 'react'
import { AuthContext } from '../../utils/contexts'
import { Modal, Form as SemanticForm } from 'semantic-ui-react'
import AddNewTrial from '../AddNewTrial'


const TrialList = () => {
  const userAuth = useContext(AuthContext)
  const [trials, setTrials] = useState([])
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  console.log(userAuth)
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