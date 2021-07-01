import React, { useContext } from 'react'
import { useFormik } from 'formik'
import { Modal, Form, Button, Input } from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import moment from 'moment'
import { ADD_NEW_TRIAL, GET_PERSON_TRIALS } from '../../queries/trials/trials'
import { AuthContext } from '../../utils/contexts'

interface InitialValues {
  name: string,
  startDate: Date | undefined,
  endDate: Date | undefined,
  locationCity: string,
  locationState: string,
  locationVenue?: string,
  hostClub?: string
}

interface OwnProps {
  setAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNewTrial = ({ setAddDialogOpen }: OwnProps) => {
  const userAuth = useContext(AuthContext)
  const [addNewTrial, result] = useMutation(ADD_NEW_TRIAL, { 
    update: () => setAddDialogOpen(false),
    refetchQueries: [
      { query: GET_PERSON_TRIALS, variables: { personId: userAuth.userId} }
    ]
  })
  const formik = useFormik({
    initialValues: {
      name: '',
      startDate: undefined,
      endDate: undefined,
      locationCity: '',
      locationState: '',
      locationVenue: '',
      hostClub: ''
    },
    onSubmit: (values: InitialValues) => {
      addNewTrial({ variables: {
        data: values,
        personId: userAuth.userId
      }})
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
            error={formik.errors.name && formik.touched.name ? {
              content: formik.errors.name,
              pointing: 'above'
            } : undefined}
          />
          <Form.Field
            id='startDate'
            label='Start Date'
            placeholder='Start Date'
            control='input'
            type='date'
            value={formik.values.startDate}
            onChange={formik.handleChange}
            error={formik.errors.startDate && formik.touched.startDate ? {
              content: formik.errors.startDate,
              pointing: 'above'
            } : undefined}
          />
          <Form.Field
            id='endDate'
            label='End Date'
            placeholder='End Date'
            control='input'
            type='date'
            value={formik.values.endDate}
            onChange={formik.handleChange}
            error={formik.errors.endDate && formik.touched.endDate ? {
              content: formik.errors.endDate,
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
            id='locationVenue'
            label='Venue'
            placeholder='Venue' 
            control={Input}             
            type='text'
            value={formik.values.locationVenue} 
            onChange={formik.handleChange}
            error={formik.errors.locationVenue && formik.touched.locationVenue ? {
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
            error={formik.errors.hostClub && formik.touched.hostClub ? {
              content: formik.errors.hostClub,
              pointing: 'above'
            } : undefined}
          />          
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => formik.handleSubmit()} loading={result.loading}>Add Trial</Button>
      </Modal.Actions>
    </>
  )
}

export default AddNewTrial