import { useMutation, useQuery } from "@apollo/client";
import * as Yup from "yup";
import React from "react";
import { Spinner, Form, Alert, Button } from "react-bootstrap";
import { GET_EVENT, GET_PERSON_EVENTS, UPDATE_EVENT } from "../../queries/trials/trials";
import { AuthContext } from "../../utils/contexts";
import { useFormik } from "formik";
import { Event } from "../../types/event";
import NumberFormat from "react-number-format"

type OwnProps = {
  eventId: string;
}

type QueryResponse = {
  getEvent: Event
}

const RegistrationConfig = ({ eventId }: OwnProps) => {
 
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
    openingDate: Yup.string().required('Required'),
    closingDate: Yup.string().required('Required'),
    price: Yup.number().min(0, 'Minimum price is 0').required('Required'),
    altPrice: Yup.number().min(0, 'Minimum price is 0').required('Required')
  });

  const initialValues = !!data && !!data.getEvent && !loading ? {
    openingDate: data.getEvent.openingDate,
    closingDate: data.getEvent.closingDate,
    price: !!data.getEvent.price ? (data.getEvent.price / 100).toString() : "",
    altPrice: !!data.getEvent.altPrice ? (data.getEvent.altPrice / 100).toString() : ""
  } : {
    openingDate: "",
    closingDate: "",
    price: "",
    altPrice: ""
  }

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      console.log(values);
      if (!!data && !!data.getEvent) {
        const updatedEvent = { ...data.getEvent }      
        updatedEvent.openingDate = values.openingDate
        updatedEvent.closingDate = values.closingDate
        updatedEvent.price = Math.floor(parseFloat(values.price) * 100)
        updatedEvent.altPrice = Math.floor(parseFloat(values.altPrice)* 100)

        updateEvent({ variables: {
          eventId,
          personId: userId,
          updatedEvent
        }}).catch(() => {
          setShowError(true)
        })
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
            <div className="col-xl-6 col-md-12">
              <Form.Label>Opening Date</Form.Label>
              <Form.Control 
                id='openingDate'                                
                name="openingDate"
                type='date'                
                onChange={formik.handleChange}
                value={formik.values.openingDate as string}
                isInvalid={!!formik.errors.openingDate && !!formik.touched.openingDate}      
              />
              <Form.Control.Feedback type="invalid">{formik.errors.openingDate}</Form.Control.Feedback>
            </div>
            <div className="col-xl-6 col-md-12">
              <Form.Label>Closing Date</Form.Label>
              <Form.Control 
                id='closingDate'                                
                name="closingDate"
                type='date'                
                onChange={formik.handleChange}
                value={formik.values.closingDate as string}
                isInvalid={!!formik.errors.closingDate && !!formik.touched.closingDate}      
              />
              <Form.Control.Feedback type="invalid">{formik.errors.closingDate}</Form.Control.Feedback>
            </div>
          </div>
          <div className="row pb-3">
            <div className="col-xl-6 col-md-12">
              <Form.Label>Price</Form.Label>
              <Form.Control 
                id='price'                                
                name="price"
                as={NumberFormat}
                prefix="$"
                onValueChange={(values: any) => {
                  formik.setFieldValue("price", values.value)
                }}
                value={formik.values.price as string}
                isInvalid={!!formik.errors.price && !!formik.touched.price}      
              />
              <Form.Control.Feedback type="invalid">{formik.errors.price}</Form.Control.Feedback>
            </div>
            <div className="col-xl-6 col-md-12">
              <Form.Label>Discount Price</Form.Label>
              <Form.Control 
                id='altPrice'                                
                name="altPrice"
                as={NumberFormat}
                prefix="$"                                
                onValueChange={(values: any) => {
                  formik.setFieldValue('altPrice', values.value)
                }}
                value={formik.values.altPrice as string}
                isInvalid={!!formik.errors.altPrice && !!formik.touched.altPrice}      
              />
              <Form.Control.Feedback type="invalid">{formik.errors.altPrice}</Form.Control.Feedback>
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

export default RegistrationConfig;