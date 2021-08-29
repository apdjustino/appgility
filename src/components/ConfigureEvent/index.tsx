import style from './ConfigureEvent.module.scss'
import * as Yup from 'yup'
import React, { useContext, useState } from 'react'
import { useFormik } from 'formik'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import { Form, Input, Tab, Button, Loader, Dimmer, Message, Modal } from 'semantic-ui-react'
import { GET_EVENT, GET_PERSON_EVENTS, GET_TRIALS, UPDATE_EVENT } from '../../queries/trials/trials'
import TrialCards from '../TrialCards'
import AddTrial from '../AddTrial'
import { AuthContext } from '../../utils/contexts'

type AccordionIndex = {
  basic: boolean,
  registration: boolean,
  trials: boolean  
}

type ConfigureParams = {
  eventId: string
}

const BasicForm = ({ data, loading } : { data: any, loading: boolean}) => {  
  const { 
    name,
    locationCity, 
    locationState, 
    trialSite, 
    hostClub,
    trialChairName,
    trialChairEmail,
    trialChairPhone
   } = data.getEvent
  const [showError, setShowError] = useState(false)
  const params = useParams<ConfigureParams>()
  const userAuth = useContext(AuthContext)
  const [updateEvent, result] = useMutation(UPDATE_EVENT, {
    refetchQueries: [
      { query: GET_EVENT, variables: { eventId: params.eventId }},
      { query: GET_PERSON_EVENTS, variables: { personId: userAuth.userId }}
    ]
  })

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    locationCity: Yup.string().required('Required'),
    locationState: Yup.string().required('Required'),
    trialSite: Yup.string().required('Required'),
    hostClub: Yup.string().required('Required'),
  })

  const formik = useFormik({
    initialValues: {
      name,
      locationCity,
      locationState,
      trialSite,
      hostClub,
      trialChairName,
      trialChairEmail,
      trialChairPhone
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
        personId:  userAuth.userId,
        updatedEvent
      }}).catch(e => {
        setShowError(true)
      })
    },
    validationSchema
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
      <Form.Field 
        id='trialChairName'
        label=''
        placeholder='Trial Chair' 
        control={Input}             
        type='text'
        value={formik.values.trialChairName}
        onChange={formik.handleChange}
        error={formik.errors.trialChairName && formik.touched.trialChairName ? {
          content: formik.errors.trialChairName,
          pointing: 'above'
        } : undefined}      
      />
      <Form.Field 
        id='trialChairEmail'
        label='Trial Chair Email'
        placeholder='' 
        control={Input}             
        type='text'
        value={formik.values.trialChairEmail}
        onChange={formik.handleChange}
        error={formik.errors.trialChairEmail && formik.touched.trialChairEmail ? {
          content: formik.errors.trialChairEmail,
          pointing: 'above'
        } : undefined}      
      />
      <Form.Field 
        id='trialChairPhone'
        label='Trial Chair Phone'
        placeholder='' 
        control={Input}             
        type='text'
        value={formik.values.trialChairPhone}
        onChange={formik.handleChange}
        error={formik.errors.trialChairPhone && formik.touched.trialChairPhone ? {
          content: formik.errors.trialChairPhone,
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
  
  const { price, altPrice, openingDate, closingDate } = data.getEvent
  
  const params = useParams<ConfigureParams>()
  const [showError, setShowError] = useState(false)
  const userAuth = useContext(AuthContext)

  const [updateEvent, result] = useMutation(UPDATE_EVENT, {
    refetchQueries: [
      { query: GET_EVENT, variables: { eventId: params.eventId }},
      { query: GET_PERSON_EVENTS, variables: { personId: userAuth.userId }}
    ]
  })

  const validationSchema = Yup.object().shape({
    openingDate: Yup.string().required('Required'),
    closingDate: Yup.string().required('Required'),
    price: Yup.number().min(0, 'Minimum price is 0').required('Required'),
    altPrice: Yup.number().min(0, 'Minimum price is 0').required('Required')
  })

  const formik = useFormik({
    initialValues: {
      openingDate,
      closingDate,
      price: (price / 100).toString(),
      altPrice: (altPrice / 100).toString()
    },
    onSubmit: (values) => {
      const updatedEvent = { ...data.getEvent }
      delete updatedEvent.__typename

      updatedEvent.openingDate = values.openingDate
      updatedEvent.closingDate = values.closingDate
      updatedEvent.price = Math.floor(parseFloat(values.price) * 100)
      updatedEvent.altPrice = Math.floor(parseFloat(values.altPrice)* 100)

      updateEvent({ variables: {
        eventId: params.eventId,
        personId: userAuth.userId,
        updatedEvent
      }}).catch(() => {
        setShowError(true)
      })
    },
    validationSchema
  })
  return (
    <Form success={result.called && !!result.data} error={!!result.error}>
      <Form.Field 
        id='openingDate'
        label='Opening Date'
        control='input'
        type='date'
        checked={formik.values.openingDate}
        onChange={formik.handleChange}
        error={formik.errors.openingDate && formik.touched.openingDate ? {
          content: formik.errors.openingDate,
          pointing: 'above'
        } : undefined}      
      />            
      <Form.Field 
        id='closingDate'
        label='Closing Date'
        placeholder='Closing Date'
        control='input'
        type='date'
        value={formik.values.closingDate}
        onChange={formik.handleChange}
        error={formik.errors.closingDate && formik.touched.closingDate ? {
          content: formik.errors.closingDate,
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
  const trialQuery = useQuery(GET_TRIALS, { variables : {eventId: params.eventId}})
  const [addTrialModal, setAddTrialModal] = useState(false)
  const [selectedTrial, setSelectedTrial] = useState('')  
  return (
    <>
      <Button color="black" style={{float: 'right'}} onClick={() => {
        setSelectedTrial('')
        setAddTrialModal(true)
      }}>Add Trial
      </Button>
        { trialQuery.data && trialQuery.data.getEventTrials.length > 0 ? (
          <TrialCards query={trialQuery} setTrial={(trial: string) => {        
            setSelectedTrial(trial)
            setAddTrialModal(true)
          }}/>
        ) : <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>No Trials</div>}        
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