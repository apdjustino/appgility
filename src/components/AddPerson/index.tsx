import React, { useState } from 'react'
import { useFormik } from 'formik'
import { useMutation } from '@apollo/client'
import * as Yup from 'yup'
import NumberFormat from "react-number-format";
import { ADD_PERSON } from '../../queries/person/person'
import { Alert, Button, Form, Spinner } from 'react-bootstrap'
import { addRunFormVar, selectedPersonForRunVar } from '../../reactiveVars'

type OwnProps = {
  setShowAddPersonModal: React.Dispatch<React.SetStateAction<boolean>>;  
}

const AddPerson = ({ setShowAddPersonModal }: OwnProps) => {  
  const [showError, setShowError] = useState(false)  
  const [addPerson, addPersonResult] = useMutation(ADD_PERSON)  

  const addPersonValidation = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zip: Yup.string().required('Zipcode is required')
  })

  const addPersonFormik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      role: 'exhibitor'
    },
    onSubmit: (values) => {            
      addPerson({ variables: {
        data: values
      }}).then(({ data }) => {          
        addRunFormVar({ personId: data.addPerson.personId, runs: [], dog: { callName: "", dogId: "" } });
        selectedPersonForRunVar([{ personId: data.addPerson.personId, email: data.addPerson.email, name: data.addPerson.name }])      
        setShowAddPersonModal(false)        

      }).catch(() => {
        setShowError(true)
      })
    },
    validationSchema: addPersonValidation
  })

  return (
    
    <Form onSubmit={addPersonFormik.handleSubmit}>
      { !!addPersonResult.error && showError ? (
        <Alert variant="danger">{addPersonResult.error.message}</Alert>
      ) : null}
      <div className="row mb-3">
        <div className="col-12">
          <Form.Label>Email</Form.Label>
            <Form.Control 
              id='email'
              name='email'
              type="email"
              value={addPersonFormik.values.email}
              onChange={addPersonFormik.handleChange}
              isInvalid={!!addPersonFormik.errors.email && !!addPersonFormik.touched.email }
            />
            <Form.Control.Feedback type="invalid">{addPersonFormik.errors.email}</Form.Control.Feedback>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6 col-12">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            id='name'
            name='name'
            value={addPersonFormik.values.name}
            onChange={addPersonFormik.handleChange}
            isInvalid={!!addPersonFormik.errors.name && !!addPersonFormik.touched.name }
          />
          <Form.Control.Feedback type="invalid">{addPersonFormik.errors.name}</Form.Control.Feedback>
        </div>
        <div className="col-md-6 col-12">
          <Form.Label>Phone</Form.Label>
          <Form.Control 
            id='phone'
            name='phone'
            as={NumberFormat}
            format="(###) ###-####"
            value={addPersonFormik.values.phone}
            onChange={addPersonFormik.handleChange}
            isInvalid={!!addPersonFormik.errors.phone && !!addPersonFormik.touched.phone }
          />
          <Form.Control.Feedback type="invalid">{addPersonFormik.errors.phone}</Form.Control.Feedback>
        </div>
      </div>      
      <div className="row mb-3">
        <div className="col-md-6 col-12">
          <Form.Label>Address</Form.Label>
          <Form.Control 
            id='address'
            name='address'
            value={addPersonFormik.values.address}
            onChange={addPersonFormik.handleChange}
            isInvalid={!!addPersonFormik.errors.address && !!addPersonFormik.touched.address }
          />
          <Form.Control.Feedback type="invalid">{addPersonFormik.errors.address}</Form.Control.Feedback>
        </div>
        <div className="col-md-6 col-12">
          <Form.Label>City</Form.Label>
          <Form.Control 
            id='city'
            name='city'
            value={addPersonFormik.values.city}
            onChange={addPersonFormik.handleChange}
            isInvalid={!!addPersonFormik.errors.city && !!addPersonFormik.touched.city }
          />
          <Form.Control.Feedback type="invalid">{addPersonFormik.errors.city}</Form.Control.Feedback>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6 col-12">
          <Form.Label>State</Form.Label>
          <Form.Control 
            id='state'
            name='state'
            value={addPersonFormik.values.state}
            onChange={addPersonFormik.handleChange}
            isInvalid={!!addPersonFormik.errors.state && !!addPersonFormik.touched.state }
          />
          <Form.Control.Feedback type="invalid">{addPersonFormik.errors.state}</Form.Control.Feedback>
        </div>
        <div className="col-md-6 col-12">
          <Form.Label>Zipcode</Form.Label>
          <Form.Control 
            id='zip'
            name='zip'
            value={addPersonFormik.values.zip}
            onChange={addPersonFormik.handleChange}
            isInvalid={!!addPersonFormik.errors.zip && !!addPersonFormik.touched.zip }
          />
          <Form.Control.Feedback type="invalid">{addPersonFormik.errors.zip}</Form.Control.Feedback>
        </div>
      </div>
                  
      <Button type='submit' className="btn btn-white">
        {addPersonResult.loading ? (
          <Spinner animation="border" />
        ): "Add"}                
      </Button>
    </Form>      
    
  )
}

export default AddPerson