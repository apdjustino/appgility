import style from './AddRun.module.scss'

import React, { useContext, useState } from 'react'
import { useQuery, useMutation, useReactiveVar } from '@apollo/client'
import { Container, Card, Dropdown, Loader, Dimmer, Message, Button, Modal, Checkbox, Radio } from 'semantic-ui-react'
import { Form } from "react-bootstrap";
import Select from "react-select";
import { CONFIG_NEW_RUN, ADD_NEW_RUN, GET_TRIAL_RUNS } from '../../queries/runs/runs'
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router'
import { Ability, EventTrial } from '../../types/trial'
import { Dog } from '../../types/person'
import { addRunFormVar } from "../../reactiveVars";
import { Link } from 'react-router-dom'
import { Formik, FieldArray } from 'formik'
import moment from 'moment'
import { buildRunsToAdd, Run, RunToAdd } from './utils'
import { SelectOptions } from '../../types/generic';

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

const generateClassOptions = (rawOptions: Ability[]) : SelectOptions<string>[] => {
  
  return rawOptions.map(option => ({    
    label: option.label,
    value: option.label.toUpperCase()
  }))  

}

const AddRun = () => {
  const history = useHistory()
  const { url } = useRouteMatch()
  const { eventId } = useParams<ConfigureParams>()  
  const { personId } = addRunFormVar()
  const { pathname } = useLocation()
  const { data, loading, error } = useQuery<QueryResponse>(CONFIG_NEW_RUN, { variables: { personId, eventId}})
  const [showAddDog, setShowAddDog] = useState(false)
  const [addRun, result] = useMutation(ADD_NEW_RUN)
  const runFormData = useReactiveVar(addRunFormVar);
  
  
  const noDogOptions: DogOption[] = [
    { key: '-1', text: 'No Dogs Added', value: '-1', disabled: true},    
  ]

  const heightValues: SelectOptions<number>[] = [
    { value: 4, label: '4"'},
    { value: 8, label: '8"'},
    { value: 12, label: '12"'},
    { value: 16, label: '16"'},
    { value: 20, label: '20"'},
    { value: 24, label: '24"'},
  ]

  return personId ? (
    <Container>
      <Formik
        enableReinitialize={true}
        initialValues={{          
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
          const runs = buildRunsToAdd(values.trials, personId, runFormData.dogId)          
          runs.forEach((run: Run) => {
            addRun({ variables: {
              eventId,
              trialId: (run as RunToAdd).trialId,
              personId: (run as RunToAdd).personId,
              dogId: (run as RunToAdd).dogId,
              run: {
                agilityClass: (run as RunToAdd).agilityClass,
                level: (run as RunToAdd).level,
                jumpHeight: (run as RunToAdd).jumpHeight,
                preferred: (run as RunToAdd).preferred,
                group: (run as RunToAdd).group,
              }
            }, refetchQueries: [
              { query: GET_TRIAL_RUNS, variables: { trialId: (run as RunToAdd).trialId }}
            ]}).then((result) => {
              history.push(`/events/${eventId}/registration`)
            }).catch((e) => {
              console.log('error')
              console.log(e)
            })
          })
        }}
        validate={({ trials }) => {
          let hasError = false
          const errors: any = { trials: trials.map(trial => (
            {
              standardLevel: undefined,
              standardHeight: undefined,
              standardPrefLevel: undefined,
              sandardPrefHeight: undefined,
              jumpersLevel: undefined,
              jumpersHeight: undefined,
              jumpersPrefLevel: undefined,
              jumpersPrefHeight: undefined,
              fastLevel: undefined,
              fastHeight: undefined,              
              fastPrefLevel: undefined,
              fastPrefHeight: undefined,
              t2bHeight: undefined,
              premierStandardHeight: undefined,
              premierJumpersHeight: undefined
            }))}
          trials.forEach((trial, index) => {
            if (trial.standardType === 'regular' && trial.standardLevel === '') {              
              if (trial.standardLevel === '') {
                errors.trials[index].standardLevel = 'Level is required to add this run'
                hasError = true
              }

              if (trial.standardHeight === '') {
                errors.trials[index].standardHeight = 'Height is required to add this run'
                hasError = true
              }              
            }

            if (trial.standardType === 'preferred') {
              if (trial.standardPrefLevel === '') {
                errors.trials[index].standardPrefLevel = 'Level is required to add this run'
                hasError = true
              }

              if (trial.standardPrefHeight === '') {
                errors.trials[index].standardPrefHeight = 'Height is required to add this run'
                hasError = true
              }
            }

            if (trial.jumpersType === 'regular') {
              if (trial.jumpersLevel === '') {
                errors.trials[index].jumpersLevel = 'Level is required to add this run'
                hasError = true
              }

              if (trial.jumpersHeight === '') {
                errors.trials[index].jumpersHeight = 'Height is required to add this run'
                hasError = true
              }
            }

            if (trial.jumpersType === 'preferred') {
              if (trial.jumpersPrefLevel === '') {
                errors.trials[index].jumpersPrefLevel = 'Level is required to add this run'
                hasError = true
              }

              if (trial.jumpersPrefHeight === '') {
                errors.trials[index].jumpersPrefHeight = 'Height is required to add this run'
                hasError = true
              }
            }

            if (trial.fastType === 'regular') {
              if (trial.fastLevel === '') {
                errors.trials[index].fastLevel = 'Level is required to add this run'
                hasError = true
              }

              if (trial.fastHeight === '') {
                errors.trials[index].fastHeight = 'Height is required to add this run'
                hasError = true
              }
            }

            if (trial.fastType === 'preferred') {
              if (trial.fastPrefLevel === '') {
                errors.trials[index].fastPrefLevel = 'Level is required to add this run'
                hasError = true
              }

              if (trial.fastPrefHeight === '') {
                errors.trials[index].fastPrefHeight = 'Height is required to add this run'
                hasError = true
              }
            }

            if (trial.t2b) {              
              if (trial.t2bHeight === '') {
                errors.trials[index].t2bHeight = 'Height is required to add this run'
                hasError = true
              }
            }

            if (trial.premierStandard) {              
              if (trial.premierStandardHeight === '') {
                errors.trials[index].premierStandardHeight = 'Height is required to add this run'
                hasError = true
              }
            }

            if (trial.premierJumpers) {              
              if (trial.premierJumpersHeight === '') {
                errors.trials[index].premierJumpersHeight = 'Height is required to add this run'
                hasError = true
              }
            }
          })
          
          return hasError ? errors : {}
        }}
      >
        {(formik) => {
          return (
            <Form onSubmit={formik.handleSubmit}>              
            {!!data && !!data.getEventTrials && !loading ? (              
              <FieldArray name='trials'>
                {() => {                     
                  return (
                    <>
                      {formik.values.trials.map((trial, index) => {
                        const trialObj = data.getEventTrials.find(t => t.trialId === trial.trialId)
                        return !!trialObj ? (
                          <Card>
                            <Card.Content extra>
                              <Card.Header>{trial.trialDate}</Card.Header>
                            </Card.Content>
                            <Card.Content>
                              <Card.Meta>Standard</Card.Meta>
                              {trialObj.standardClass ? (
                                <>
                                  <div className="d-flex">
                                    <div>
                                      <Form.Check                                        
                                        id={`standard-type-regular-${index}`}
                                        name={`trials.${index}.standardType`}
                                        label='Regular'
                                        type="radio"
                                        value='regular'
                                        checked={formik.values.trials[index].standardType === 'regular'}
                                        onClick={() => {
                                          formik.setFieldValue(`trials.${index}.standardType`, 'regular')
                                          formik.setFieldValue(`trials.${index}.standardPrefLevel`, '')
                                          formik.setFieldValue(`trials.${index}.standardPrefHeight`, '')
                                        }}
                                        disabled={!runFormData.dogId}                                          
                                      />                  
                                    </div>                  
                                    <div>            
                                      <Form.Control                                        
                                        id={`standard-level-${trial.trialId}`}
                                        name={`trials.${index}.standardLevel`}
                                        placeholder='Level'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={generateClassOptions(trialObj.standardAbility as Ability[])}
                                        value={formik.values.trials[index].standardLevel}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.standardLevel`, newValue)}                                        
                                        disabled={!runFormData.dogId || formik.values.trials[index].standardType !== 'regular'}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].standardLevel && !!formik.errors.trials && !!(formik.errors.trials[index] as any).standardLevel}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).standardLevel : ""}</Form.Control.Feedback>
                                    </div>
                                    <div>
                                      <Form.Control                                        
                                        id={`standard-height-${trial.trialId}`}
                                        name={`trials.${index}.standardHeight`}
                                        placeholder='Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].standardHeight}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.standardHeight`, newValue)}
                                        disabled={!runFormData.dogId || formik.values.trials[index].standardType !== 'regular'}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].standardHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).standardHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).standardHeight : ""}</Form.Control.Feedback>
                                    </div>                  
                                  </div>
                                  <div className="d-flex">
                                    <div>
                                      <Form.Check                                        
                                          id={`standard-type-preferred-${index}`}
                                          name={`trials.${index}.standardType`}
                                          label='Preferred'
                                          type="radio"
                                          value='preferred'
                                          checked={formik.values.trials[index].standardType === 'preferred'}
                                          onClick={() => {
                                            formik.setFieldValue(`trials.${index}.standardType`, 'preferred')
                                            formik.setFieldValue(`trials.${index}.standardPrefLevel`, '')
                                            formik.setFieldValue(`trials.${index}.standardPrefHeight`, '')
                                          }}
                                          disabled={!runFormData.dogId}                                          
                                        />   
                                    </div>                    
                                    <div>            
                                      <Form.Control                                        
                                        id={`standard-preferred-level-${trial.trialId}`}
                                        name={`trials.${index}.standardPrefLevel`}
                                        placeholder='Preferred Level'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={generateClassOptions(trialObj.standardAbility as Ability[])}
                                        value={formik.values.trials[index].standardPrefLevel}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.standardPrefLevel`, newValue)}                                        
                                        disabled={!runFormData.dogId || formik.values.trials[index].standardType !== 'regular'}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].standardPrefLevel && !!formik.errors.trials && !!(formik.errors.trials[index] as any).standardPrefLevel}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).standardPrefLevel : ""}</Form.Control.Feedback>
                                    </div>
                                    <div>
                                      <Form.Control                                        
                                        id={`standard-preferred-height-${trial.trialId}`}
                                        name={`trials.${index}.standardPrefHeight`}
                                        placeholder='Preferred Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].standardPrefHeight}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.standardPrefHeight`, newValue)}
                                        disabled={!runFormData.dogId || formik.values.trials[index].standardType !== 'regular'}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].standardPrefHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).standardPrefHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).standardPrefHeight : ""}</Form.Control.Feedback>
                                    </div> 
                                  </div>
                                </>
                              ) : null}                                
                            </Card.Content>
                            <Card.Content>
                              <Card.Meta>Jumpers</Card.Meta>
                              {trialObj.jumpersClass ? (
                                <>
                                  <div className="d-flex">
                                    <div>
                                      <Form.Check                                        
                                        id={`jumpers-type-regular-${index}`}
                                        name={`trials.${index}.jumpersType`}
                                        label='Regular'
                                        type="radio"
                                        value='regular'
                                        checked={formik.values.trials[index].jumpersType === 'regular'}
                                        onClick={() => {
                                          formik.setFieldValue(`trials.${index}.jumpersType`, 'regular')
                                          formik.setFieldValue(`trials.${index}.jumpersPrefLevel`, '')
                                          formik.setFieldValue(`trials.${index}.jumpersPrefHeight`, '')
                                        }}
                                        disabled={!runFormData.dogId}                                          
                                      />                  
                                    </div>                  
                                    <div>            
                                      <Form.Control                                        
                                        id={`jumpers-level-${trial.trialId}`}
                                        name={`trials.${index}.jumpersLevel`}
                                        placeholder='Level'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={generateClassOptions(trialObj.jumpersAbility as Ability[])}
                                        value={formik.values.trials[index].jumpersLevel}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.jumpersLevel`, newValue)}                                        
                                        disabled={!runFormData.dogId || formik.values.trials[index].jumpersType !== 'regular'}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].jumpersLevel && !!formik.errors.trials && !!(formik.errors.trials[index] as any).jumpersLevel}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).jumpersLevel : ""}</Form.Control.Feedback>
                                    </div>
                                    <div>
                                      <Form.Control                                        
                                        id={`jumpers-height-${trial.trialId}`}
                                        name={`trials.${index}.jumpersHeight`}
                                        placeholder='Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].jumpersHeight}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.jumpersHeight`, newValue)}
                                        disabled={!runFormData.dogId || formik.values.trials[index].jumpersType !== 'regular'}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].jumpersHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).jumpersHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).jumpersHeight : ""}</Form.Control.Feedback>
                                    </div>                  
                                  </div>
                                  <div className="d-flex">
                                    <div>
                                      <Form.Check                                        
                                          id={`jumpers-type-preferred-${index}`}
                                          name={`trials.${index}.jumpersType`}
                                          label='Preferred'
                                          type="radio"
                                          value='preferred'
                                          checked={formik.values.trials[index].jumpersType === 'preferred'}
                                          onClick={() => {
                                            formik.setFieldValue(`trials.${index}.jumpersType`, 'preferred')
                                            formik.setFieldValue(`trials.${index}.jumpersPrefLevel`, '')
                                            formik.setFieldValue(`trials.${index}.jumpersPrefHeight`, '')
                                          }}
                                          disabled={!runFormData.dogId}                                          
                                        />   
                                    </div>                    
                                    <div>            
                                      <Form.Control                                        
                                        id={`jumpers-preferred-level-${trial.trialId}`}
                                        name={`trials.${index}.jumpersPrefLevel`}
                                        placeholder='Preferred Level'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={generateClassOptions(trialObj.jumpersAbility as Ability[])}
                                        value={formik.values.trials[index].jumpersPrefLevel}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.jumpersPrefLevel`, newValue)}                                        
                                        disabled={!runFormData.dogId || formik.values.trials[index].jumpersType !== 'regular'}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].jumpersPrefLevel && !!formik.errors.trials && !!(formik.errors.trials[index] as any).jumpersPrefLevel}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).jumpersPrefLevel : ""}</Form.Control.Feedback>
                                    </div>
                                    <div>
                                      <Form.Control                                        
                                        id={`jumpers-preferred-height-${trial.trialId}`}
                                        name={`trials.${index}.jumpersPrefHeight`}
                                        placeholder='Preferred Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].jumpersPrefHeight}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.jumpersPrefHeight`, newValue)}
                                        disabled={!runFormData.dogId || formik.values.trials[index].jumpersType !== 'regular'}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].jumpersPrefHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).jumpersPrefHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).jumpersPrefHeight : ""}</Form.Control.Feedback>
                                    </div> 
                                  </div>
                                </>
                              ) : null}

                            </Card.Content>
                            <Card.Content>
                              <Card.Meta>FAST</Card.Meta>
                              {trialObj.fastClass ? (
                                <>
                                  <div className="d-flex">
                                    <div>
                                      <Form.Check                                        
                                        id={`fast-type-regular-${index}`}
                                        name={`trials.${index}.fastType`}
                                        label='Regular'
                                        type="radio"
                                        value='regular'
                                        checked={formik.values.trials[index].fastType === 'regular'}
                                        onClick={() => {
                                          formik.setFieldValue(`trials.${index}.fastType`, 'regular')
                                          formik.setFieldValue(`trials.${index}.fastPrefLevel`, '')
                                          formik.setFieldValue(`trials.${index}.fastPrefHeight`, '')
                                        }}
                                        disabled={!runFormData.dogId}                                          
                                      />                  
                                    </div>                  
                                    <div>            
                                      <Form.Control                                        
                                        id={`fast-level-${trial.trialId}`}
                                        name={`trials.${index}.fastLevel`}
                                        placeholder='Level'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={generateClassOptions(trialObj.fastAbility as Ability[])}
                                        value={formik.values.trials[index].fastLevel}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.fastLevel`, newValue)}                                        
                                        disabled={!runFormData.dogId || formik.values.trials[index].fastType !== 'regular'}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].fastLevel && !!formik.errors.trials && !!(formik.errors.trials[index] as any).fastLevel}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).fastLevel : ""}</Form.Control.Feedback>
                                    </div>
                                    <div>
                                      <Form.Control                                        
                                        id={`fast-height-${trial.trialId}`}
                                        name={`trials.${index}.fastHeight`}
                                        placeholder='Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].fastHeight}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.fastHeight`, newValue)}
                                        disabled={!runFormData.dogId || formik.values.trials[index].fastType !== 'regular'}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].fastHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).fastHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).fastHeight : ""}</Form.Control.Feedback>
                                    </div>                  
                                  </div>
                                  <div className="d-flex">
                                    <div>
                                      <Form.Check                                        
                                          id={`fast-type-preferred-${index}`}
                                          name={`trials.${index}.fastType`}
                                          label='Preferred'
                                          type="radio"
                                          value='preferred'
                                          checked={formik.values.trials[index].fastType === 'preferred'}
                                          onClick={() => {
                                            formik.setFieldValue(`trials.${index}.fastType`, 'preferred')
                                            formik.setFieldValue(`trials.${index}.fastPrefLevel`, '')
                                            formik.setFieldValue(`trials.${index}.fastPrefHeight`, '')
                                          }}
                                          disabled={!runFormData.dogId}                                          
                                        />   
                                    </div>                    
                                    <div>            
                                      <Form.Control                                        
                                        id={`fast-preferred-level-${trial.trialId}`}
                                        name={`trials.${index}.fastPrefLevel`}
                                        placeholder='Preferred Level'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={generateClassOptions(trialObj.fastAbility as Ability[])}
                                        value={formik.values.trials[index].fastPrefLevel}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.fastPrefLevel`, newValue)}                                        
                                        disabled={!runFormData.dogId || formik.values.trials[index].fastType !== 'regular'}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].fastPrefLevel && !!formik.errors.trials && !!(formik.errors.trials[index] as any).fastPrefLevel}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).fastPrefLevel : ""}</Form.Control.Feedback>
                                    </div>
                                    <div>
                                      <Form.Control                                        
                                        id={`fast-preferred-height-${trial.trialId}`}
                                        name={`trials.${index}.fastPrefHeight`}
                                        placeholder='Preferred Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].fastPrefHeight}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.fastPrefHeight`, newValue)}
                                        disabled={!runFormData.dogId || formik.values.trials[index].fastType !== 'regular'}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].fastPrefHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).fastPrefHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).fastPrefHeight : ""}</Form.Control.Feedback>
                                    </div> 
                                  </div>
                                </>
                              ) : null}
                            </Card.Content>
                            <Card.Content>
                              <Card.Meta>T2B and Premier</Card.Meta>
                                {trialObj.t2bClass ? (
                                <>
                                  <div className="d-flex">
                                    <div>
                                      <Form.Check 
                                        id={`t2b-${trial.trialId}`}
                                        name={`trials.${index}.t2b`}
                                        label='T2B Class' 
                                        type="checkbox"                  
                                        checked={formik.values.trials[index].t2b}                                        
                                        onChange={() => {
                                          const newValue = !formik.values.trials[index].t2b
                                          formik.setFieldValue(`trials.${index}.t2b`, newValue)
                                          if (!newValue) {
                                            formik.setFieldValue(`trials.${index}.t2bHeight`, '')
                                          }
                                        }}
                                        disabled={!runFormData.dogId}
                                      />
                                    </div>
                                    <div>
                                      <Form.Control                                        
                                        id={`t2b-height-${trial.trialId}`}
                                        name={`trials.${index}.t2bHeight`}
                                        placeholder='Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].t2bHeight}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.t2bHeight`, newValue)}
                                        disabled={!runFormData.dogId || !formik.values.trials[index].t2b}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].t2bHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).t2bHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).t2bHeight : ""}</Form.Control.Feedback>                                      
                                    </div>
                                  </div>
                                </>                                  
                              ) : null}
                              {trialObj.premierStandard ? (
                                <>
                                  <div className="d-flex">
                                    <div>
                                      <Form.Check 
                                        id={`premier-standard-${trial.trialId}`}
                                        name={`trials.${index}.premierStandard`}
                                        label='Premier Standard'
                                        type="checkbox"                                        
                                        checked={formik.values.trials[index].premierStandard}                                        
                                        onChange={() => {
                                          const newValue = !formik.values.trials[index].premierStandard
                                            formik.setFieldValue(`trials.${index}.premierStandard`, newValue)
                                            if (!newValue) {
                                              formik.setFieldValue(`trials.${index}.premierStandardHeight`, '')
                                            }
                                        }}
                                        disabled={!runFormData.dogId}
                                      />
                                    </div>
                                    <div>
                                    <Form.Control                                        
                                      id={`premier-standard-height-${trial.trialId}`}
                                      name={`trials.${index}.premierStandardHeight`}
                                      placeholder='Height'
                                      className="bg-transparent border-0 p-0"
                                      as={Select}
                                      options={heightValues}                                        
                                      value={formik.values.trials[index].premierStandardHeight}
                                      onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.premierStandardHeight`, newValue)}
                                      disabled={!runFormData.dogId || !formik.values.trials[index].premierStandard}
                                      isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].premierStandardHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).premierStandardHeight}
                                    />
                                    <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).premierStandardHeight : ""}</Form.Control.Feedback> 
                                    </div>
                                  </div>
                                </>                                  
                                ) : null}
                              {trialObj.premierJumpers ? (
                                <>
                                  <div className="d-flex">
                                    <div>
                                      <Form.Check 
                                        id={`premier-jumpers-${trial.trialId}`}
                                        name={`trials.${index}.premierJumpers`}
                                        label='Premier Jumpers'
                                        type="checkbox"                                        
                                        checked={formik.values.trials[index].premierJumpers}                                        
                                        onChange={() => {
                                          const newValue = !formik.values.trials[index].premierJumpers
                                            formik.setFieldValue(`trials.${index}.premierJumpers`, newValue)
                                            if (!newValue) {
                                              formik.setFieldValue(`trials.${index}.premierJumpersHeight`, '')
                                            }
                                        }}
                                        disabled={!runFormData.dogId}
                                      />
                                    </div>
                                    <div>
                                      <Form.Control                                        
                                        id={`premier-umpers-height-${trial.trialId}`}
                                        name={`trials.${index}.premierJumpersHeight`}
                                        placeholder='Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].premierJumpersHeight}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.premierJumpersHeight`, newValue)}
                                        disabled={!runFormData.dogId || !formik.values.trials[index].premierJumpers}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].premierJumpersHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).premierJumpersHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).premierJumpersHeight : ""}</Form.Control.Feedback> 
                                    </div>
                                  </div>
                                </>                                  
                              ) : null}                        
                            </Card.Content>
                          </Card>
                        ) : null
                      })}
                    </>
                  )
                }}
              </FieldArray>                   
              
            ) : (
              <div style={{height: '100vh', width: '100vw'}}>
                  <Dimmer active>
                    <Loader>Loading</Loader>
                  </Dimmer>
                </div>
            )}
            <Button color='black' type='submit' loading={result.loading}>Next</Button>    
            </Form>
          )
        }}        
      </Formik>
    </Container>
  ) : (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Message error content='Exhibitor not selected.' style={{width: '300px'}}/>
      <Link to={`${pathname.replace('/config', '/person')}`}>Click here to start over</Link> 
    </div>
  )
}

export default AddRun