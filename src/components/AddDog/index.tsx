import React, { useState } from 'react'
import { Formik, useFormik } from 'formik'
import { useMutation } from '@apollo/client'
import { Input, Button, Container, Checkbox, Dropdown, Message, Modal } from 'semantic-ui-react'
import { Form, Alert, Spinner } from "react-bootstrap";
import * as Yup from 'yup'
import { ADD_DOG } from '../../queries/person/person'
import { addRunFormVar } from "../../reactiveVars";
import { CONFIG_NEW_RUN } from '../../queries/runs/runs'
import { useParams } from 'react-router'
import { AuthContext } from '../../utils/contexts'
import Select from "react-select";
import { SelectOptions } from '../../types/generic';

export enum Sex {
  MALE,
  FEMALE
}

type OwnProps = {  
  setShowAddDogModal: React.Dispatch<React.SetStateAction<boolean>>
}

const AddDog = ({ setShowAddDogModal }: OwnProps) => {

  const { userId } = React.useContext(AuthContext);
  const { personId } = addRunFormVar()
  const { eventId } = useParams<any>()
  const [showError, setShowError] = useState(false)  

  const [addDog, result] = useMutation(ADD_DOG, {
    update: (values) => {      
      setShowAddDogModal(false)
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
    jumpHeight: Yup.object().required('Jump Height is required').shape({
      label: Yup.string(),
      value: Yup.string()
    }),
    sex: Yup.object().required('Sex is required').shape({
      label: Yup.string(),
      value: Yup.string()
    }),
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
      jumpHeight: undefined,
      sex: undefined,
      breeder: '',
      sire: '',
      dam: ''
    },
    onSubmit: (values) => {
      const valuesCopy = { ...values };
      
      if (!!values.jumpHeight && !!values.sex) {
        valuesCopy.jumpHeight = (values.jumpHeight as any).value;
        valuesCopy.sex = (values.sex as any).value;
      }

      addDog({variables: {
        personId,
        secretaryId: userId,
        dog: valuesCopy
      }}).catch(() => {
        setShowError(true)
      })
    },
    validationSchema
  })

  const heightValues: SelectOptions<string>[] = [
    { value: "4", label: '4"'},
    { value: "8", label: '8"'},
    { value: "12", label: '12"'},
    { value: "16", label: '16"'},
    { value: "20", label: '20"'},
    { value: "24", label: '24"'},
  ]

  const sexValues: SelectOptions<string>[] = [
    { value: 'MALE', label: 'Male'},
    { value: 'FEMALE', label: 'Female'},
  ]

  return (
    <Form onSubmit={formik.handleSubmit}>
      {!!result.error && showError ? (
        <Alert variant="danger">{result.error.message}</Alert>
      ) : null}
      
      <div className="row mb-3">
        <div className="col-12">
          <Form.Label>Call Name</Form.Label>
          <Form.Control 
            id='callName'
            name='callName'                   
            value={formik.values.callName}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.callName && !!formik.touched.callName}          
          />
          <Form.Control.Feedback type="invalid">{formik.errors.callName}</Form.Control.Feedback>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-12">
          <Form.Label>AKC Name</Form.Label>
          <Form.Control 
            id='akcName'
            name='akcName'            
            value={formik.values.akcName}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.akcName && !!formik.touched.akcName }          
          />
          <Form.Control.Feedback type="invalid">{formik.errors.akcName}</Form.Control.Feedback>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-12">
          <Form.Label>AKC Number</Form.Label>
            <Form.Control 
              id='akcNumber'
              name='akcNumber'            
              value={formik.values.akcNumber}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.akcNumber && !!formik.touched.akcNumber }          
            />
            <Form.Control.Feedback type="invalid">{formik.errors.akcNumber}</Form.Control.Feedback>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4 col-12">
          <Form.Check 
            id='needsMeasured'
            name='needsMeasured'
            label="This dog needs to be measured"
            type="checkbox"            
            checked={formik.values.needsMeasured}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.needsMeasured}
          />
        </div>
        <div className="col-md-4 col-12">
          <Form.Label>Height at withers</Form.Label>
          <Form.Control 
            id='withersHeight'
            name='withersHeight'            
            value={formik.values.withersHeight}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.withersHeight && !!formik.touched.withersHeight }          
          />
          <Form.Control.Feedback type="invalid">{formik.errors.withersHeight}</Form.Control.Feedback>
        </div>
        <div className="col-md-4 col-12">
          <Form.Label>Jump Height</Form.Label>
          <Form.Control 
            id="jumpHeight"
            name="jumpHeight"
            className="bg-transparent border-0 p-0"
            as={Select}
            value={formik.values.jumpHeight}
            onChange={(newValue: any) => {
              formik.setFieldValue("jumpHeight", newValue)
            }}
            options={heightValues}
            placeholder="Choose a jump height"
            isInvalid={!!formik.errors.jumpHeight && !!formik.touched.jumpHeight}
          />
          <Form.Control.Feedback type="invalid">{formik.errors.jumpHeight}</Form.Control.Feedback>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-4 col-12">
          <Form.Label>Breed</Form.Label>
          <Form.Control 
            id='breed'
            name='breed'            
            value={formik.values.breed}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.breed && !!formik.touched.breed }          
          />
          <Form.Control.Feedback type="invalid">{formik.errors.breed}</Form.Control.Feedback>
        </div>
        <div className="col-md-4 col-12">
          <Form.Label>Variety</Form.Label>
          <Form.Control 
            id='variety'
            name='variety'            
            value={formik.values.variety}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.variety && !!formik.touched.variety }          
          />
          <Form.Control.Feedback type="invalid">{formik.errors.variety}</Form.Control.Feedback>
        </div>
        <div className="col-md-4 col-12">
          <Form.Label>Sex</Form.Label>
          <Form.Control 
            id="sex"
            name="sex"
            className="bg-transparent border-0 p-0"
            as={Select}
            value={formik.values.sex}
            onChange={(newValue: any) => {
              formik.setFieldValue("sex", newValue)
            }}
            options={sexValues}            
            isInvalid={!!formik.errors.sex && !!formik.touched.sex}
          />
          <Form.Control.Feedback type="invalid">{formik.errors.sex}</Form.Control.Feedback>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6 col-12">
          <Form.Label>Birthdate</Form.Label>
          <Form.Control 
            id='dob'
            name='dob'
            type="date"       
            value={formik.values.dob}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.dob && !!formik.touched.dob }          
          />
          <Form.Control.Feedback type="invalid">{formik.errors.dob}</Form.Control.Feedback>
        </div>
        <div className="col-md-6 col-12">
          <Form.Label>Place of birth</Form.Label>
          <Form.Control 
            id='placeOfBirth'
            name='placeOfBirth'            
            value={formik.values.placeOfBirth}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.placeOfBirth && !!formik.touched.placeOfBirth }          
          />
          <Form.Control.Feedback type="invalid">{formik.errors.placeOfBirth}</Form.Control.Feedback>
        </div>        
      </div>
      <div className="row mb-3">
        <div className="col-md-4 col-12">
          <Form.Label>Breeder</Form.Label>
          <Form.Control 
            id='breeder'
            name='breeder'            
            value={formik.values.breeder}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.breeder && !!formik.touched.breeder }          
          />
          <Form.Control.Feedback type="invalid">{formik.errors.breeder}</Form.Control.Feedback>
        </div>
        <div className="col-md-4 col-12">
          <Form.Label>Sire</Form.Label>
          <Form.Control 
            id='sire'
            name='sire'            
            value={formik.values.sire}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.sire && !!formik.touched.sire }          
          />
          <Form.Control.Feedback type="invalid">{formik.errors.sire}</Form.Control.Feedback>
        </div>
        <div className="col-md-4 col-12">
          <Form.Label>Dam</Form.Label>
          <Form.Control 
            id='dam'
            name='dam'            
            value={formik.values.dam}
            onChange={formik.handleChange}
            isInvalid={!!formik.errors.dam && !!formik.touched.dam }          
          />
          <Form.Control.Feedback type="invalid">{formik.errors.dam}</Form.Control.Feedback>
        </div>
      </div>                                  
      {(result.error && showError) ? (
          <Message error header="Error" content={result.error.message} />) : null}
        <button type="submit" className="btn btn-white">
          {result.loading ? (
            <Spinner animation="border" />
          ): "Add"}
        </button>
    </Form>
  )
}

export default AddDog