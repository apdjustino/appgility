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
import { Formik, FieldArray } from 'formik'
import moment from 'moment'
import AddDog from '../AddDog'
import { buildRunsToAdd } from './utils'

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
      <Formik
        enableReinitialize={true}
        initialValues={{
          dogId: '',
          trials: !!data && !loading ? data.getEventTrials.map(trial => ({
            trialId: trial.trialId,
            trialDate: trial.trialDate,            
            standardType: '',
            standardLevel: '',            
            standardHeight: '',
            standardPrefLevel: '',
            standardPrefHeight: '',
            jumpersType: '',
            jumpersLevel: '',
            jumpersHeight: '',
            jumpersPrefLevel: '',
            jumpersPrefHeight: '',
            fastType: '',
            fastLevel: '',
            fastHeight: '',
            fastPrefLevel: '',
            fastPrefHeight: '',
            t2b: false,
            t2bHeight: '',
            premierStandard: false,
            premierStandardHeight: '',
            premierJumpers: false,
            premierJumpersHeight: ''
          })) : []
        }}
        onSubmit={(values) => {
          const runs = buildRunsToAdd(values.trials, personId, values.dogId)
          console.log(runs)
        }}
      >
        {(formik) => {
          return (
            <Form onSubmit={formik.handleSubmit}>
              <Card.Group centered>
                <Card>          
                  <Card.Content>                    
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <Form.Field 
                          id='dog'
                          inline
                          name='dogId'              
                          label='Dogs'
                          placeholder='Select a dog'
                          selection
                          control={Dropdown}
                          value={formik.values.dogId}                      
                          options={data && data.getPersonDogs ? data.getPersonDogs.map(dog => ({
                            key: dog.dogId, text: dog.callName, value: dog.dogId, disabled: false
                          })) : noDogOptions}
                          onChange={(e: any, d: any) => {
                            formik.setFieldValue('dogId', d.value)
                          }}             
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
                <FieldArray name='trials'>
                  {() => {                     
                    return (
                      <>
                        {formik.values.trials.map((trial, index) => {
                          const trialObj = data.getEventTrials.find(t => t.trialId === trial.trialId) as EventTrial
                          return (
                            <Card>
                              <Card.Content extra>
                                <Card.Header>{trial.trialDate}</Card.Header>
                              </Card.Content>
                              <Card.Content>
                                <Card.Meta>Standard</Card.Meta>
                                {trialObj.standardClass ? (
                                  <>
                                    <div className={style.cardContentBody}>
                                      <div className={style.typeRadioContainer}>
                                        <Form.Input
                                          fluid
                                          id={`standard-type-regular-${index}`}
                                          name={`trials.${index}.standardType`}
                                          label='Regular'
                                          control={Radio}
                                          value='regular'
                                          checked={formik.values.trials[index].standardType === 'regular'}
                                          onClick={() => {
                                            formik.setFieldValue(`trials.${index}.standardType`, 'regular')
                                            formik.setFieldValue(`trials.${index}.standardPrefLevel`, '')
                                            formik.setFieldValue(`trials.${index}.standardPrefHeight`, '')
                                          }}
                                          disabled={!!!formik.values.dogId}
                                        />                  
                                      </div>                  
                                      <div className={style.abilityDropdownContainer}>            
                                        <Form.Input  
                                          fluid                  
                                          id={`standard-level-${trial.trialId}`}
                                          name={`trials.${index}.standardLevel`}
                                          placeholder='Level'
                                          selection
                                          options={generateClassOptions(trialObj.standardAbility as string[])}
                                          value={formik.values.trials[index].standardLevel}
                                          onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.standardLevel`, d.value)}
                                          control={Dropdown}
                                          disabled={!!!formik.values.dogId || formik.values.trials[index].standardType !== 'regular'}
                                        />
                                      </div>
                                      <div className={style.heightDropdownContainer}>
                                        <Form.Input
                                          fluid
                                          id={`standard-height-${trial.trialId}`}
                                          name={`trials.${index}.standardHeight`}
                                          placeholder='Height'
                                          selection
                                          options={heightValues}
                                          control={Dropdown}
                                          value={formik.values.trials[index].standardHeight}
                                          onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.standardHeight`, d.value)}
                                          disabled={!!!formik.values.dogId || formik.values.trials[index].standardType !== 'regular'}
                                        />
                                      </div>                  
                                    </div>
                                    <div className={style.cardContentBody}>
                                      <div className={style.typeRadioContainer}>
                                        <Form.Input
                                          fluid
                                          id={`standard-type-preferred-${index}`}
                                          name={`trials.${index}.standardType`}
                                          label='Preferred'
                                          control={Radio}
                                          value='preferred'
                                          checked={formik.values.trials[index].standardType === 'preferred'}
                                          onClick={() => {                                            
                                            formik.setFieldValue(`trials.${index}.standardType`, 'preferred')
                                            formik.setFieldValue(`trials.${index}.standardLevel`, '')
                                            formik.setFieldValue(`trials.${index}.standardHeight`, '')
                                          }}
                                          disabled={!!!formik.values.dogId}
                                        />
                                      </div>                    
                                      <div className={style.abilityDropdownContainer}>            
                                        <Form.Input  
                                          fluid                  
                                          id={`standard-preferred-ability-${trial.trialId}`}
                                          name={`trials.${index}.standardPrefLevel`}
                                          placeholder='Level'
                                          selection                        
                                          options={generateClassOptions(trialObj.standardAbility as string[])}
                                          control={Dropdown}
                                          value={formik.values.trials[index].standardPrefLevel}
                                          onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.standardPrefLevel`, d.value)}
                                          disabled={!!!formik.values.dogId || formik.values.trials[index].standardType !== 'preferred'}
                                        />
                                      </div>
                                      <div className={style.heightDropdownContainer}>
                                        <Form.Input
                                          fluid
                                          id={`standard-preferred-height-${trial.trialId}`}
                                          name={`trials.${index}.standardPrefHeight`}
                                          placeholder='Height'
                                          selection
                                          options={heightValues}
                                          control={Dropdown}
                                          value={formik.values.trials[index].standardPrefHeight}
                                          onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.standardPrefHeight`, d.value)}
                                          disabled={!!!formik.values.dogId || formik.values.trials[index].standardType !== 'preferred'}
                                        />
                                      </div>
                                    </div>
                                  </>
                                ) : null}                                
                              </Card.Content>
                              <Card.Content>
                                <Card.Meta>Jumpers</Card.Meta>
                                {trialObj.jumpersClass ? (
                                  <>
                                    <div className={style.cardContentBody}>
                                      <div className={style.typeRadioContainer}>
                                        <Form.Input
                                          fluid
                                          id={`jumpers-type-regular-${index}`}
                                          name={`trials.${index}.jumpersType`}
                                          label='Regular'
                                          control={Radio}
                                          value='regular'
                                          checked={formik.values.trials[index].jumpersType === 'regular'}
                                          onClick={() => {
                                            formik.setFieldValue(`trials.${index}.jumpersType`, 'regular')
                                            formik.setFieldValue(`trials.${index}.jumpersPrefLevel`, '')
                                            formik.setFieldValue(`trials.${index}.jumpersPrefHeight`, '')
                                          }}
                                          disabled={!!!formik.values.dogId}
                                        />
                                      </div>                    
                                      <div className={style.abilityDropdownContainer}>
                                        <Form.Input
                                          fluid
                                          id={`jumpers-ability-${trial.trialId}`}
                                          name={`trials.${index}.jumpersLevel`}
                                          placeholder='Level'                      
                                          selection
                                          options={generateClassOptions(trialObj.jumpersAbility as string[])}
                                          control={Dropdown}
                                          value={formik.values.trials[index].jumpersLevel}
                                          onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.jumpersLevel`, d.value)}                                          
                                          disabled={!!!formik.values.dogId || formik.values.trials[index].jumpersType !== 'regular'}
                                        />
                                      </div>
                                      <div className={style.heightDropdownContainer}>
                                        <Form.Input
                                          fluid
                                          id={`jumpers-height-${trial.trialId}`}
                                          name={`trials.${index}.jumpersHeight`}
                                          placeholder='Height'
                                          selection
                                          options={heightValues}
                                          control={Dropdown}
                                          value={formik.values.trials[index].jumpersHeight}
                                          onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.jumpersHeight`, d.value)}                                          
                                          disabled={!!!formik.values.dogId || formik.values.trials[index].jumpersType !== 'regular'}
                                        />
                                      </div>
                                    </div>
                                    <div className={style.cardContentBody}>
                                      <div className={style.typeRadioContainer}>
                                        <Form.Input
                                          fluid
                                          id={`jumpers-type-preferred-${index}`}
                                          name={`trials.${index}.jumpersType`}
                                          label='Preferred'                                            
                                          control={Radio}
                                          value='preferred'
                                          checked={formik.values.trials[index].jumpersType === 'preferred'}
                                          onClick={() => {
                                            formik.setFieldValue(`trials.${index}.jumpersType`, 'preferred')
                                            formik.setFieldValue(`trials.${index}.jumpersLevel`, '')
                                            formik.setFieldValue(`trials.${index}.jumpersHeight`, '')
                                          }}
                                          disabled={!!!formik.values.dogId}
                                        />
                                      </div>                    
                                      <div className={style.abilityDropdownContainer}>
                                        <Form.Input
                                          fluid 
                                          id={`jumpers-preferred-ability-${trial.trialId}`}
                                          name={`trials.${index}.jumpersPrefLevel`}
                                          placeholder='Level'                       
                                          selection
                                          options={generateClassOptions(trialObj.jumpersAbility as string[])}
                                          control={Dropdown}
                                          value={formik.values.trials[index].jumpersPrefLevel}
                                          onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.jumpersPrefLevel`, d.value)}                                          
                                          disabled={!!!formik.values.dogId || formik.values.trials[index].jumpersType !== 'preferred'}
                                        />
                                      </div>
                                      <div className={style.heightDropdownContainer}>
                                        <Form.Input
                                          fluid
                                          id={`jumpers-preferred-height-${trial.trialId}`}
                                          name={`trials.${index}.jumpersPrefHeight`}
                                          placeholder='Height'
                                          selection
                                          options={heightValues}
                                          control={Dropdown}
                                          value={formik.values.trials[index].jumpersPrefHeight}
                                          onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.jumpersPrefHeight`, d.value)}                                          
                                          disabled={!!!formik.values.dogId || formik.values.trials[index].jumpersType !== 'preferred'}
                                        />
                                      </div>
                                    </div>
                                  </>
                                ) : null}

                              </Card.Content>
                              <Card.Content>
                                <Card.Meta>FAST</Card.Meta>
                                {trialObj.fastClass ? (
                                  <>
                                    <div className={style.cardContentBody}>
                                      <div className={style.typeRadioContainer}>
                                        <Form.Input
                                          fluid
                                          id={`fast-type-regular-${index}`}
                                          name={`trials.${index}.fastType`}
                                          label='Regular'                      
                                          control={Radio}
                                          value='regular'
                                          checked={formik.values.trials[index].fastType === 'regular'}
                                          onClick={() => {
                                            formik.setFieldValue(`trials.${index}.fastType`, 'regular')
                                            formik.setFieldValue(`trials.${index}.fastPrefLevel`, '')
                                            formik.setFieldValue(`trials.${index}.fastPrefHeight`, '')
                                          }}
                                          disabled={!!!formik.values.dogId}
                                        />
                                      </div>                    
                                      <div className={style.abilityDropdownContainer}>
                                        <Form.Input
                                          fluid
                                          id={`fast-ability-${trial.trialId}`}
                                          name={`trials.${index}.fastLevel`}
                                          placeholder='Level'                     
                                          selection
                                          options={generateClassOptions(trialObj.fastAbility as string[])}
                                          control={Dropdown}
                                          value={formik.values.trials[index].fastLevel}
                                          onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.fastLevel`, d.value)}                                          
                                          disabled={!!!formik.values.dogId || formik.values.trials[index].fastType !== 'regular'}
                                        />
                                      </div>
                                      <div className={style.heightDropdownContainer}>
                                        <Form.Input
                                          fluid
                                          id={`fast-height-${trial.trialId}`}
                                          name={`trials.${index}.fastHeight`}
                                          placeholder='Height'
                                          selection
                                          options={heightValues}
                                          control={Dropdown}
                                          value={formik.values.trials[index].fastHeight}
                                          onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.fastHeight`, d.value)}                                          
                                          disabled={!!!formik.values.dogId || formik.values.trials[index].fastType !== 'regular'}
                                        />
                                      </div>
                                    </div>
                                    <div className={style.cardContentBody}>
                                        <div className={style.typeRadioContainer}>
                                          <Form.Input
                                            fluid
                                            id={`fast-type-preferred-${index}`}
                                            name={`trials.${index}.fastType`}
                                            label='Preferred'                        
                                            control={Radio}
                                            value='preferred'
                                            checked={formik.values.trials[index].fastType === 'preferred'}
                                            onClick={() => {
                                              formik.setFieldValue(`trials.${index}.fastType`, 'preferred')
                                              formik.setFieldValue(`trials.${index}.fastLevel`, '')
                                              formik.setFieldValue(`trials.${index}.fastHeight`, '')
                                            }}
                                            disabled={!!!formik.values.dogId}
                                          />
                                        </div>                      
                                        <div className={style.abilityDropdownContainer}>
                                          <Form.Input
                                            fluid
                                            id={`fast-preferred-ability-${trial.trialId}`}
                                            name={`trials.${index}.fastPrefLevel`}
                                            placeholder='Level'                         
                                            selection
                                            options={generateClassOptions(trialObj.fastAbility as string[])}
                                            control={Dropdown}
                                            value={formik.values.trials[index].fastPrefLevel}
                                            onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.fastPrefLevel`, d.value)}                                          
                                            disabled={!!!formik.values.dogId || formik.values.trials[index].fastType !== 'preferred'}
                                          />                                        
                                        </div>
                                        <div className={style.heightDropdownContainer}>
                                          <Form.Input
                                              fluid
                                              id={`fast-preferred-height-${trial.trialId}`}
                                              name={`trials.${index}.fastPrefHeight`}
                                              placeholder='Height'
                                              selection
                                              options={heightValues}
                                              control={Dropdown}
                                              value={formik.values.trials[index].fastPrefHeight}
                                              onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.fastPrefHeight`, d.value)}                                          
                                              disabled={!!!formik.values.dogId || formik.values.trials[index].fastType !== 'preferred'}
                                            />
                                        </div>
                                      </div>
                                  </>
                                ) : null}
                              </Card.Content>
                              <Card.Content>
                                <Card.Meta>T2B and Premier</Card.Meta>
                                  {trialObj.t2bClass ? (
                                  <>
                                    <div className={style.cardContentBody}>
                                      <div className={style.typeRadioContainer}>
                                        <Form.Input 
                                          id={`t2b-preferred-${trial.trialId}`}
                                          name={`trials.${index}.t2b`}
                                          label='T2B Class'
                                          control={Checkbox}
                                          checked={formik.values.trials[index].t2b}
                                          value={formik.values.trials[index].t2b}
                                          onChange={() => {
                                            const newValue = !formik.values.trials[index].t2b
                                            formik.setFieldValue(`trials.${index}.t2b`, newValue)
                                            if (!newValue) {
                                              formik.setFieldValue(`trials.${index}.t2bHeight`, '')
                                            }
                                          }}
                                          disabled={!!!formik.values.dogId}
                                        />
                                      </div>
                                      <div className={style.heightDropdownContainer}>
                                        <Form.Input
                                          fluid
                                          id={`t2b-height-${trial.trialId}`}
                                          name={`trials.${index}.t2bHeight`}
                                          placeholder='Height'
                                          selection
                                          options={heightValues}
                                          control={Dropdown}
                                          value={formik.values.trials[index].t2bHeight}
                                          onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.t2bHeight`, d.value)}                                          
                                          disabled={!!!formik.values.dogId || !formik.values.trials[index].t2b}
                                        />
                                      </div>
                                    </div>
                                  </>                                  
                                ) : null}
                                {trialObj.premierStandard ? (
                                  <>
                                    <div className={style.cardContentBody}>
                                      <div className={style.typeRadioContainer}>
                                        <Form.Input 
                                          id={`premier-standard-${trial.trialId}`}
                                          name={`trials.${index}.premierStandard`}
                                          label='Premier Standard'
                                          control={Checkbox}
                                          checked={formik.values.trials[index].premierStandard}
                                          value={formik.values.trials[index].premierStandard}
                                          onChange={() => {
                                            const newValue = !formik.values.trials[index].premierStandard
                                              formik.setFieldValue(`trials.${index}.premierStandard`, newValue)
                                              if (!newValue) {
                                                formik.setFieldValue(`trials.${index}.premierStandardHeight`, '')
                                              }
                                          }}
                                          disabled={!!!formik.values.dogId}
                                        />
                                      </div>
                                      <div className={style.heightDropdownContainer}>
                                        <Form.Input
                                            fluid
                                            id={`premier-standard-height-${trial.trialId}`}
                                            name={`trials.${index}.premierStandardHeight`}
                                            placeholder='Height'
                                            selection
                                            options={heightValues}
                                            control={Dropdown}
                                            value={formik.values.trials[index].premierStandardHeight}
                                            onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.premierStandardHeight`, d.value)}                                          
                                            disabled={!!!formik.values.dogId || !formik.values.trials[index].premierStandard}
                                          />
                                      </div>
                                    </div>
                                  </>                                  
                                  ) : null}
                                {trialObj.premierJumpers ? (
                                  <>
                                    <div className={style.cardContentBody}>
                                      <div className={style.typeRadioContainer}>
                                        <Form.Input 
                                          id={`premier-jumpers-${trial.trialId}`}
                                          name={`trials.${index}.premierJumpers`}
                                          label='Premier Jumpers'
                                          control={Checkbox}
                                          checked={formik.values.trials[index].premierJumpers}
                                          value={formik.values.trials[index].premierJumpers}
                                          onChange={() => {
                                            const newValue = !formik.values.trials[index].premierJumpers
                                              formik.setFieldValue(`trials.${index}.premierJumpers`, newValue)
                                              if (!newValue) {
                                                formik.setFieldValue(`trials.${index}.premierJumpersHeight`, '')
                                              }
                                          }}
                                          disabled={!!!formik.values.dogId}
                                        />
                                      </div>
                                      <div className={style.heightDropdownContainer}>
                                      <Form.Input
                                        fluid
                                        id={`premier-jumpers-height-${trial.trialId}`}
                                        name={`trials.${index}.premierJumpersHeight`}
                                        placeholder='Height'
                                        selection
                                        options={heightValues}
                                        control={Dropdown}
                                        value={formik.values.trials[index].premierJumpersHeight}
                                        onChange={(e: any, d: any) => formik.setFieldValue(`trials.${index}.premierJumpersHeight`, d.value)}                                          
                                        disabled={!!!formik.values.dogId || !formik.values.trials[index].premierJumpers}
                                      />
                                      </div>
                                    </div>
                                  </>                                  
                                ) : null}                        
                              </Card.Content>
                            </Card>
                          )
                        })}
                      </>
                    )
                  }}
                </FieldArray>                   
              </Card.Group>  
            ) : (
              <div style={{height: '100vh', width: '100vw'}}>
                  <Dimmer active>
                    <Loader>Loading</Loader>
                  </Dimmer>
                </div>
            )}
            <Button color='black' onClick={formik.submitForm}>Next</Button>    
            </Form>
          )
        }}        
      </Formik>    
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