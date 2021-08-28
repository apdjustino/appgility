import style from './AddTrial.module.scss'

import React, { useState } from 'react'
import { QueryResult, useMutation, useQuery } from '@apollo/client'
import * as Yup from 'yup'
import { Button, Checkbox, Dimmer, Dropdown, Form, Input, Loader, Message } from 'semantic-ui-react'
import { useFormik } from 'formik'
import { ADD_TRIAL, GET_EVENT_TRIAL, GET_TRIALS, UPDATE_TRIAL } from '../../queries/trials/trials'
import { useParams } from 'react-router-dom'

type ClassesOptions = {
  key: string,
  text: string,
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
    { key: 'nov', text: 'Novice', value: 'nov' },
    { key: 'open', text: 'Open', value: 'open' },
    { key: 'exc', text: 'Excellent', value: 'exc'},
    { key: 'mast', text: 'Masters', value: 'mast' }    
  ]

  const validationSchema = Yup.object().shape({
    newTrials: Yup.array().of(
      Yup.object().shape({
        trialDate: Yup.string().required('Required'),
        onlineEntries: Yup.number().min(0, 'Minimium is 0 entries').required('Required'),
        mailEntries: Yup.number().min(0, 'Minimium is 0 entries').required('Required')
      })
    )
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
        delete trialToUpdate.__typename
  
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
      addTrial({ variables: { eventTrial: addNewTrial }}).catch(() => {
        setShowError(true)
      })
    },
    enableReinitialize: true
  })

  return trialQuery.loading ? (
    <div style={{height: '100vh'}}>
      <Dimmer active>
        <Loader>Loading</Loader>
      </Dimmer>
    </div>   
  ) : (
    <Form 
      onSubmit={() => formik.handleSubmit()}
      success={(result.called && !!result.data) || (updateResult.called && !!updateResult.data)}
      error={!!result.error || !!updateResult.error}
    >
      { (result.called && !!result.data) || (updateResult.called && !!updateResult.data) ? (
          <Message success header="Updated Completed" content="Event data updated succesfully" />
        ) : null}
      { (result.error && showError) ? (
        <Message error header="Error" content={result.error.message} />
      ) : (updateResult.error && showError) ? (
        <Message error header="Error" content={updateResult.error.message} />
      ) : null}
      <div className={style.fieldsContainer}>
        
          <>
            <Form.Group>
              <Form.Field 
                id='akcTrialNumber'
                name='akcTrialNumber'
                value={formik.values.akcTrialNumber}
                onChange={formik.handleChange}
                type='text'
                label="AKC Trial Number"
                control={Input}
              />
              <Form.Field 
                id='trialDate'
                name='trialDate'
                value={formik.values.trialDate}
                onChange={formik.handleChange}
                label='Date'                
                control='input'
                type='date'
                error={formik.errors.trialDate ? {
                  content: formik.errors.trialDate,
                  pointing: 'above'
                } : undefined}
              />
              <Form.Field 
                id='onlineEntries'
                name='onlineEntries'
                value={formik.values.onlineEntries}
                onChange={formik.handleChange}
                type='number'
                control={Input}
                label='Online Entries'
                error={formik.errors.onlineEntries ? {
                  content: formik.errors.onlineEntries,
                  pointing: 'above'
                } : undefined}
              />
              <Form.Field 
                id='mailEntries'
                name='mailEntries'
                value={formik.values.mailEntries}
                onChange={formik.handleChange}
                type='number'
                control={Input}
                label='Mail-in Entries'
                error={formik.errors.mailEntries ? {
                  content: formik.errors.mailEntries,
                  pointing: 'above'
                } : undefined}
              />       
            </Form.Group>                                          
            <h5>Classes: </h5>
            <div className={style.checkboxContainer}>
              <Form.Field
                id='standardClass'
                name='standardClass'
                value={formik.values.standardClass}
                checked={formik.values.standardClass}
                onChange={formik.handleChange}
                label='Standard'                                                                              
                control={Checkbox}
                style={{marginRight: '8px'}}                        
              />
              { formik.values.standardClass ? (
                <div style={{display: 'flex'}}>
                <Form.Field 
                  id='standardAbility'
                  name='standardAbility'
                  value={formik.values.standardAbility}
                  onChange={(e: any, d: any) => {                                                                
                    formik.setFieldValue(`standardAbility`, [].slice.call(d.value))
                  }}
                  label='Regular'
                  multiple
                  selection
                  control={Dropdown}
                  options={classesOptions}
                  
                />
                <Form.Field 
                  id='standardPreferred'
                  name='standardPreferred'
                  value={formik.values.standardPreferred}
                  onChange={(e: any, d: any) => {                                                                
                    formik.setFieldValue(`standardPreferred`, [].slice.call(d.value))
                  }}
                  label='Preferred'
                  multiple
                  selection
                  control={Dropdown}
                  options={classesOptions}
                />
                </div>
              ): null}
            </div>
            <div className={style.checkboxContainer}>
              <Form.Field
                id='jumpersClass'
                name='jumpersClass'
                value={formik.values.jumpersClass}
                checked={formik.values.jumpersClass}
                onChange={formik.handleChange}
                label='JWW'                                                                              
                control={Checkbox}
                style={{marginRight: '8px'}}                          
              />
              { formik.values.jumpersClass ? (
                <div style={{display: 'flex'}}>
                  <Form.Field 
                    id='jumpersAbility'
                    name='jumpersAbility'
                    value={formik.values.jumpersAbility}
                    onChange={(e: any, d: any) => {                                                                
                      formik.setFieldValue(`jumpersAbility`, [].slice.call(d.value))
                    }}
                    label='Regular'
                    multiple
                    selection
                    control={Dropdown}
                    options={classesOptions}
                    
                  />
                  <Form.Field 
                    id='jumpersPreferred'
                    name='jumpersPreferred'
                    value={formik.values.jumpersPreferred}
                    onChange={(e: any, d: any) => {                                                                
                      formik.setFieldValue(`jumpersPreferred`, [].slice.call(d.value))
                    }}
                    label='Preferred'
                    multiple
                    selection
                    control={Dropdown}
                    options={classesOptions}
                  />
                </div>
              ): null}
            </div>
            <div className={style.checkboxContainer}>
              <Form.Field
                  id='fastClass'
                  name='fastClass'
                  value={formik.values.fastClass}
                  checked={formik.values.fastClass}
                  onChange={formik.handleChange}
                  label='FAST'                                                                              
                  control={Checkbox}                          
              />
              { formik.values.fastClass ? (
                <div style={{display: 'flex'}}>
                <Form.Field 
                  id='fastAbility'
                  name={`fastAbility`}
                  value={formik.values.fastAbility}
                  onChange={(e: any, d: any) => {                                                                
                    formik.setFieldValue(`fastAbility`, [].slice.call(d.value))
                  }}
                  label='Regular'
                  multiple
                  selection
                  control={Dropdown}
                  options={classesOptions}
                  
                />
                <Form.Field 
                  id='fastPreferred'
                  name='fastPreferred'
                  value={formik.values.fastPreferred}
                  onChange={(e: any, d: any) => {                                                                
                    formik.setFieldValue(`fastPreferred`, [].slice.call(d.value))
                  }}
                  label='Preferred'
                  multiple
                  selection
                  control={Dropdown}
                  options={classesOptions}
                />
                </div>
              ): null}
            </div>
              <Form.Field
                id='t2bClass'
                name='t2bClass'
                value={formik.values.t2bClass}
                checked={formik.values.t2bClass}
                onChange={formik.handleChange}
                label='T2B'                                                                              
                control={Checkbox}                          
              />
              <Form.Field 
                id='premierStandard'
                name='premierStandard'
                value={formik.values.premierStandard}
                checked={formik.values.premierStandard}
                onChange={formik.handleChange}
                label='Premier Standard'
                control={Checkbox}
              />
              <Form.Field 
                id='premierJumpers'
                name='premierJumpers'
                value={formik.values.premierJumpers}
                checked={formik.values.premierJumpers}
                onChange={formik.handleChange}
                label='Premier Jumpers'
                control={Checkbox}
              />
            <br />                      
          </>
    </div>
      <Button content="Submit" type="submit" loading={result.loading || updateResult.loading}/>                
    </Form>
  )

  
}

export default AddTrial