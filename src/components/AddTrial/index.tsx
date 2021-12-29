import React, { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import * as Yup from 'yup'
import { Spinner, Form, Alert, Button } from "react-bootstrap";
import { useFormik } from 'formik'
import { ADD_TRIAL, GET_EVENT_TRIAL, GET_TRIALS, UPDATE_TRIAL } from '../../queries/trials/trials'
import { useParams } from 'react-router-dom'
import Select from "react-select";
import { parseInputDate } from "../../utils/dates";

type ClassesOptions = {
  label: string,
  value: string
}

type ownProps = {
  trialId: string
}

type ConfigureParams = {
  eventId: string
}

const AddTrial = ({ trialId } : ownProps) => {
  const classesOptions: ClassesOptions[] = [
    { label: 'Novice', value: 'nov' },
    { label: 'Open', value: 'open' },
    { label: 'Excellent', value: 'exc'},
    { label: 'Masters', value: 'mast' }    
  ]

  const validationSchema = Yup.object().shape({
    akcTrialNumber: Yup.string().required('Required'),
    trialDate: Yup.string().required('Required'),
    mailEntries: Yup.number().min(1, 'Minimium is 1 entries').required('Required'),
    onlineEntries: Yup.number().min(1, 'Minimium is 1 entries').required('Required'),
    runLimit: Yup.number().min(1, 'At least one run is required').required('Required'),
    standardClass: Yup.boolean(),
    standardAbility: Yup.array().when('standardClass', { is: true, then: Yup.array().required('At least one ability is required'), otherwise: Yup.array()}),
    standardPreferred:  Yup.array().when('standardClass', { is: true, then: Yup.array().required('At least one ability is required'), otherwise: Yup.array()}),
    jumpersClass: Yup.boolean(),
    jumpersAbility: Yup.array().when('jumpersClass', { is: true, then: Yup.array().required('At least one ability is required'), otherwise: Yup.array()}),
    jumpersPreferred: Yup.array().when('jumpersClass', { is: true, then: Yup.array().required('At least one ability is required'), otherwise: Yup.array()}),
    fastClass: Yup.boolean(),
    fastAbility: Yup.array().when('fastClass', { is: true, then: Yup.array().required('At least one ability is required'), otherwise: Yup.array()}),
    fastPreferred: Yup.array().when('fastClass', { is: true, then: Yup.array().required('At least one ability is required'), otherwise: Yup.array()}),
    t2bClass: Yup.boolean(),
    premierStandard: Yup.boolean(),
    premierJumpers: Yup.boolean()    
  })

  const params = useParams<ConfigureParams>()
  const [showError, setShowError] = useState(false)

  const trialQuery = useQuery(GET_EVENT_TRIAL, { variables: { trialId: trialId, eventId: params.eventId} })
  
  const [addTrial, result] = useMutation(ADD_TRIAL, {
    refetchQueries: [
      { query: GET_TRIALS, variables: { eventId: params.eventId }}
    ]
  })

  const [updateTrial, updateResult] = useMutation(UPDATE_TRIAL, {
    refetchQueries: [
      { query: GET_TRIALS, variables: { eventId: params.eventId }}
    ]
  })

  
  const formik = useFormik({
    initialValues: !trialQuery.data ? {} : trialQuery.data.getEventTrial,
    onSubmit: (values) => {        
      if (trialId && trialId !== '') {
        const trialToUpdate = { ...trialQuery.data.getEventTrial }        
  
        Object.keys(trialToUpdate).forEach(key => {
          trialToUpdate[key] = (values as any)[key] 
        })
                
        updateTrial({ variables: {
          trialId,
          eventId: params.eventId,
          eventTrial: trialToUpdate
        }}).catch(() => {
          setShowError(true)
        })
        return
      }

      const addNewTrial = { ...values }      
      addNewTrial.eventId = params.eventId
      
      const newTrialDate = parseInputDate(addNewTrial.trialDate);      
      addNewTrial.trialDate = newTrialDate
      
      addTrial({ variables: { eventTrial: addNewTrial }}).catch(() => {
        setShowError(true)
      })
    },
    enableReinitialize: true,
    validationSchema    
  })  
  
  return trialQuery.loading ? (
    <div className="h-100">
      <Spinner animation="border" />
    </div>   
  ) : (
    <>
    <Form 
      onSubmit={() => formik.handleSubmit()}
    >
      { (result.called && !!result.data) || (updateResult.called && !!updateResult.data) ? (
          <Alert variant="success">Event data updated succesfully</Alert>
        ) : null}
      { (result.error && showError) ? (
        <Alert variant="danger">{result.error.message}</Alert>
      ) : (updateResult.error && showError) ? (
        <Alert variant="danger">{updateResult.error.message}</Alert>
      ) : null}
      <div>
        
          <>
            <div className="row pb-2">
              <div className="col-6">
                <div className="form-group">
                  <Form.Label>AKC Trial Number</Form.Label>
                  <Form.Control 
                    id='akcTrialNumber'
                    name='akcTrialNumber'
                    value={formik.values.akcTrialNumber}
                    onChange={formik.handleChange}
                    type='text'
                    isInvalid={!!formik.errors.akcTrialNumber}                  
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.akcTrialNumber}</Form.Control.Feedback>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <Form.Label>Date</Form.Label>
                  <Form.Control 
                    id='trialDate'
                    name='trialDate'
                    value={formik.values.trialDate}
                    onChange={formik.handleChange}                  
                    type='date'
                    isInvalid={!!formik.errors.trialDate}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.trialDate}</Form.Control.Feedback>
                </div>
              </div>
            </div>
            <div className="row pb-2">
              <div className="col-6">
                <div className="form-group">
                  <Form.Label>Online Entries</Form.Label>
                  <Form.Control 
                    id='onlineEntries'
                    name='onlineEntries'
                    value={formik.values.onlineEntries}
                    onChange={formik.handleChange}
                    type='number'                  
                    isInvalid={!!formik.errors.onlineEntries}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.onlineEntries}</Form.Control.Feedback>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <Form.Label>Mail-in Entries</Form.Label>
                  <Form.Control 
                    id='mailEntries'
                    name='mailEntries'
                    value={formik.values.mailEntries}
                    type="number"
                    onChange={formik.handleChange}                  
                    isInvalid={!!formik.errors.mailEntries}
                  />
                  <Form.Control.Feedback type="invalid">{formik.errors.mailEntries}</Form.Control.Feedback>
                </div>
              </div>
            </div>
                                 
            
            <div className="form-group">
              <Form.Label>Run Limit</Form.Label>
              <Form.Control 
                id='runLimit'
                name='runLimit'
                value={formik.values.runLimit}
                onChange={formik.handleChange}
                type='number'                
                isInvalid={!!formik.errors.runLimit}
              />       
              <Form.Control.Feedback type="invalid">{formik.errors.runLimit}</Form.Control.Feedback>
            </div>                                          
            <h5>Classes: </h5>
            <div className="row">
              <div className="col-3">
                <Form.Check
                  id='standardClass'
                  name='standardClass'
                  value={formik.values.standardClass}
                  checked={formik.values.standardClass}
                  onChange={formik.handleChange}                
                  type="checkbox"
                  label="Standard"
                  style={{marginRight: '8px'}}
                  isInvalid={!!formik.errors.standardClass}                      
                />
                <Form.Control.Feedback type="invalid">{formik.errors.standardClass}</Form.Control.Feedback>
              </div>
              <div className="col-9">
                { formik.values.standardClass ? (
                  <div>
                    <Form.Label>Regular</Form.Label>
                    <Select 
                      id='standardAbility'
                      name='standardAbility'
                      value={formik.values.standardAbility}
                      onChange={(newValue: any, actionMeta: any) => {                            
                        formik.setFieldValue(`standardAbility`, newValue)
                        formik.setFieldValue(`standardPreferred`, newValue)
                      }}
                      isMulti                      
                      options={classesOptions}
                    /> 
                    {!!formik.errors.standardAbility ? (
                      <Alert variant="danger" id="error-standard-ability">{formik.errors.standardAbility}</Alert>
                    ): null}                                    
                                        
                  </div>
                ): null}              
              </div>                                        
            </div>
            <div className="row">
              <div className="col-3">
                <Form.Check
                  id='jumpersClass'
                  name='jumpersClass'
                  value={formik.values.jumpersClass}
                  checked={formik.values.jumpersClass}
                  onChange={formik.handleChange}
                  type="checkbox"
                  label="JWW"
                  style={{marginRight: '8px'}}
                  isInvalid={!!formik.errors.jumpersClass}                    
                />
                <Form.Control.Feedback type="invalid">{formik.errors.jumpersClass}</Form.Control.Feedback>
              </div>
              <div className="col-9">
                { formik.values.jumpersClass ? (
                  <div>
                    <Form.Label>Regular</Form.Label>
                    <Select 
                      id='jumpersAbility'
                      name='jumpersAbility'
                      value={formik.values.jumpersAbility}
                      onChange={(newValue: any, actionMeta: any) => {                                                                
                        formik.setFieldValue(`jumpersAbility`, newValue)
                        formik.setFieldValue(`jumpersPreferred`, newValue);
                      }}
                      isMulti                      
                      options={classesOptions}
                    />                      
                    {!!formik.errors.jumpersAbility ? (
                      <Alert variant="danger" id="error-standard-ability">{formik.errors.jumpersAbility}</Alert>
                    ): null}                                           
                  </div>
                ): null}
              </div>                                       
            </div>
            <div className="row">
              <div className="col-3">
                <Form.Check
                  id='fastClass'
                  name='fastClass'
                  value={formik.values.fastClass}
                  checked={formik.values.fastClass}
                  onChange={formik.handleChange}
                  label="FAST"
                  type="checkbox"
                  isInvalid={!!formik.errors.fastClass}                    
                />
                <Form.Control.Feedback type="invalid">{formik.errors.fastClass}</Form.Control.Feedback>
              </div>
              <div className="col-9">
                { formik.values.fastClass ? (
                  <div>
                    <Form.Label>Regular</Form.Label>
                    <Select 
                      id='fastAbility'
                      name='fastAbility'
                      value={formik.values.fastAbility}
                      onChange={(newValue: any, actionMeta: any) => {                                                                
                        formik.setFieldValue(`fastAbility`, newValue)
                        formik.setFieldValue(`fastPreferred`, newValue);
                      }}
                      isMulti
                      options={classesOptions}                      
                    />                      
                    {!!formik.errors.fastAbility ? (
                      <Alert variant="danger" id="error-standard-ability">{formik.errors.fastAbility}</Alert>
                    ): null}                    
                  </div>
                ): null}
              </div>              
            </div>              
              <Form.Check
                id='t2bClass'
                name='t2bClass'
                value={formik.values.t2bClass}
                checked={formik.values.t2bClass}
                onChange={formik.handleChange}
                label="T2B"
                type="checkbox"                               
                isInvalid={!!formik.errors.t2bClass}                      
              />
              <Form.Control.Feedback type="invalid">{formik.errors.t2bClass}</Form.Control.Feedback>              
              <Form.Check 
                id='premierStandard'
                name='premierStandard'
                value={formik.values.premierStandard}
                checked={formik.values.premierStandard}
                onChange={formik.handleChange}
                label="Premier Standard"
                type="checkbox"                
                isInvalid={!!formik.errors.premierStandard}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.premierStandard}</Form.Control.Feedback>              
              <Form.Check 
                id='premierJumpers'
                name='premierJumpers'
                value={formik.values.premierJumpers}
                checked={formik.values.premierJumpers}
                onChange={formik.handleChange}
                label='Premier Jumpers'                
                isInvalid={!!formik.errors.premierJumpers}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.premierJumpers}</Form.Control.Feedback>              
            <br />                      
          </>
    </div>
                  
    </Form>
    <Button type="button" onClick={(e) => {
      e.preventDefault();      
      formik.submitForm();
    }}>
        {result.loading || updateResult.loading ? (
          <Spinner animation="border" />
        ): "Submit"}        
      </Button>    
    </>
  )

  
}

export default AddTrial