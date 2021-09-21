import React, { useState } from 'react'
import { useFormik } from 'formik'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Message } from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import * as Yup from 'yup'
import { ADD_PERSON } from '../../queries/person/person'

const SignupForm = () => {
  const [showError, setShowError] = useState(false)

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email is not valid').required('Email is required'),
    phone: Yup.string().required('Phone number is required').max(10, 'Maximum length is 10').matches(/^[0-9]*$/, 'Phone number can only contain number'),
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
      }}).catch(e => {
        setShowError(true)
      })
      console.log(values)
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
    <Form error={!!result.error} onSubmit={formik.handleSubmit}>
      <Form.Field 
        id='email'
        name='email'
        label='Email:'
        control={Input}
        type='email'
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.errors.email && formik.touched.email ? {
          content: formik.errors.email,
          pointing: 'above',
        }: undefined}
      />
      <Form.Field 
        id='password'
        name='password'
        label='Password:'
        control={Input}
        type='password'
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.errors.password && formik.touched.password ? {
          content: formik.errors.password,
          pointing: 'above'
        } : undefined}
      />
      <Form.Field 
        id='name'
        name='name'
        label='Name:'
        control={Input}
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.errors.name && formik.touched.name ? {
          content: formik.errors.name,
          pointing: 'above'
        } : undefined}   
      />      
      <Form.Field 
        id='phone'
        name='phone'
        label='Phone Number:'
        control={Input}
        value={formik.values.phone}
        onChange={formik.handleChange}
        error={formik.errors.phone && formik.touched.phone ? {
          content: formik.errors.phone,
          pointing: 'above',
        }: undefined}
      />
      <Button basic color='black' type='submit' loading={result.loading}>Submit</Button>
      {result.error && showError ? (
        <Message error header="Error" content={result.error.message} />
      ) : null}
    </Form>
  )
}

export default SignupForm