import style from './AddRun.module.scss'

import React from 'react'
import { useQuery, useMutation, useReactiveVar } from '@apollo/client'
import { Form, Card, Spinner, Button, Alert } from "react-bootstrap";
import Select from "react-select";
import { CONFIG_NEW_RUN, ADD_NEW_RUN, GET_TRIAL_RUNS } from '../../queries/runs/runs'
import { useHistory, useParams } from 'react-router'
import { Ability, EventTrial } from '../../types/trial'
import { Dog } from '../../types/person'
import { addRunFormVar } from "../../reactiveVars";
import { Formik, FieldArray, FormikProps } from 'formik'
import moment from 'moment'
import { isEqual } from "lodash";
import { buildRunsToAdd, NewRunForm, Run, RunToAdd } from './utils'
import { SelectOptions } from '../../types/generic';
import { X } from "react-feather"

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

type InitialValues = {
  trials: NewRunForm[]
}

type OwnProps = {
  formik: FormikProps<InitialValues>
}

const generateClassOptions = (rawOptions: Ability[]) : SelectOptions<string>[] => {
  
  return rawOptions.map(option => ({    
    label: option.label,
    value: option.label.toUpperCase()
  }))  

}

const AddRun = ({ formik }: OwnProps) => {
  const history = useHistory()  
  const { eventId } = useParams<ConfigureParams>()  
  const { personId } = addRunFormVar()  
  const { data, loading, error } = useQuery<QueryResponse>(CONFIG_NEW_RUN, { variables: { personId, eventId}})  
  const [addRun, result] = useMutation(ADD_NEW_RUN)
  const runFormData = useReactiveVar(addRunFormVar);
  
  const heightValues: SelectOptions<number | null>[] = [
    { value: 4, label: '4"'},
    { value: 8, label: '8"'},
    { value: 12, label: '12"'},
    { value: 16, label: '16"'},
    { value: 20, label: '20"'},
    { value: 24, label: '24"'},
  ] 

  const initialValues: InitialValues = {
    trials: !!data && !loading ? data.getEventTrials.map(trial => ({
      trialId: trial.trialId,
      trialDate: trial.trialDate as string,            
      standardPreferred: false,
      standardLevel: undefined,            
      standardHeight: undefined,            
      jumpersPreferred: false,
      jumpersLevel: undefined,
      jumpersHeight: undefined,            
      fastPreferred: false,
      fastLevel: undefined,
      fastHeight: undefined,                  
      t2bHeight: undefined,      
      premierStandardHeight: undefined,      
      premierJumpersHeight: undefined
    })) : []
  }

  return personId ? (
    <Form onSubmit={formik.handleSubmit}>              
      {!!data && !!data.getEventTrials && !loading ? (              
        <FieldArray name='trials'>
          {() => {                     
            return (
              <>
                {formik.values.trials.map((trial, index) => {
                  const trialObj = data.getEventTrials.find(t => t.trialId === trial.trialId)
                  return !!trialObj ? (
                    <div className="row my-3">
                      <div className="col">
                        <Card>                                
                          <Card.Header>
                            <h4 className="card-header-title">{moment(trial.trialDate, 'YYYY-MM-DD').format('MMMM Do, YYYY')}</h4>
                          </Card.Header> 
                          <Card.Body>
                            <div className="row mb-3">
                              <Card.Text>Standard</Card.Text>                                    
                              {trialObj.standardClass ? (
                                <>
                                  <div className="col-md-6 col-12 d-flex border-end">
                                    <div className="me-3 d-flex align-items-center">
                                      <Form.Check                                        
                                        id={`standard-preferred-${index}`}
                                        name={`trials.${index}.standardPreferred`}
                                        label='Preferred'
                                        type="checkbox"                                              
                                        checked={formik.values.trials[index].standardPreferred}
                                        onClick={() => {
                                          const newValue = !formik.values.trials[index].standardPreferred
                                          formik.setFieldValue(`trials.${index}.standardPreferred`, newValue)                                                                                               
                                        }}
                                        disabled={!runFormData.dogId}                                          
                                      />                  
                                    </div>                  
                                    <div className="w-100">            
                                      <Form.Control                                        
                                        id={`standard-level-${trial.trialId}`}
                                        name={`trials.${index}.standardLevel`}
                                        placeholder='Level'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={generateClassOptions(trialObj.standardAbility as Ability[])}
                                        value={formik.values.trials[index].standardLevel as any}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.standardLevel`, newValue)}                                        
                                        disabled={!runFormData.dogId}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].standardLevel && !!formik.errors.trials && !!(formik.errors.trials[index] as any).standardLevel}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).standardLevel : ""}</Form.Control.Feedback>
                                    </div>                                                         
                                  </div>
                                  <div className="col-md-6 col-12 d-flex"> 
                                    <div className="w-100">
                                      <Form.Control                                        
                                        id={`standard-height-${trial.trialId}`}
                                        name={`trials.${index}.standardHeight`}
                                        placeholder='Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].standardHeight as any}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.standardHeight`, newValue)}
                                        disabled={!runFormData.dogId}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].standardHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).standardHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).standardHeight : ""}</Form.Control.Feedback>                                        
                                    </div>
                                    <div className="ms-3">
                                      <Button variant="white" className="btn-rounded-circle" onClick={() => {
                                        formik.setFieldValue(`trials.${index}.standardPreferred`, false);
                                        formik.setFieldValue(`trials.${index}.standardLevel`, null);
                                        formik.setFieldValue(`trials.${index}.standardHeight`, null);
                                      }}>
                                        X
                                      </Button>
                                    </div>
                                  </div>                                        
                                </>
                              ) : null}                                
                            </div>
                            <div className="row mb-3">
                              <Card.Text>Jumpers</Card.Text>
                              {trialObj.jumpersClass ? (
                                <>
                                  <div className="col-md-6 col-12 d-flex border-end">
                                    <div className="me-3 d-flex align-items-center">
                                      <Form.Check                                        
                                        id={`jumpers-preferredr-${index}`}
                                        name={`trials.${index}.jumpersPreferred`}
                                        label='Preferred'
                                        type="checkbox"                                              
                                        checked={formik.values.trials[index].jumpersPreferred}
                                        onClick={() => {
                                          const newValue = !formik.values.trials[index].jumpersPreferred
                                          formik.setFieldValue(`trials.${index}.jumpersPreferred`, newValue)                                                
                                        }}
                                        disabled={!runFormData.dogId}                                          
                                      />                  
                                    </div>                  
                                    <div className="w-100">            
                                      <Form.Control                                        
                                        id={`jumpers-level-${trial.trialId}`}
                                        name={`trials.${index}.jumpersLevel`}
                                        placeholder='Level'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={generateClassOptions(trialObj.jumpersAbility as Ability[])}
                                        value={formik.values.trials[index].jumpersLevel as any}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.jumpersLevel`, newValue)}                                        
                                        disabled={!runFormData.dogId}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].jumpersLevel && !!formik.errors.trials && !!(formik.errors.trials[index] as any).jumpersLevel}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).jumpersLevel : ""}</Form.Control.Feedback>
                                    </div>                
                                  </div>
                                  <div className="col-md-6 col-12 d-flex">
                                    <div className="w-100">
                                      <Form.Control                                        
                                        id={`jumpers-height-${trial.trialId}`}
                                        name={`trials.${index}.jumpersHeight`}
                                        placeholder='Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].jumpersHeight as any}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.jumpersHeight`, newValue)}
                                        disabled={!runFormData.dogId}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].jumpersHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).jumpersHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).jumpersHeight : ""}</Form.Control.Feedback>
                                    </div>
                                    <div className="ms-3">
                                      <Button variant="white" className="btn-rounded-circle" onClick={() => {
                                        formik.setFieldValue(`trials.${index}.jumpersPreferred`, false);
                                        formik.setFieldValue(`trials.${index}.jumpersLevel`, null);
                                        formik.setFieldValue(`trials.${index}.jumpersHeight`, null);
                                      }}>
                                        X
                                      </Button>
                                    </div>                                          
                                  </div>                                        
                                </>
                              ) : null}

                            </div>
                            <div className="row mb-3">
                              <Card.Text>FAST</Card.Text>
                              {trialObj.fastClass ? (
                                <>
                                  <div className="col-md-6 col-12 d-flex border-end">
                                    <div className="me-3 d-flex align-items-center">
                                      <Form.Check                                        
                                        id={`fast-preferred-${index}`}
                                        name={`trials.${index}.fastPreferred`}
                                        label='Preferred'
                                        type="checkbox"                                              
                                        checked={formik.values.trials[index].fastPreferred}
                                        onClick={() => {
                                          const newValue = !formik.values.trials[index].fastPreferred
                                          formik.setFieldValue(`trials.${index}.fastPreferred`, newValue);                                                                                              
                                        }}
                                        disabled={!runFormData.dogId}                                          
                                      />                  
                                    </div>                  
                                    <div className="w-100">            
                                      <Form.Control                                        
                                        id={`fast-level-${trial.trialId}`}
                                        name={`trials.${index}.fastLevel`}
                                        placeholder='Level'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={generateClassOptions(trialObj.fastAbility as Ability[])}
                                        value={formik.values.trials[index].fastLevel as any}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.fastLevel`, newValue)}                                        
                                        disabled={!runFormData.dogId}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].fastLevel && !!formik.errors.trials && !!(formik.errors.trials[index] as any).fastLevel}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).fastLevel : ""}</Form.Control.Feedback>
                                    </div>              
                                  </div>
                                  <div className="col-md-6 col-12 d-flex">
                                    <div className="w-100">
                                      <Form.Control                                        
                                        id={`fast-height-${trial.trialId}`}
                                        name={`trials.${index}.fastHeight`}
                                        placeholder='Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].fastHeight as any}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.fastHeight`, newValue)}
                                        disabled={!runFormData.dogId}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].fastHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).fastHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).fastHeight : ""}</Form.Control.Feedback>
                                    </div>
                                    <div className="ms-3">
                                      <Button variant="white" className="btn-rounded-circle" onClick={() => {
                                        formik.setFieldValue(`trials.${index}.fastPreferred`, false);
                                        formik.setFieldValue(`trials.${index}.fastLevel`, null);
                                        formik.setFieldValue(`trials.${index}.fastHeight`, null);
                                      }}>
                                        X
                                      </Button>
                                    </div>  
                                  </div>
                                </>
                              ) : null}
                            </div>
                            <div className="row mb-3">
                              <Card.Text>T2B</Card.Text>
                                {trialObj.t2bClass ? (
                                <>
                                  <div className="col-12 d-flex border-end">                                          
                                    <div className="w-100">
                                      <Form.Control                                        
                                        id={`t2b-height-${trial.trialId}`}
                                        name={`trials.${index}.t2bHeight`}
                                        placeholder='Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].t2bHeight as any}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.t2bHeight`, newValue)}
                                        disabled={!runFormData.dogId}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].t2bHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).t2bHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).t2bHeight : ""}</Form.Control.Feedback>                                      
                                    </div>
                                    <div className="ms-3">
                                      <Button variant="white" className="btn-rounded-circle" onClick={() => {                                              
                                        formik.setFieldValue(`trials.${index}.t2bHeight`, null);
                                      }}>
                                        X
                                      </Button>
                                    </div>
                                  </div>
                                </>                                  
                              ) : null}
                            </div>
                            <div className="row mb-3">
                              <Card.Text>Premier Standard</Card.Text>
                              {trialObj.premierStandard ? (
                                <>
                                  <div className="col-12 d-flex border-end">                                          
                                    <div className="w-100">
                                      <Form.Control                                        
                                        id={`premier-standard-height-${trial.trialId}`}
                                        name={`trials.${index}.premierStandardHeight`}
                                        placeholder='Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].premierStandardHeight as any}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.premierStandardHeight`, newValue)}
                                        disabled={!runFormData.dogId}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].premierStandardHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).premierStandardHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).premierStandardHeight : ""}</Form.Control.Feedback> 
                                    </div>
                                    <div className="ms-3">
                                      <Button variant="white" className="btn-rounded-circle" onClick={() => {                                              
                                        formik.setFieldValue(`trials.${index}.premierStandardHeight`, null);
                                      }}>
                                        X
                                      </Button>
                                    </div>
                                  </div>
                                </>                                  
                                ) : null}
                              </div>
                              <div className="row mb-3">
                                <Card.Text>Premier Jumpers</Card.Text>
                              {trialObj.premierJumpers ? (
                                <>
                                  <div className="col-12 d-flex border-end">                                          
                                    <div className="w-100">
                                      <Form.Control                                        
                                        id={`premier-jumpers-height-${trial.trialId}`}
                                        name={`trials.${index}.premierJumpersHeight`}
                                        placeholder='Height'
                                        className="bg-transparent border-0 p-0"
                                        as={Select}
                                        options={heightValues}                                        
                                        value={formik.values.trials[index].premierJumpersHeight as any}
                                        onChange={(newValue: any) => formik.setFieldValue(`trials.${index}.premierJumpersHeight`, newValue)}
                                        disabled={!runFormData.dogId}
                                        isInvalid={!!formik.touched.trials && !!formik.touched.trials[index].premierJumpersHeight && !!formik.errors.trials && !!(formik.errors.trials[index] as any).premierJumpersHeight}
                                      />
                                      <Form.Control.Feedback type="invalid">{!!formik.errors && !!formik.errors.trials ? (formik.errors.trials[index] as any).premierJumpersHeight : ""}</Form.Control.Feedback> 
                                    </div>
                                    <div className="ms-3">
                                      <Button variant="white" className="btn-rounded-circle" onClick={() => {                                              
                                        formik.setFieldValue(`trials.${index}.premierJumpersHeight`, null);
                                      }}>
                                        X
                                      </Button>
                                    </div>
                                  </div>
                                  
                                </>                                  
                              ) : null}
                              </div>                                                        
                          </Card.Body>
                        </Card>                               
                      </div>
                    </div>

                  ) : null
                })}
              </>
            )
          }}
        </FieldArray>                   
        
      ) : (
        <Spinner animation="border" />
      )}        
    </Form>      
    
  ) : (
    <div className="d-flex flex-column align-items-center">
      <Alert variant="danger">Exhibitor not selected.</Alert>      
    </div>
  )
}

export default AddRun