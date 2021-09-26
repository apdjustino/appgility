import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Container, Card, Form, Dropdown, Loader, Dimmer, Message, Button, Modal } from 'semantic-ui-react'
import { CONFIG_NEW_RUN } from '../../queries/runs/runs'
import { useLocation, useParams } from 'react-router'
import { EventTrial } from '../../types/trial'
import { Dog } from '../../types/person'
import { addRunFormVar } from '../../pages/AddRun'
import { Link } from 'react-router-dom'
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

const AddRun = () => {  
  const { eventId } = useParams<ConfigureParams>()  
  const { personId } = addRunFormVar()
  const { pathname } = useLocation()
  const { data, loading, error } = useQuery<QueryResponse>(CONFIG_NEW_RUN, { variables: { personId, eventId}})
  const [showAddDog, setShowAddDog] = useState(false)
  const noDogOptions: DogOption[] = [
    { key: '-1', text: 'No Dogs Added', value: '-1', disabled: true},    
  ]

  return personId ? (
    <Container>
      <Card.Group centered>
        <Card>          
          <Card.Content>
            <Form>
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
              
            </Form>
          </Card.Content>
        </Card>
      </Card.Group>
      <Card.Group centered>
        {data && !loading ? data.getEventTrials.map(trial => {
          return (
            <Card>
              <Card.Content>
                <Card.Header>Trial: {trial.trialDate}</Card.Header>
              </Card.Content>
              <Card.Content>
                <div>A bunch of form info goes here</div>
              </Card.Content>
            </Card>
          )
        }) : (
          <div style={{height: '100vh'}}>
            <Dimmer active>
              <Loader>Loading</Loader>
            </Dimmer>
          </div>
        )}                
      </Card.Group>   
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