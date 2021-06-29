import React from 'react'
import { useFormik } from 'formik'
import { Modal, Form, Button, Input } from 'semantic-ui-react'
import moment from 'moment'

interface InitialValues {
  name: string,
  startDate: Date | undefined,
  locationCity: string,
  locationState: string,
  locationVenue?: string,
  hostClub?: string
}

const AddNewTrial = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      startDate: undefined,
      locationCity: '',
      locationState: '',
      locationVenue: '',
      hostClub: ''
    },
    onSubmit: (values: InitialValues) => {
      console.log(values)
    },
    validate: (values: InitialValues) => {
      const errors: any = {}
      if (!values.name) {
        errors.name = 'Required'
      }

      if (!values.startDate) {
        errors.startDate = 'Required'
      }

      if (values.startDate) {
        const start = moment(values.startDate)
        const now = moment()

        if (!now.isBefore(start)) {
          errors.startDate = 'Start date must be in the future' 
        }
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
            error={formik.errors.name ? {
              content: formik.errors.name,
              pointing: 'above'
            } : undefined}
          />
          <Form.Field
            id='startDate'
            label='Date'
            placeholder='Date'
            control='input'
            type='date'
            value={formik.values.startDate}
            onChange={formik.handleChange}
            error={formik.errors.startDate ? {
              content: formik.errors.startDate,
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
            error={formik.errors.locationCity ? {
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
            error={formik.errors.locationState ? {
              content: formik.errors.locationState,
              pointing: 'above'
            } : undefined}
          />          
          <Form.Field 
            id='locationVenue'
            label='Venue'
            placeholder='Venue' 
            control={Input}             
            type='text'
            value={formik.values.locationVenue} 
            onChange={formik.handleChange}
            error={formik.errors.locationVenue ? {
              content: formik.errors.locationVenue,
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
            error={formik.errors.hostClub ? {
              content: formik.errors.hostClub,
              pointing: 'above'
            } : undefined}
          />          
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => formik.handleSubmit()}>Add Trial</Button>
      </Modal.Actions>
    </>
  )
}

export default AddNewTrial