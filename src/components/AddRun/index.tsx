import style from './AddRun.module.scss'

import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Container, Card, Form, Dropdown, Loader, Dimmer, Message, Button, Modal, Checkbox, Radio } from 'semantic-ui-react'
import { CONFIG_NEW_RUN } from '../../queries/runs/runs'
import { useLocation, useParams } from 'react-router'
import { EventTrial } from '../../types/trial'
import { Dog } from '../../types/person'
import { addRunFormVar } from '../../pages/AddRun'
import { Link } from 'react-router-dom'
import moment from 'moment'
import AddDog from '../AddDog'

type DogOption = {
  key: string,
  text: string,
  value: string,
  disabled: boolean
}

type ConfigureParams = {
  eventId: string
}

type QueryResponse = {
  getEventTrials: EventTrial[],
  getPersonDogs: Dog[]
}

type SelectOptions<T> = {
  id: string,
  key: string,
  text: string,
  value: T
}

const generateClassOptions = (rawOptions: string[]) : SelectOptions<string>[] => {
  
  const lookup: any = {
    nov: 'Novice',
    open: 'Open',
    exc: 'Excellent',
    mast: 'Masters'
  }
  
  return rawOptions.map(option => ({
    id: `option-${option}`,
    key: `option-${option}`,
    text: lookup[option],
    value: option
  }))  

}

const AddRun = () => {  
  const { eventId } = useParams<ConfigureParams>()  
  const { personId } = addRunFormVar()
  const { pathname } = useLocation()
  const { data, loading, error } = useQuery<QueryResponse>(CONFIG_NEW_RUN, { variables: { personId, eventId}})
  const [showAddDog, setShowAddDog] = useState(false)
  const noDogOptions: DogOption[] = [
    { key: '-1', text: 'No Dogs Added', value: '-1', disabled: true},    
  ]

  const heightValues: SelectOptions<string>[] = [
    { id: '4', key: '4', value: '4', text: '4"'},
    { id: '8', key: '8', value: '8', text: '8"'},
    { id: '12', key: '12', value: '12', text: '12"'},
    { id: '16', key: '16', value: '16', text: '16"'},
    { id: '20', key: '20', value: '20', text: '20"'},
    { id: '24', key: '24', value: '24', text: '24"'},
  ]

  return personId ? (
    <Container>
      <Form>
        <Card.Group centered>
          <Card>          
            <Card.Content>
              
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <Form.Field 
                    id='dog'
                    inline
                    name='dog'              
                    label='Dogs'
                    placeholder='Select a dog'
                    selection
                    control={Dropdown}
                    options={data && data.getPersonDogs ? data.getPersonDogs.map(dog => ({
                      key: dog.dogId, text: dog.callName, value: dog.dogId, disabled: false
                    })) : noDogOptions}              
                  />
                  <div>
                    <Button circular icon="add" color="black" onClick={() => setShowAddDog(true)}></Button>
                  </div>                         
                </div>                          
            </Card.Content>
          </Card>
        </Card.Group>
      {!!data && !loading ? (
        <Card.Group centered itemsPerRow='3'>
        {data.getEventTrials.map(trial => {
          console.log(trial)
          return (
            <Card>
              <Card.Content extra>
                <Card.Header>Trial: {trial.trialDate}</Card.Header>
              </Card.Content>
              <Card.Content>
                <Card.Meta>Standard</Card.Meta>
                {trial.standardClass ? (
                <div className={style.cardContentBody}>
                  <div className={style.typeRadioContainer}>
                    <Form.Input
                      fluid
                      id={`standard-type-${trial.trialId}`}
                      name={`standard-type-${trial.trialId}`}
                      label='Regular'
                      control={Radio}
                    />                  
                  </div>                  
                  <div className={style.abilityDropdownContainer}>            
                    <Form.Input  
                      fluid                  
                      id={`standard-ability-${trial.trialId}`}
                      name={`standard-ability-${trial.trialId}`}
                      selection
                      options={generateClassOptions(trial.standardAbility as string[])}
                      control={Dropdown}                    
                    />
                  </div>
                  <div className={style.heightDropdownContainer}>
                    <Form.Input
                      fluid
                      id={`standard-height-${trial.trialId}`}
                      name={`standard-height-${trial.trialId}`}
                      selection
                      options={heightValues}
                      control={Dropdown}
                    />
                  </div>                  
                </div>
              ) : null}
              {!!trial.standardPreferred && trial.standardPreferred.length > 0 ? (
                  <div className={style.cardContentBody}>
                    <div className={style.typeRadioContainer}>
                      <Form.Input
                        fluid
                        id={`standard-type-${trial.trialId}`}
                        name={`standard-type-${trial.trialId}`}
                        label='Preferred'
                        control={Radio}
                      />
                    </div>                    
                    <div className={style.abilityDropdownContainer}>            
                      <Form.Input  
                        fluid                  
                        id={`standard-preferred-ability-${trial.trialId}`}
                        name={`standard-preferred-ability-${trial.trialId}`}
                        selection
                        options={generateClassOptions(trial.standardAbility as string[])}
                        control={Dropdown}                    
                      />
                    </div>
                    <div className={style.heightDropdownContainer}>
                      <Form.Input
                        fluid
                        id={`standard-preferred-height-${trial.trialId}`}
                        name={`standard-preferred-height-${trial.trialId}`}
                        selection
                        options={heightValues}
                        control={Dropdown}
                      />
                    </div>
                  </div>                                
                ) : null}
              </Card.Content>
              <Card.Content>
                <Card.Meta>Jumpers</Card.Meta>
                {trial.jumpersClass ? (
                  <div className={style.cardContentBody}>
                    <div className={style.typeRadioContainer}>
                      <Form.Input
                        fluid
                        id={`jumpers-type-${trial.trialId}`}
                        name={`jumpers-type-${trial.trialId}`}
                        label='Regular'
                        control={Radio}
                      />
                    </div>                    
                    <div className={style.abilityDropdownContainer}>
                      <Form.Input
                        fluid
                        id={`jumpers-ability-${trial.trialId}`}
                        name={`jumpers-ability-${trial.trialId}`}                        
                        selection
                        options={generateClassOptions(trial.jumpersAbility as string[])}
                        control={Dropdown}
                      />
                    </div>
                    <div className={style.heightDropdownContainer}>
                      <Form.Input
                        fluid
                        id={`jumpers-height-${trial.trialId}`}
                        name={`jumpers-height-${trial.trialId}`}
                        selection
                        options={heightValues}
                        control={Dropdown}
                      />
                    </div>
                  </div>                  
                ) : null}
                {!!trial.jumpersPreferred && trial.jumpersPreferred.length > 0 ? (
                  <div className={style.cardContentBody}>
                    <div className={style.typeRadioContainer}>
                      <Form.Input
                        fluid
                        id={`jumpers-type-${trial.trialId}`}
                        name={`jumpers-type-${trial.trialId}`}
                        label='Preferred'                                            
                        control={Radio}
                      />
                    </div>                    
                    <div className={style.abilityDropdownContainer}>
                      <Form.Input
                        fluid 
                        id={`jumpers-preferred-ability-${trial.trialId}`}
                        name={`jumpers-preferred-ability-${trial.trialId}`}                        
                        selection
                        options={generateClassOptions(trial.jumpersAbility as string[])}
                        control={Dropdown}
                      />
                    </div>
                    <div className={style.heightDropdownContainer}>
                      <Form.Input
                        fluid
                        id={`jumpers-preferred-height-${trial.trialId}`}
                        name={`jumpers-preferred-height-${trial.trialId}`}
                        selection
                        options={heightValues}
                        control={Dropdown}
                      />
                    </div>
                  </div>                  
                ) : null}             
              </Card.Content>
              <Card.Content>
                <Card.Meta>FAST</Card.Meta>
                {trial.fastClass ? (
                  <div className={style.cardContentBody}>
                    <div className={style.typeRadioContainer}>
                      <Form.Input
                        fluid
                        id={`fast-type-${trial.trialId}`}
                        name={`fast-type-${trial.trialId}`}
                        label='Regular'                      
                        control={Radio}
                      />
                    </div>                    
                    <div className={style.abilityDropdownContainer}>
                      <Form.Input
                        fluid
                        id={`fast-ability-${trial.trialId}`}
                        name={`fast-ability-${trial.trialId}`}                        
                        selection
                        options={generateClassOptions(trial.fastAbility as string[])}
                        control={Dropdown}
                      />
                    </div>
                    <div className={style.heightDropdownContainer}>
                      <Form.Input
                        fluid
                        id={`fast-height-${trial.trialId}`}
                        name={`fast-height-${trial.trialId}`}
                        selection
                        options={heightValues}
                        control={Dropdown}
                      />
                    </div>

                  </div>                  
                  ) : null}
                  {!!trial.fastPreferred && trial.fastPreferred.length > 0 ? (
                    <div className={style.cardContentBody}>
                      <div className={style.typeRadioContainer}>
                        <Form.Input
                          fluid
                          id={`fast-type-${trial.trialId}`}
                          name={`fast-type-${trial.trialId}`}
                          label='Preferred'                        
                          control={Radio}
                        />
                      </div>                      
                      <div className={style.abilityDropdownContainer}>
                        <Form.Input
                          fluid
                          id={`fast-preferred-ability-${trial.trialId}`}
                          name={`fast-preferred-ability-${trial.trialId}`}                          
                          selection
                          options={generateClassOptions(trial.fastAbility as string[])}
                          control={Dropdown}
                        />
                    </div>
                    <div className={style.heightDropdownContainer}>
                      <Form.Input
                          fluid
                          id={`fast-preferred-height-${trial.trialId}`}
                          name={`fast-preferred-height-${trial.trialId}`}
                          selection
                          options={heightValues}
                          control={Dropdown}
                        />
                    </div>
                    </div>                    
                  ) : null}                  
              </Card.Content>
              <Card.Content>
                <Card.Meta>T2B and Premier</Card.Meta>
                  {trial.t2bClass ? (
                  <Form.Input 
                    id={`t2b-preferred-${trial.trialId}`}
                    name={`t2b-preferred-${trial.trialId}`}
                    label='T2B Class'
                    control={Checkbox}
                  />
                ) : null}
                {trial.premierStandard ? (
                  <Form.Input 
                    id={`premier-standard-${trial.trialId}`}
                    name={`premier-standard-${trial.trialId}`}
                    label='Premier Standard'
                    control={Checkbox}
                  />
                  ) : null}
                {trial.premierJumpers ? (
                  <Form.Input 
                    id={`premier-jumpers-${trial.trialId}`}
                    name={`premier-jumpers-${trial.trialId}`}
                    label='Premier Jumpers'
                    control={Checkbox}
                  />
                ) : null}                        
              </Card.Content>                                                         
            </Card>
          )})}        
        </Card.Group>  
      ) : (
        <div style={{height: '100vh', width: '100vw'}}>
            <Dimmer active>
              <Loader>Loading</Loader>
            </Dimmer>
          </div>
      )}      
      </Form> 
      <AddDog open={showAddDog} setOpen={setShowAddDog}/>      
    </Container>
  ) : (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Message error content='Exhibitor not selected.' style={{width: '300px'}}/>
      <Link to={`${pathname.replace('/config', '/person')}`}>Click here to start over</Link> 
    </div>
  )
}

export default AddRun