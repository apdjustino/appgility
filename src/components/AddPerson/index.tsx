import React, { useState } from 'react'
import { useFormik } from 'formik'
import { useHistory, useLocation } from 'react-router'
import { useLazyQuery, useMutation } from '@apollo/client'
import * as Yup from 'yup'
import { Container, Card, Form, Button, Input, Item, Header, Icon, Modal, Message } from 'semantic-ui-react'
import { GET_PERSON_BY_EMAIL, ADD_PERSON } from '../../queries/person/person'
import { addRunFormVar } from '../../pages/AddRun'

const AddPerson = () => {
  const [addPersonIsOpen, setAddPersonIsOpen] = useState(false)  
  const [showError, setShowError] = useState(false)
  const [getPersonByEmail, { data, loading, error }] = useLazyQuery(GET_PERSON_BY_EMAIL)
  const [addPerson, addPersonResult] = useMutation(ADD_PERSON)
  const history = useHistory()
  const location = useLocation()

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format')
  })

  const formik = useFormik({
    initialValues: { email: '' },
    onSubmit: (values) => { 
      addPersonFormik.setFieldValue('email', values.email)
      getPersonByEmail({ variables: { email: values.email }})      
    },
    validationSchema
  })
  
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
        const runDataCopy = { ...addRunFormVar() }
        runDataCopy.personId = data.addPerson.personId        
        addRunFormVar(runDataCopy)
        const url = location.pathname        
        history.push(url.replace('/person', '/config'))

      }).catch(() => {
        setShowError(true)
      })
    },
    validationSchema: addPersonValidation
  })

  return (
    <Container>
      <Card.Group centered>
        <Card>
          <Card.Content>
            <Card.Header>Find Exhibitor by Email</Card.Header>
          </Card.Content>
          <Card.Content>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Field 
                id='email'
                name='email'
                label='Email:'
                control={Input}
                type='email'
                placeholder='exhibitor@appgility.com'
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.errors.email && formik.touched.email ? {
                  content: formik.errors.email,
                  pointing: 'above'
                } : undefined}
              />
              <Button type='submit' basic color='black' loading={loading}>Search</Button>
            </Form>
          </Card.Content>
          { data ? (
            <Card.Content>
              { data.getPersonByEmail ? (
                <Item>
                  <Item.Content>
                    <Item.Header as='a'>{data.getPersonByEmail.email}</Item.Header>
                    <Item.Description>
                      <div>Justin Martinez</div>
                      <div>1324 Espejo NE</div>
                      <div>Albuquerque NM, 87112</div>
                    </Item.Description>
                  </Item.Content>
                </Item>
              ) : (
                <>
                  <Header as='h3' icon>
                    <Icon name='exclamation triangle' />
                    <Header.Subheader>
                      Email not found
                    </Header.Subheader>
                  </Header>
                  <Container textAlign='center'>
                    <Button basic color='black' onClick={() => setAddPersonIsOpen(true)}>Add Exhibitor</Button>
                  </Container>
                  
                </>
              )}
              
            </Card.Content>
          ) : null}
        </Card>
      </Card.Group>
      <Modal open={addPersonIsOpen} onClose={() => setAddPersonIsOpen(false)} onOpen={() => setAddPersonIsOpen(true)}>        
        <Modal.Header>Add Exhibitor</Modal.Header>
        <Modal.Content>
          <Form onSubmit={addPersonFormik.handleSubmit}>
            <Form.Field 
              id='name'
              name='name'
              label='Name:'
              control={Input}
              value={addPersonFormik.values.name}
              onChange={addPersonFormik.handleChange}
              error={addPersonFormik.errors.name && addPersonFormik.touched.name ? {
                content: addPersonFormik.errors.name,
                pointing: 'above'
              } : undefined}
            />
            <Form.Field 
              id='email'
              name='email'
              label='Email:'
              control={Input}
              value={addPersonFormik.values.email}
              onChange={addPersonFormik.handleChange}              
              error={addPersonFormik.errors.email && addPersonFormik.touched.email ? {
                content: addPersonFormik.errors.email,
                pointing: 'above'
              } : undefined}
            />
            <Form.Field 
              id='phone'
              name='phone'
              label='Phone:'
              control={Input}
              value={addPersonFormik.values.phone}
              onChange={addPersonFormik.handleChange}
              error={addPersonFormik.errors.name && addPersonFormik.touched.phone ? {
                content: addPersonFormik.errors.phone,
                pointing: 'above'
              } : undefined}
            />
            <Form.Field 
                id='address'
                name='address'
                label='Address:'
                control={Input}
                value={addPersonFormik.values.address}
                onChange={addPersonFormik.handleChange}
                error={addPersonFormik.errors.address && addPersonFormik.touched.address ? {
                  content: addPersonFormik.errors.address,
                  pointing: 'above'
                } : undefined}
              />
            <Form.Group>              
              <Form.Field 
                id='city'
                name='city'
                label='City:'
                control={Input}
                value={addPersonFormik.values.city}
                onChange={addPersonFormik.handleChange}
                error={addPersonFormik.errors.city && addPersonFormik.touched.city ? {
                  content: addPersonFormik.errors.city,
                  pointing: 'above'
                } : undefined}
              />
              <Form.Field 
                id='state'
                name='state'
                label='State:'
                control={Input}
                value={addPersonFormik.values.state}
                onChange={addPersonFormik.handleChange}
                error={addPersonFormik.errors.state && addPersonFormik.touched.state ? {
                  content: addPersonFormik.errors.state,
                  pointing: 'above'
                } : undefined}
              />
              <Form.Field 
                id='zip'
                name='zip'
                label='Zip Code:'
                control={Input}
                value={addPersonFormik.values.zip}
                onChange={addPersonFormik.handleChange}
                error={addPersonFormik.errors.zip && addPersonFormik.touched.zip ? {
                  content: addPersonFormik.errors.zip,
                  pointing: 'above'
                } : undefined}
              />
            </Form.Group> 
          </Form>
          {addPersonResult.error && showError ? (
            <Message error header="Error" content={addPersonResult.error.message}/>
          ) : null}                    
        </Modal.Content>
        <Modal.Actions>
        <Button type='submit' basic color='black' onClick={addPersonFormik.submitForm} loading={addPersonResult.loading}>Add</Button>
        </Modal.Actions>          
      </Modal>
    </Container>
  )
}

export default AddPerson