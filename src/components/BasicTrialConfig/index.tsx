import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import * as Yup from 'yup'
import NumberFormat from "react-number-format";
import { Form, Alert, Button, Spinner } from "react-bootstrap";
import { GET_EVENT, GET_PERSON_EVENTS, UPDATE_EVENT } from "../../queries/trials/trials";
import { AuthContext } from "../../utils/contexts";
import { useFormik } from "formik";
import { Event } from "../../types/event";

type QueryResponse = {
  getEvent: Event
}

type OwnProps = {
  eventId: string;
}

const BasicTrialConfig = ({ eventId }: OwnProps) => {  
  const { data, loading, error } = useQuery<QueryResponse>(GET_EVENT, { variables: { eventId }});
  const { userId } = React.useContext(AuthContext)
  const [showError, setShowError] = React.useState(false)

  const [updateEvent, result] = useMutation(UPDATE_EVENT, {
    refetchQueries: [
      { query: GET_EVENT, variables: { eventId: eventId }},
      { query: GET_PERSON_EVENTS, variables: { personId: userId }}
    ]
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    locationCity: Yup.string().required('Required'),
    locationState: Yup.string().required('Required'),
    trialSite: Yup.string().required('Required'),
    hostClub: Yup.string().required('Required'),
  });

  const initialValues = !!data && !!data.getEvent && !loading ? {
    name: data.getEvent.name,
    locationCity: data.getEvent.locationCity,
    locationState: data.getEvent.locationState,
    trialSite: data.getEvent.trialSite,
    hostClub: data.getEvent.hostClub,
    trialChairName: data.getEvent.trialChairName,
    trialChairEmail: data.getEvent.trialChairEmail,
    trialChairPhone: data.getEvent.trialChairPhone
  } : {
    name: "",
    locationCity: "",
    locationState: "",
    trialSite: "",
    hostClub: "",
    trialChairName: "",
    trialChairEmail: "",
    trialChairPhone: ""
  }
  
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      if (!!data && !!data.getEvent) {
        const updatedEvent = { ...data.getEvent };
        updatedEvent.name = values.name;
        updatedEvent.locationCity = values.locationCity;
        updatedEvent.locationState = values.locationState;
        updatedEvent.trialSite = values.trialSite;
        updatedEvent.hostClub = values.hostClub;
        updatedEvent.trialChairName = values.trialChairName;
        updatedEvent.trialChairEmail = values.trialChairEmail;
        updatedEvent.trialChairPhone = values.trialChairPhone;

        updateEvent({ variables: { eventId, personId: userId, updatedEvent }}).catch(e => {
          setShowError(true)
        });
      }
    },
    validationSchema,
    enableReinitialize: true
  });

  return loading ? (
    <div className="h-100">
      <Spinner animation="border" />
    </div>   
  ) : (
    <>
      <Form onSubmit={formik.handleSubmit}>
        { result.called && !!result.data ? (
          <Alert variant="success">Event data updated succesfully</Alert>
        ) : null}
        { result.error && showError ? (
          <Alert variant="danger">{result.error.message}</Alert>
        ) : null}
        { !!error ? (
          <Alert variant="danger">{error.message}</Alert>
        ) : null }
        <div className="row pb-3">
          <div className="col">
            <Form.Label>Name</Form.Label>
            <Form.Control 
              id='name'
              name="name"
              placeholder='Name'
              value={formik.values.name}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.name && !!formik.touched.name}         
            />
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback> 
          </div>
        </div>
        <div className="row pb-3">
          <div className="col-xl-6 col-md-12">
            <Form.Label>City</Form.Label>
            <Form.Control 
              id='locationCity'
              placeholder='City'
              name="locationCity"
              value={formik.values.locationCity}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.locationCity && !!formik.touched.locationCity}         
            />
            <Form.Control.Feedback type="invalid">{formik.errors.locationCity}</Form.Control.Feedback>
          </div>
          <div className="col-xl-6 col-md-12">
            <Form.Label>State</Form.Label>
            <Form.Control 
              id='locationState'
              placeholder='State'
              name="locationState"
              value={formik.values.locationState}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.locationState && !!formik.touched.locationState}         
            />
            <Form.Control.Feedback type="invalid">{formik.errors.locationState}</Form.Control.Feedback>
          </div>
        </div>
        <div className="row pb-3">
          <div className="col">
            <Form.Label>Trial Site</Form.Label>
            <Form.Control 
              id='trialSite'
              placeholder='Trial Site'
              name="trialSite"
              value={formik.values.trialSite as string}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.trialSite && !!formik.touched.trialSite}         
            />
            <Form.Control.Feedback type="invalid">{formik.errors.trialSite}</Form.Control.Feedback>
          </div>
        </div>
        <div className="row pb-3">
          <div className="col">
            <Form.Label>Trial Chair</Form.Label>
            <Form.Control 
              id='trialChairName'
              placeholder='Name'
              name="trialChairName"
              value={formik.values.trialChairName as string}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.trialChairName && !!formik.touched.trialChairName}         
            />
            <Form.Control.Feedback type="invalid">{formik.errors.trialChairName}</Form.Control.Feedback>
          </div>
        </div>
        <div className="row pb-3">
          <div className="col">
            <Form.Label>Trial Chair Email</Form.Label>
            <Form.Control 
              id='trialChairEmail'
              placeholder='Email'
              name="trialChairEmail"
              type="email"
              value={formik.values.trialChairEmail as string}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.trialChairEmail && !!formik.touched.trialChairEmail}         
            />
            <Form.Control.Feedback type="invalid">{formik.errors.trialChairEmail}</Form.Control.Feedback>
          </div>
        </div>
        <div className="row pb-3">
          <div className="col">
            <Form.Label>Trial Chair Phone</Form.Label>
            <Form.Control 
              id='trialChairPhone'
              placeholder='Phone'
              name="trialChairPhone"              
              value={formik.values.trialChairPhone as string}
              format="(###)###-####"
              as={NumberFormat}
              onChange={formik.handleChange}
              isInvalid={!!formik.errors.trialChairPhone && !!formik.touched.trialChairPhone}         
            />
            <Form.Control.Feedback type="invalid">{formik.errors.trialChairPhone}</Form.Control.Feedback>
          </div>
        </div>
        <Button type="submit">
          {result.loading ? (
            <Spinner animation="border" />
          ) : "Submit"}
        </Button>
      </Form>
    </>
  )


}

export default BasicTrialConfig;