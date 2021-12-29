import React, { useState } from 'react'
import { useFormik } from 'formik'
import { useHistory } from 'react-router-dom'
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useMutation } from '@apollo/client'
import * as Yup from 'yup'
import { ADD_PERSON } from '../../queries/person/person'
import { Eye } from "react-feather";
import { useAuth0 } from '@auth0/auth0-react';
import NumberFormat from "react-number-format";

const SignupForm = () => {
  const [showError, setShowError] = useState(false)
  const { loginWithRedirect } = useAuth0()

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email is not valid').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    password: Yup.string().required('Password is required').min(8, 'Password must have a minimum of 8 characters').matches(/(?=^.{16,}$)((?=.*\w)(?=.*[A-Z])(?=.*[0-9])(?=.*[|!$% &@#/()?^'\+\-*]))^.*/, 'Password must include lower case, lower case, numbers, and special characters')
  })
  const history = useHistory()

  const [addPerson, result] = useMutation(ADD_PERSON, {
    update: () => history.push('/home')
  })
  
  const formik = useFormik({
    onSubmit: (values) => {
      addPerson({ variables: {
        data: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          role: 'secretary'
        },
        password: values.password
      }}).then(() => {
        loginWithRedirect()
      }).catch(e => {
        setShowError(true)
      })      
    },
    initialValues: {
      name: '',
      email: '',
      phone: '',
      password: ''
    },
    validationSchema
  })

  return (
    <>
      <h1 className="display-4 text-center mb-3">Appgility</h1>
      <p className="text-muted text-center mb-5">Trial secretary software</p>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <Form.Label>Email Address</Form.Label>
          <Form.Control name="email" type="email" value={formik.values.email} onChange={formik.handleChange} isInvalid={!!formik.errors.email && !!formik.touched.email}/>
          <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
        </div>
        <div className="form-group">
          <Row>
            <Col>
              <Form.Label>Password</Form.Label>
            </Col>
            <Col xs="auto">
              <Link to="/password-reset">
                <Form.Text as="a" className="small text-muted">
                  Forgot password?
                </Form.Text>
              </Link>
            </Col>
          </Row>
          <InputGroup className="input-group-merge">
            <Form.Control name="password" type="password" value={formik.values.password} onChange={formik.handleChange} isInvalid={!!formik.errors.password && !!formik.touched.password} />
            <InputGroup.Text>
              <Eye size="1em"/>
            </InputGroup.Text>
            <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
          </InputGroup>
        </div>
        <div className="form-group">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" type="text" value={formik.values.name} onChange={formik.handleChange} isInvalid={!!formik.errors.name && !!formik.touched.name} />
          <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
        </div>
        <div className="form-group">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control 
            name="phone"
            type="text" 
            value={formik.values.phone} 
            as={NumberFormat}
            format="(###)###-####"
            onChange={formik.handleChange} 
            isInvalid={!!formik.errors.phone && !!formik.touched.phone} 
          />
          <Form.Control.Feedback type="invalid">{formik.errors.phone}</Form.Control.Feedback>
        </div>
        <Button size="lg" className="w-100 mb-3" type="submit">
          {result.loading ? (
            <Spinner animation="border"/>
          ): "Sign up"}          
        </Button>
        <p className="text-center">
          <span className="text-muted text-center fs-3">
            Already have an account?{' '}
            <button type="button" className="btn btn-link p-0" onClick={() => loginWithRedirect()}>Log in</button>
            .
          </span>
        </p>
      </Form>
    </>
  )
}

export default SignupForm