import style from './ConfigureEvent.module.scss'
import React, { useState } from 'react'
import { useFormik, FieldArray, Formik } from 'formik'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import { Form, Input, Tab, Dropdown, Checkbox, Button, Icon, Loader, Dimmer, Message } from 'semantic-ui-react'
import { GET_EVENT, UPDATE_EVENT } from '../../queries/trials/trials'

type ClassesOptions = {
  key: string,
  text: string,
  value: string
}

type AccordionIndex = {
  basic: boolean,
  registration: boolean,
  trials: boolean  
}

type ConfigureParams = {
  eventId: string
}

const BasicForm = ({ data, loading } : { data: any, loading: boolean}) => {  
  const { name, locationCity, locationState, trialSite, hostClub } = data.getEvent
  const [showError, setShowError] = useState(false)
  const params = useParams<ConfigureParams>()

  const [updateEvent, result] = useMutation(UPDATE_EVENT, {
    refetchQueries: [
      { query: GET_EVENT, variables: { eventId: params.eventId }}
    ]
  })

  const formik = useFormik({
    initialValues: {
      name,
      locationCity,
      locationState,
      trialSite,
      hostClub
    },
    onSubmit: (values) => {
      const updatedEvent = { ...data.getEvent }
      delete updatedEvent.__typename
      updatedEvent.name = values.name
      updatedEvent.locationCity = values.locationCity
      updatedEvent.locationState = values.locationState
      updatedEvent.trialSite = values.trialSite
      updatedEvent.hostClub = values.hostClub      
      updateEvent({ variables: {
        eventId: params.eventId,
        updatedEvent
      }}).catch(e => {
        setShowError(true)
      })
    },
    validate: (values) => {
      const errors: any = {}
      if (!values.name || values.name.trim() === '') {
        errors.name = 'Required'
      }
      if (!values.locationCity || values.locationCity.trim() === '') {
        errors.locationCity = 'Required'
      }
      if (!values.locationState || values.locationState.trim() === '') {
        errors.locationState = 'Required'
      }
      if (!values.trialSite || values.trialSite.trim() === '') {
        errors.trialSite = 'Required'
      }
      if (!values.hostClub || values.hostClub.trim() === '') {
        errors.hostClub = 'Required'
      }
      return errors
    }
  })
  
  return (
    <Form success={result.called && !!result.data} error={!!result.error}>
      <Form.Field 
        id='name'
        label='Name'
        placeholder='Name' 
        control={Input}
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.errors.name && formik.touched.name ? {
          content: formik.errors.name,
          pointing: 'above'
        } : undefined}         
      />              
      <Form.Group>
        <Form.Field 
          id='locationCity'
          label='City'
          placeholder='City' 
          control={Input}             
          type='text'
          value={formik.values.locationCity}
          onChange={formik.handleChange}
          error={formik.errors.locationCity && formik.touched.locationCity ? {
            content: formik.errors.locationCity,
            pointing: 'above'
          } : undefined}      
        />
        <Form.Field 
          id='locationState'
          label='State'
          placeholder='State' 
          control={Input}             
          type='text'
          value={formik.values.locationState}
          onChange={formik.handleChange}
          error={formik.errors.locationState && formik.touched.locationState ? {
            content: formik.errors.locationState,
            pointing: 'above'
          } : undefined}      
        />          
        <Form.Field 
          id='trialSite'
          label='Trial Site'
          placeholder='Trial Site' 
          control={Input}             
          type='text'
          value={formik.values.trialSite}
          onChange={formik.handleChange}
          error={formik.errors.trialSite && formik.touched.trialSite ? {
            content: formik.errors.trialSite,
            pointing: 'above'
          } : undefined}      
        />          
      </Form.Group>
      <Form.Field 
        id='hostClub'
        label='Host Club'
        placeholder='Host Club' 
        control={Input}             
        type='text'
        value={formik.values.hostClub}
        onChange={formik.handleChange}
        error={formik.errors.hostClub && formik.touched.hostClub ? {
          content: formik.errors.hostClub,
          pointing: 'above'
        } : undefined}      
      />
      <div className={style.buttonContainer}>
        <Button color="black" loading={result.loading} onClick={() => formik.handleSubmit()}>Update</Button>
      </div>
      { result.called && !!result.data ? (
          <Message success header="Updated Completed" content="Event data updated succesfully" />
        ) : null}
      { result.error && showError ? (
        <Message error header="Error" content={result.error.message} />
      ) : null}
    </Form>  
  )
}

const RegistrationForm = ({ data, loading } : { data: any, loading: boolean}) => {
  
  const { registrationEnabled, registrationCutoff, price, altPrice } = data.getEvent
  
  const params = useParams<ConfigureParams>()
  const [showError, setShowError] = useState(false)

  const [updateEvent, result] = useMutation(UPDATE_EVENT, {
    refetchQueries: [
      { query: GET_EVENT, variables: { eventId: params.eventId }}
    ]
  })

  const formik = useFormik({
    initialValues: {
      registrationEnabled,
      registrationCutoff,
      price: (price / 100).toString(),
      altPrice: (altPrice / 100).toString()
    },
    onSubmit: (values) => {
      const updatedEvent = { ...data.getEvent }
      delete updatedEvent.__typename

      updatedEvent.registrationEnabled = values.registrationEnabled
      updatedEvent.registrationCutoff = values.registrationCutoff
      updatedEvent.price = Math.floor(parseFloat(values.price) * 100)
      updatedEvent.altPrice = Math.floor(parseFloat(values.altPrice)* 100)

      updateEvent({ variables: {
        eventId: params.eventId,
        updatedEvent
      }}).catch(() => {
        setShowError(true)
      })
    },
    validate: (values) => {
      const errors: any = {}
      if (!values.price || values.price.trim() === '') {
        errors.price = 'Required'
      }
      if (values.price) {
        const priceInt = parseFloat(values.price)
        if (isNaN(priceInt)) {
          errors.price = 'Must be a valid number'
        }
      }
      if (!values.altPrice || values.altPrice.trim() === '') {
        errors.altPrice = 'Required'
      }
      if (values.altPrice) {
        const altPriceInt = parseFloat(values.altPrice)
        if (isNaN(altPriceInt)) {
          errors.altPrice = 'Must be a valid number'
        }
      }
      return errors
    }
  })
  return (
    <Form success={result.called && !!result.data} error={!!result.error}>
      <Form.Field 
        id='registrationEnabled'
        label='Enable Registration'
        control={Checkbox}
        checked={formik.values.registrationEnabled}
        onChange={formik.handleChange}
        error={formik.errors.registrationEnabled && formik.touched.registrationEnabled ? {
          content: formik.errors.registrationEnabled,
          pointing: 'above'
        } : undefined}      
      />            
      <Form.Field 
        id='registrationCutoff'
        label='Registration Cutoff'
        placeholder='Registration Cutoff'
        control='input'
        type='date'
        value={formik.values.registrationCutoff}
        onChange={formik.handleChange}
        error={formik.errors.registrationCutoff && formik.touched.registrationCutoff ? {
          content: formik.errors.registrationCutoff,
          pointing: 'above'
        } : undefined}     
        />
      <Form.Group>
        <Form.Field 
          id='price'
          label='Price'          
          control={Input}
          type='text'
          value={formik.values.price}
          onChange={formik.handleChange}
          error={formik.errors.price && formik.touched.price ? {
            content: formik.errors.price,
            pointing: 'above'
          } : undefined}     
        />
        <Form.Field 
          id='altPrice'
          label='Discount price'
          placeholder='16.00'
          control={Input}
          type='text'
          value={formik.values.altPrice}
          onChange={formik.handleChange}
          error={formik.errors.altPrice && formik.touched.altPrice ? {
            content: formik.errors.altPrice,
            pointing: 'above'
          } : undefined}    
        />
      </Form.Group>
      <div className={style.buttonContainer}>
        <Button color="black" loading={result.loading} onClick={() => formik.handleSubmit()}>Update</Button>
      </div>
      { result.called && !!result.data ? (
          <Message success header="Updated Completed" content="Event data updated succesfully" />
        ) : null}
      { result.error && showError ? (
        <Message error header="Error" content={result.error.message} />
      ) : null}
    </Form>   
  )
}

const TrialsForm = (data: any, loading: boolean) => {
  const classesOptions: ClassesOptions[] = [
    { key: 'nov', text: 'Novice', value: 'nov' },
    { key: 'open', text: 'Open', value: 'open' },
    { key: 'exc', text: 'Excellent', value: 'exc'},
    { key: 'mast', text: 'Masters', value: 'mast' }    
  ]
  // const formik = useFormik({
  //   initialValues: {
  //     newTrials: []
  //   },
  //   onSubmit: (values) => {
  //     console.log(values)
  //   }
  // })

  return (
    <Formik 
      initialValues={{
        newTrials: []
      }}
      onSubmit={(values) => console.log(values)}
      render={formikProps => {
        console.log(formikProps.values)
        return (
          <FieldArray 
            name='newTrials'
            render={({ push }) => (
              <Form onSubmit={() => formikProps.submitForm()}>
                <div className={style.newTrialContainer}>
                  <div style={{ marginRight: '8px' }}><Button circular icon="add" onClick={() => {
                    push({
                      akcTrialNumber: '',
                      trialDate: '',
                      onlineEntries: 0,
                      mailEntries: 0,
                      standardClass: true,
                      jumpersClass: true,
                      fastClass: false,
                      t2bClass: false,
                      standardAbility: ['nov', 'open', 'exc', 'mast'],
                      standardPreferred: ['nov', 'open', 'exc', 'mast'],
                      jumpersAbility: ['nov', 'open', 'exc', 'mast'],
                      jumpersPreferred: ['nov', 'open', 'exc', 'mast'],
                      fastAbility: [],
                      fastPreferred: []
                      
                    })
                  }}/></div>
                  {formikProps.values.newTrials.length === 0 ? (
                    <div>Event has no trials. Add a new trial to the even to proceed</div>        
                  ) : null}
                </div>
                <div className={style.fieldsContainer}>
                    {formikProps.values.newTrials.length > 0 ? (
                    formikProps.values.newTrials.map((trial: any, idx: number) => (
                      <>
                        <Form.Group>
                          <Form.Field 
                            id='akcTrialNumber'
                            name={`newTrials.${idx}.akcTrialNumber`}
                            value={(formikProps.values.newTrials as any)[idx].akcTrialNumber}
                            onChange={formikProps.handleChange}
                            type='text'
                            label="AKC Trial Number"
                            control={Input}
                          />
                          <Form.Field 
                            id='trialDate'
                            name={`newTrials.${idx}.trialDate`}
                            value={(formikProps.values.newTrials as any)[idx].trialDate}
                            onChange={formikProps.handleChange}
                            label='Date'                
                            control='input'
                            type='date'
                          />
                          <Form.Field 
                            id='onlineEntries'
                            name={`newTrials.${idx}.onlineEntries`}
                            value={(formikProps.values.newTrials as any)[idx].onlineEntries}
                            onChange={formikProps.handleChange}
                            type='number'
                            control={Input}
                            label='Online Entries'
                          />
                          <Form.Field 
                            id='mailEntries'
                            name={`newTrials.${idx}.mailEntries`}
                            value={(formikProps.values.newTrials as any)[idx].mailEntries}
                            onChange={formikProps.handleChange}
                            type='number'
                            control={Input}
                            label='Mail-in Entries'
                          />       
                        </Form.Group>                                          
                        <h5>Classes: </h5>
                        <div className={style.checkboxContainer}>
                          <Form.Field
                            id='standardClass'
                            name={`newTrials.${idx}.standardClass`}
                            value={(formikProps.values.newTrials as any)[idx].standardClass}
                            checked={(formikProps.values.newTrials as any)[idx].standardClass}
                            onChange={formikProps.handleChange}
                            label='Standard'                                                                              
                            control={Checkbox}
                            style={{marginRight: '8px'}}                        
                          />
                          { (formikProps.values.newTrials as any)[idx].standardClass ? (
                            <div style={{display: 'flex'}}>
                            <Form.Field 
                              id='standardAbility'
                              name={`newTrials.${idx}.standardAbility`}
                              value={(formikProps.values.newTrials as any)[idx].standardAbility}
                              onChange={(e: any, d: any) => {                                                                
                                formikProps.setFieldValue(`newTrials.${idx}.standardAbility`, [].slice.call(d.value))
                              }}
                              label='Regular'
                              multiple
                              selection
                              control={Dropdown}
                              options={classesOptions}
                              
                            />
                            <Form.Field 
                              id='standardPreferred'
                              name={`newTrials.${idx}.standardPreferred`}
                              value={(formikProps.values.newTrials as any)[idx].standardPreferred}
                              onChange={(e: any, d: any) => {                                                                
                                formikProps.setFieldValue(`newTrials.${idx}.standardPreferred`, [].slice.call(d.value))
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
                            name={`newTrials.${idx}.jumpersClass`}
                            value={(formikProps.values.newTrials as any)[idx].jumpersClass}
                            checked={(formikProps.values.newTrials as any)[idx].jumpersClass}
                            onChange={formikProps.handleChange}
                            label='JWW'                                                                              
                            control={Checkbox}
                            style={{marginRight: '8px'}}                          
                          />
                          { (formikProps.values.newTrials as any)[idx].jumpersClass ? (
                            <div style={{display: 'flex'}}>
                            <Form.Field 
                              id='jumpersAbility'
                              name={`newTrials.${idx}.jumpersAbility`}
                              value={(formikProps.values.newTrials as any)[idx].jumpersAbility}
                              onChange={(e: any, d: any) => {                                                                
                                formikProps.setFieldValue(`newTrials.${idx}.jumpersAbility`, [].slice.call(d.value))
                              }}
                              label='Regular'
                              multiple
                              selection
                              control={Dropdown}
                              options={classesOptions}
                              
                            />
                            <Form.Field 
                              id='jumpersPreferred'
                              name={`newTrials.${idx}.jumpersPreferred`}
                              value={(formikProps.values.newTrials as any)[idx].jumpersPreferred}
                              onChange={(e: any, d: any) => {                                                                
                                formikProps.setFieldValue(`newTrials.${idx}.jumpersPreferred`, [].slice.call(d.value))
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
                              name={`newTrials.${idx}.fastClass`}
                              value={(formikProps.values.newTrials as any)[idx].fastClass}
                              checked={(formikProps.values.newTrials as any)[idx].fastClass}
                              onChange={formikProps.handleChange}
                              label='FAST'                                                                              
                              control={Checkbox}                          
                          />
                          { (formikProps.values.newTrials as any)[idx].fastClass ? (
                            <div style={{display: 'flex'}}>
                            <Form.Field 
                              id='fastAbility'
                              name={`newTrials.${idx}.fastAbility`}
                              value={(formikProps.values.newTrials as any)[idx].fastAbility}
                              onChange={(e: any, d: any) => {                                                                
                                formikProps.setFieldValue(`newTrials.${idx}.fastAbility`, [].slice.call(d.value))
                              }}
                              label='Regular'
                              multiple
                              selection
                              control={Dropdown}
                              options={classesOptions}
                              
                            />
                            <Form.Field 
                              id='fastPreferred'
                              name={`newTrials.${idx}.fastPreferred`}
                              value={(formikProps.values.newTrials as any)[idx].fastPreferred}
                              onChange={(e: any, d: any) => {                                                                
                                formikProps.setFieldValue(`newTrials.${idx}.fastPreferred`, [].slice.call(d.value))
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
                            name={`newTrials.${idx}.t2bClass`}
                            value={(formikProps.values.newTrials as any)[idx].t2bClass}
                            checked={(formikProps.values.newTrials as any)[idx].t2bClass}
                            onChange={formikProps.handleChange}
                            label='T2B'                                                                              
                            control={Checkbox}                          
                          />
                          <Form.Field 
                            id='premierStandard'
                            name={`newTrials.${idx}.premierStandard`}
                            value={(formikProps.values.newTrials as any)[idx].premierStandard}
                            checked={(formikProps.values.newTrials as any)[idx].premierStandard}
                            onChange={formikProps.handleChange}
                            label='Premier Standard'
                            control={Checkbox}
                          />
                          <Form.Field 
                            id='premierJumpers'
                            name={`newTrials.${idx}.premierJumpers`}
                            value={(formikProps.values.newTrials as any)[idx].premierJumpers}
                            checked={(formikProps.values.newTrials as any)[idx].premierJumpers}
                            onChange={formikProps.handleChange}
                            label='Premier Jumpers'
                            control={Checkbox}
                          />
                        <br />                      
                      </>
                    ))
                  ) : null}
                </div>
                <Button content="Submit" type="submit" />                
              </Form>
            )}
          />
        )
      }}
    />    
  )
}

const ConfigureEvent = () => {
  const params = useParams<ConfigureParams>()  
  const { data, loading, error } = useQuery(GET_EVENT, { variables: { eventId: params.eventId }})
  const accordionIndex: AccordionIndex = {
    basic: true,
    registration: false,
    trials: false
  }
  const [selectedAccordion, setSelectedAccordion] = useState<AccordionIndex>(accordionIndex)  
  const panes = [
    { menuItem: 'Basic', render: () => <Tab.Pane><BasicForm data={data} loading={loading}/></Tab.Pane> },
    { menuItem: 'Registration', render: () => <Tab.Pane><RegistrationForm data={data} loading={loading}/></Tab.Pane> },
    { menuItem: 'Trials', render: () => <Tab.Pane><TrialsForm data={data} loading={loading}/></Tab.Pane>}
  ]

  return !loading && !error ? (
    <div className={style.configureTrialContainer}>
       <Tab panes={panes}/>
    </div>
  ) : !error ? (
    <Dimmer active>
        <Loader>Loading</Loader>
      </Dimmer>
  ) : <div>Error</div>
}

export default ConfigureEvent