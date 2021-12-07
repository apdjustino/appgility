import React from 'react'
import { Card, Popover, OverlayTrigger } from "react-bootstrap";
import { Edit } from "react-feather"
import moment from 'moment'
import { chunk } from "lodash";
import { EventTrial } from '../../types/trial'

type SkillLevel = {
  nov: string,
  open: string
  exc: string,
  mast: string
}

type OwnProps = {
  trials: EventTrial[]  
  setTrial: (trialId: string) => void
}

const TrialCards = ({ trials, setTrial }: OwnProps) => {   
  const lookup: SkillLevel = {
    nov: 'Novice',
    open: 'Open',
    exc: 'Excellent',
    mast: 'Masters'
  }

  const chunkedTrials = chunk(trials, 3);

  return (          
      <>   
        { chunkedTrials.map((trialSet) => (
          <div className="row py-4">
            { trialSet.map(trial => (
              <div className="col-4">
                <div className="card card-fill" key={`trial-card-${trial.id}`}>
                  <div className="card-header">
                    <h4 className="card-header-title">{moment(trial.trialDate, 'YYYY-MM-DD').format('MMMM Do, YYYY')}</h4>
                    <button className="btn btn-rounded-circle">
                      <Edit />
                    </button>
                  </div>
                  
                  <div className="card-body">
                    <div className="row py-2">
                      <Card.Text>
                          <div>Run Limit: <span>{trial.runLimit}</span></div>
                          <div>Online Entries: <span>{trial.onlineEntries}</span></div>
                          <div>Mail-in Entries: <span>{trial.mailEntries}</span></div>
                      </Card.Text>              
                    </div>
                    <div className="row py-2">
                      <div className="list-group list-group-focus">
                        {!!trial.standardAbility && trial.standardAbility.length > 0 ? (
                          <div className="list-group-item">
                            <h4 className="text-body text-focus mb-1 fw-bold">Standard:</h4>
                            <p className="text-muted mb-0">{trial.standardAbility?.map(x => lookup[x as keyof SkillLevel]).join(", ")}</p>
                          </div>                          
                        ): null }               
                        
                        {!!trial.standardPreferred && trial.standardPreferred.length > 0 ? (
                          <div className="list-group-item">
                            <h4 className="text-body text-focus mb-1 fw-bold">Standard Preferred:</h4>
                            <p className="text-muted mb-0">{trial.standardPreferred?.map(x => lookup[x as keyof SkillLevel]).join(", ")}</p>
                          </div> 
                        ): null }
                        
                        {!!trial.jumpersAbility && trial.jumpersAbility.length > 0 ? (
                          <div className="list-group-item">
                            <h4 className="text-body text-focus mb-1 fw-bold">Jumpers:</h4>
                            <p className="text-muted mb-0">{trial.jumpersAbility?.map(x => lookup[x as keyof SkillLevel]).join(", ")}</p>
                          </div> 
                        ): null }           
                        
                        {!!trial.jumpersPreferred && trial.jumpersPreferred.length > 0 ? (
                          <div className="list-group-item">
                            <h4 className="text-body text-focus mb-1 fw-bold">Jumpers Preferred:</h4>
                            <p className="text-muted mb-0">{trial.jumpersPreferred?.map(x => lookup[x as keyof SkillLevel]).join(", ")}</p>
                          </div>
                        ): null }  
                        
                        {!!trial.fastAbility && trial.fastAbility.length > 0 ? (
                          <div className="list-group-item">
                            <h4 className="text-body text-focus mb-1 fw-bold">FAST:</h4>
                            <p className="text-muted mb-0">{trial.fastAbility?.map(x => lookup[x as keyof SkillLevel]).join(", ")}</p>
                          </div>
                        ): null }  
                        
                        {!!trial.fastPreferred && trial.fastPreferred.length > 0 ? (
                          <div className="list-group-item">
                            <h4 className="text-body text-focus mb-1 fw-bold">FAST Preferred:</h4>
                            <p className="text-muted mb-0">{trial.fastPreferred?.map(x => lookup[x as keyof SkillLevel]).join(", ")}</p>
                          </div>
                        ): null }  

                        {trial.t2bClass ? <div className="list-group-item fw-bold">T2B</div> : null}
                        {trial.premierStandard ? <div className="list-group-item fw-bold">Premier Standard</div> : null}
                        {trial.premierJumpers ? <div className="list-group-item fw-bold">Premier Jumpers</div> : null}
                      </div> 
                    </div>                    
              
                  </div>
                </div>
              </div>
            ))}
          </div>          
        )) }              
      </>    
  )
}

export default TrialCards