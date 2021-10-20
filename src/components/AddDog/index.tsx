import React, { useState } from 'react'
import { useFormik } from 'formik'
import { useMutation } from '@apollo/client'
import { Form, Input, Button, Container, Checkbox, Dropdown, Message, Modal } from 'semantic-ui-react'
import * as Yup from 'yup'
import { ADD_DOG } from '../../queries/person/person'
import { addRunFormVar } from '../../pages/AddRun'
import { CONFIG_NEW_RUN } from '../../queries/runs/runs'
import { useParams } from 'react-router'

export enum Sex {
  MALE,
  FEMALE
}

type SelectOptions<T> = {
  id: string,
  key: string,
  text: string,
  value: T
}

type OwnProps = {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddDog = ({ open, setOpen }: OwnProps) => {

  const { personId } = addRunFormVar()
  const { eventId } = useParams<any>()
  const [showError, setShowError] = useState(false)  

  const [addDog, result] = useMutation(ADD_DOG, {
    update: (values) => {
      console.log(values)
      setOpen(false)
    },
    refetchQueries: [
      { query: CONFIG_NEW_RUN, variables: { personId, eventId }}
    ]
  })
  
  const validationSchema = Yup.object().shape({
    callName: Yup.string().required('Call name is required'),
    akcNumber: Yup.string().required('AKC Number is required'),
    akcName: Yup.string().required('AKC Name is required'),
    needsMeasured: Yup.boolean(),
    withersHeight: Yup.string(),
    breed: Yup.string().required('Breed is required'),
    variety: Yup.string(),
    placeOfBirth: Yup.string(),
    dob: Yup.string().required('Date of Birth is required'),
    jumpHeight: Yup.string().required('Jump Height is required'),
    sex: Yup.string().required('Sex is required'),
    breeder: Yup.string(),
    sire: Yup.string(),
    dam: Yup.string()


  })

  const formik = useFormik({
    initialValues: {
      callName: '',
      akcNumber: '',
      akcName: '',
      needsMeasured: false,
      withersHeight: '',
      breed: '',
      variety: '',
      placeOfBirth: '',
      dob: '',
      jumpHeight: '',
      sex: 'FEMALE',
      breeder: '',
      sire: '',
      dam: ''
    },
    onSubmit: (values) => {
      addDog({variables: {
        personId,
        dog: values
      }}).catch(() => {
        setShowError(true)
      })
    },
    validationSchema
  })

  const heightValues: SelectOptions<string>[] = [
    { id: '4', key: '4', value: '4', text: '4"'},
    { id: '8', key: '8', value: '8', text: '8"'},
    { id: '12', key: '12', value: '12', text: '12"'},
    { id: '16', key: '16', value: '16', text: '16"'},
    { id: '20', key: '20', value: '20', text: '20"'},
    { id: '24', key: '24', value: '24', text: '24"'},
  ]

  const sexValues: SelectOptions<string>[] = [
    { id: '0', key: '0', value: 'MALE', text: 'Male'},
    { id: '1', key: '1', value: 'FEMALE', text: 'Female'},
  ]

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header>Add Dog</Modal.Header>
          <Modal.Content>
            <Form onSubmit={formik.handleSubmit} error={!!result.called && !!result.error}>
              <Form.Input 
                id='callName'
                name='callName'
                label="Call Name:"
                control={Input}
                value={formik.values.callName}
                onChange={formik.handleChange}
                error={formik.errors.callName && formik.touched.callName ? {
                  content: formik.errors.callName,
                  pointing: 'above'
                }: undefined}          
              />
              <Form.Input 
                id='akcName'
                name='akcName'
                label="AKC Name:"
                control={Input}
                value={formik.values.akcName}
                onChange={formik.handleChange}
                error={formik.errors.akcName && formik.touched.akcName ? {
                  content: formik.errors.akcName,
                  pointing: 'above'
                }: undefined}          
              />
              <Form.Input 
                id='akcNumber'
                name='akcNumber'
                label="AKC Number:"
                control={Input}
                value={formik.values.akcNumber}
                onChange={formik.handleChange}
                error={formik.errors.akcNumber && formik.touched.akcNumber ? {
                  content: formik.errors.akcNumber,
                  pointing: 'above'
                }: undefined}          
              />
              <Form.Group>
                <Form.Input 
                    id='needsMeasured'
                    name='needsMeasured'
                    label="This dog needs to be measured:"
                    control={Checkbox}
                    value={formik.values.needsMeasured}
                    onChange={formik.handleChange}
                    error={formik.errors.needsMeasured && formik.touched.needsMeasured ? {
                      content: formik.errors.needsMeasured,
                      pointing: 'above'
                    }: undefined}          
                  />
                  <Form.Input 
                    id='withersHeight'
                    name='withersHeight'
                    label="Height at withers:"
                    control={Input}
                    value={formik.values.withersHeight}
                    onChange={formik.handleChange}
                    error={formik.errors.withersHeight && formik.touched.withersHeight ? {
                      content: formik.errors.withersHeight,
                      pointing: 'above'
                    }: undefined}          
                  />
                  <Form.Input 
                    id='jumpHeight'
                    name='jumpHeight'
                    label="Jump Height:"
                    selection
                    control={Dropdown}
                    value={formik.values.jumpHeight}
                    options={heightValues}
                    onChange={(e: any, d: any) => {
                      formik.setFieldValue('jumpHeight', d.value)
                    }}
                    error={formik.errors.jumpHeight && formik.touched.jumpHeight ? {
                      content: formik.errors.jumpHeight,
                      pointing: 'above'
                    }: undefined}          
                  />
              </Form.Group>
              <Form.Group>
                <Form.Input 
                  id='breed'
                  name='breed'
                  label="Breed:"
                  control={Input}
                  value={formik.values.breed}
                  onChange={formik.handleChange}
                  error={formik.errors.breed && formik.touched.breed ? {
                    content: formik.errors.breed,
                    pointing: 'above'
                  }: undefined}          
                />
                <Form.Input 
                  id='variety'
                  name='variety'
                  label="Variety:"
                  control={Input}
                  value={formik.values.variety}
                  onChange={formik.handleChange}
                  error={formik.errors.variety && formik.touched.variety ? {
                    content: formik.errors.variety,
                    pointing: 'above'
                  }: undefined}          
                />
                <Form.Input 
                  id='sex'
                  name='sex'
                  label="Sex:"
                  control={Dropdown}
                  selection
                  options={sexValues}
                  value={formik.values.sex}
                  onChange={(e: any, d: any) => {
                    formik.setFieldValue('sex', d.value)
                  }}
                  error={formik.errors.sex && formik.touched.sex ? {
                    content: formik.errors.sex,
                    pointing: 'above'
                  }: undefined}          
                />
              </Form.Group>
              <Form.Group>
                <Form.Input 
                  id='dob'
                  name='dob'
                  label="Date of Birth:"
                  control='input'
                  type='date'
                  value={formik.values.dob}
                  onChange={formik.handleChange}            
                />
                <Form.Input 
                  id='placeOfBirth'
                  name='placeOfBirth'
                  label="Place of Birth:"
                  control={Input}
                  value={formik.values.placeOfBirth}
                  onChange={formik.handleChange}
                  error={formik.errors.placeOfBirth && formik.touched.placeOfBirth ? {
                    content: formik.errors.placeOfBirth,
                    pointing: 'above'
                  }: undefined}          
                />
              </Form.Group>
              <Form.Group>
                <Form.Input 
                  id='breeder'
                  name='breeder'
                  label="Breeder:"
                  control={Input}
                  value={formik.values.breeder}
                  onChange={formik.handleChange}
                  error={formik.errors.breeder && formik.touched.breeder ? {
                    content: formik.errors.breeder,
                    pointing: 'above'
                  }: undefined}          
                />
                <Form.Input 
                  id='sire'
                  name='sire'
                  label="Sire:"
                  control={Input}
                  value={formik.values.sire}
                  onChange={formik.handleChange}
                  error={formik.errors.sire && formik.touched.sire ? {
                    content: formik.errors.sire,
                    pointing: 'above'
                  }: undefined}          
                />
                <Form.Input 
                  id='dam'
                  name='dam'
                  label="Dam:"
                  control={Input}
                  value={formik.values.dam}
                  onChange={formik.handleChange}
                  error={formik.errors.dam && formik.touched.dam ? {
                    content: formik.errors.dam,
                    pointing: 'above'
                  }: undefined}          
                />                
              </Form.Group>              
              {(result.error && showError) ? (
                  <Message error header="Error" content={result.error.message} />) : null}
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button type='submit' basic color="black" onClick={formik.submitForm} loading={result.loading}>Add Dog</Button>
          </Modal.Actions>
      </Modal> 
  )
}

export default AddDog