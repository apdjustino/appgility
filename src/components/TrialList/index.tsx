import style from './TrialList.module.scss'

import React, { useContext, useState } from 'react'
import moment from 'moment'
import { AuthContext } from '../../utils/contexts'
import { Loader, Modal } from 'semantic-ui-react'
import { useQuery } from '@apollo/client'
import AddNewTrial from '../AddNewTrial'
import { GET_PERSON_TRIALS } from '../../queries/trials/trials'
import history from '../../utils/history'


const TrialList = () => {
  const userAuth = useContext(AuthContext)  
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  console.log(userAuth)

  const { data, loading } = useQuery(GET_PERSON_TRIALS, { variables: { personId: userAuth.userId }})
  return (
    <div className={style.container}>
      {!!data && data.getPersonTrials.length > 0 ? (
        <div>          
          <div className={style.items}>
            {data.getPersonTrials.map((trial: any) => (
              <div className={style.item} key={trial.trialId} onClick={() => history.push(`/trials/${trial.trialId}`)}>
                <div className={style.col1}>
                  <div className={style.title}>{trial.name}</div>
                  <div>{trial.locationCity}, {trial.locationState}</div>                  
                  
                </div>
                <div className={style.col2}>
                  <div className={style.date}>
                    {moment(trial.startDate).format('MM/DD/YY')} -
                    {moment(trial.endDate).format('MM/DD/YY')}
                  </div>                                    
                  <div>{trial.locationVenue}</div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      ): (
        <>          
          <div className={style.noTrials}>
            {loading ? (
              <Loader active={true}/>
            ) : (
              <>
                <div className={style.title}>No Trials to Display</div>
                <div className={style.button} onClick={() => setAddDialogOpen(true)}>Click to Add Trial</div>
              </>
              
            )}
            
          </div>                    
        </>
      )}
      <div className={style.addButton} onClick={() => setAddDialogOpen(true)}></div>
      <Modal open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <Modal.Header>Create New Trial</Modal.Header>
        <AddNewTrial setAddDialogOpen={setAddDialogOpen}/>
      </Modal>
    </div>
  )
}

export default TrialList