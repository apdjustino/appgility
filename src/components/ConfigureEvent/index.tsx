import style from './ConfigureEvent.module.scss'
import * as Yup from 'yup'
import React, { useState } from 'react'
import { useFormik, FieldArray, Formik } from 'formik'
import { useHistory, useParams, useRouteMatch } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import { Form, Input, Tab, Dropdown, Checkbox, Button, Icon, Loader, Dimmer, Message, Modal } from 'semantic-ui-react'
import { ADD_TRIAL, GET_EVENT, GET_TRIALS, UPDATE_EVENT, UPDATE_TRIAL } from '../../queries/trials/trials'
import TrialCards from '../TrialCards'
import AddTrial from '../AddTrial'

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
    
  const params = useParams<ConfigureParams>()  
  const { path } = useRouteMatch()
  const trialQuery = useQuery(GET_TRIALS, { variables : {eventId: params.eventId}})
  const [addTrialModal, setAddTrialModal] = useState(false)
  const [selectedTrial, setSelectedTrial] = useState('')
  return (
    <>
      <Button color="black" style={{float: 'right'}} onClick={() => {
        setSelectedTrial('')
        setAddTrialModal(true)
      }}>Add Trial</Button>
      <TrialCards query={trialQuery} setTrial={(trial: string) => {        
        setSelectedTrial(trial)
        setAddTrialModal(true)
      }}/>
      <Modal 
        open={addTrialModal}
        onClose={() => setAddTrialModal(false)}
      >
        <Modal.Header>{selectedTrial === '' ? 'Add Trial' : 'Edit Trial'}</Modal.Header>
        <Modal.Content>
          <AddTrial trialId={selectedTrial}/>
        </Modal.Content>
      </Modal>  
    </>      
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
    { menuItem: 'Trials', render: () => <Tab.Pane style={{height: '100%'}}><TrialsForm data={data} loading={loading}/></Tab.Pane>}
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