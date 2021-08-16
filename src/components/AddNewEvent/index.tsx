import React, { useContext } from 'react'
import { useFormik } from 'formik'
import { Modal, Form, Button, Input } from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import { ADD_NEW_EVENT, GET_PERSON_EVENTS } from '../../queries/trials/trials'
import { AuthContext } from '../../utils/contexts'

interface InitialValues {
  name: string,  
  locationCity: string,
  locationState: string,
  trialSite?: string,
  hostClub?: string
}

interface OwnProps {
  setAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNewTrial = ({ setAddDialogOpen }: OwnProps) => {
  const userAuth = useContext(AuthContext)
  const [addNewEvent, result] = useMutation(ADD_NEW_EVENT, { 
    update: () => setAddDialogOpen(false),
    refetchQueries: [
      { query: GET_PERSON_EVENTS, variables: { personId: userAuth.userId} }
    ]
  })
  const formik = useFormik({
    initialValues: {
      name: '',      
      locationCity: '',
      locationState: '',
      trialSite: '',
      hostClub: ''
    },
    onSubmit: (values: InitialValues) => {
      addNewEvent({ variables: {
        data: values,
        personId: userAuth.userId
      }})
    },
    validate: (values: InitialValues) => {
      const errors: any = {}
      if (!values.name) {
        errors.name = 'Required'
      }      

      if (!values.locationCity) {
        errors.locationCity = 'Required'
      }

      if (!values.locationState) {
        errors.locationState = 'Required'
      }
      
      return errors
    }

  })
  
  return (
    <>
      <Modal.Content>
        <Form>
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
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => formik.handleSubmit()} loading={result.loading}>Add Event</Button>
      </Modal.Actions>
    </>
  )
}

export default AddNewTrial