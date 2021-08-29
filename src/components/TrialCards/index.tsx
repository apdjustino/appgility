import style from './TrialCards.module.scss'

import React from 'react'
import { Container, Card, Button, Dropdown, Menu, Icon, Dimmer, Loader } from 'semantic-ui-react'
import { QueryResult } from '@apollo/client'
import moment from 'moment'

type SkillLevel = {
  nov: string,
  open: string
  exc: string,
  mast: string
}

type ownProps = {
  query: QueryResult<any, {eventId: string}>,
  setTrial: (trialId: string) => void
}

const TrialCards = ({ query, setTrial }: ownProps) => {   
  const lookup: SkillLevel = {
    nov: 'Novice',
    open: 'Open',
    exc: 'Excellent',
    mast: 'Masters'
  }
  return (
    <Container>      
      <div className={style.cardContainer}>
        <Card.Group>
        { query && !query.loading ? query.data.getEventTrials.map((trial: any) => (
          <Card key={`trial-card-${trial.id}`}>
            <Card.Content extra>
              <Card.Header>{moment(trial.trialDate, 'DD-MM-YYYY').format('MMMM Do, YYYY')}</Card.Header>
              <Card.Meta>{trial.akcTrialNumber}</Card.Meta>       
            </Card.Content>
            
            <Card.Content>
              <Card.Description>
                  <div className={style.entries}>Run Limit: <span>{trial.runLimit}</span></div>
                  <div className={style.entries}>Online Entries: <span>{trial.onlineEntries}</span></div>
                  <div className={style.entries}>Mail-in Entries: <span>{trial.mailEntries}</span></div>
              </Card.Description>              
                <div className={style.menuContainer}>
                  <Menu vertical>
                    {trial.standardAbility && trial.standardAbility.length > 0 ? (
                      <Dropdown text="Standard" simple item options={trial.standardAbility.map((ability: any, i: number) => ({
                        key: i,
                        text: lookup[ability as keyof SkillLevel],
                        value: 0
                      }))}/>
                    ): null }               
                    {trial.standardPreferred && trial.standardPreferred.length > 0 ? (
                      <Dropdown text="Standard Preferred" simple item options={trial.standardPreferred.map((ability: any, i: number) => ({
                        key: i,
                        text: lookup[ability as keyof SkillLevel],
                        value: 0
                      }))}/> 
                    ): null }
                    
                    {trial.jumpersAbility && trial.jumpersAbility.length > 0 ? (
                      <Dropdown text="Jumpers" simple item options={trial.jumpersAbility.map((ability: any, i: number) => ({
                        key: i,
                        text: lookup[ability as keyof SkillLevel],
                        value: 0
                      }))}/>
                    ): null }             
                    
                    {trial.jumpersPreferred && trial.jumpersPreferred.length > 0 ? (
                      <Dropdown text="Jumpers Preferred" simple item options={trial.jumpersPreferred.map((ability: string, i: number) => ({
                        key: i,
                        text: lookup[ability as keyof SkillLevel],
                        value: 0
                      }))}/>
                    ): null }
                    
                    {trial.fastAbility && trial.fastAbility.length > 0 ? (
                      <Dropdown text="FAST" simple item options={trial.fastAbility.map((ability: any, i: number) => ({
                        key: i,
                        text: lookup[ability as keyof SkillLevel],
                        value: 0
                      }))}/>
                    ) : null }
                    

                    {trial.fastPreferred && trial.fastPreferred.length > 0 ? (
                      <Dropdown text="FAST Preferred" simple item options={trial.fastPreferred.map((ability: any, i: number) => ({
                        key: i,
                        text: lookup[ability as keyof SkillLevel],
                        value: 0
                      }))}/>
                    ) : null }               
                    {trial.t2bClass ? <Menu.Item>T2B</Menu.Item> : null}
                    {trial.premierStandard ? <Menu.Item>Premier Standard</Menu.Item> : null}
                    {trial.premierJumpers ? <Menu.Item>Premier Jumpers</Menu.Item> : null}
                  </Menu>                            
                </div>              
              </Card.Content>
              <Card.Content extra>
              <div className='ui two buttons'>
                <Button color='black' icon onClick={() => setTrial(trial.id)}>
                  <Icon name="edit outline" style={{ paddinRight: "1em"}} />
                  Edit
                </Button>              
              </div>
              </Card.Content>
          </Card>
        )) : (
          <div style={{height: '100vh'}}>
            <Dimmer active>
              <Loader>Loading</Loader>
            </Dimmer>
          </div>
          
        )}
        </Card.Group>        
      </div>
    </Container>
  )
}

export default TrialCards