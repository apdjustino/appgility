import { useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import * as Yup from "yup";
import NumberFormat from "react-number-format";
import { Form, Alert, Button, Spinner } from "react-bootstrap";
import { GET_EVENT, GET_PERSON_EVENTS, UPDATE_EVENT } from "../../queries/trials/trials";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { Event } from "../../types/event";

type QueryResponse = {
    getEvent: Event;
};

type RouteParams = {
    eventId: string;
};

const BasicTrialConfig = () => {
    const { eventId } = useParams<RouteParams>();
    const { data, loading, error } = useQuery<QueryResponse>(GET_EVENT, { variables: { eventId } });
    const { user } = useAuth0();
    const userId = !!user ? user["https://graph.appgility.com/personId"] : "";
    const [showError, setShowError] = React.useState(false);

    const [updateEvent, result] = useMutation(UPDATE_EVENT, {
        refetchQueries: [
            { query: GET_EVENT, variables: { eventId: eventId } },
            { query: GET_PERSON_EVENTS, variables: { personId: userId } },
        ],
    });

    const validationSchema = Yup.object().shape({
        locationCity: Yup.string().required("Required"),
        locationState: Yup.string().required("Required"),
        trialSite: Yup.string().required("Required"),
        hostClub: Yup.string().required("Required"),
    });

    const initialValues =
        !!data && !!data.getEvent && !loading
            ? {
                  eventNumber: data.getEvent.eventNumber,
                  hostClub: data.getEvent.hostClub,
                  locationCity: data.getEvent.locationCity,
                  locationState: data.getEvent.locationState,
                  trialSite: data.getEvent.trialSite,
                  trialChairName: data.getEvent.trialChairName,
                  trialChairEmail: data.getEvent.trialChairEmail,
                  trialChairPhone: data.getEvent.trialChairPhone,
              }
            : {
                  eventNumber: "",
                  hostClub: "",
                  locationCity: "",
                  locationState: "",
                  trialSite: "",
                  trialChairName: "",
                  trialChairEmail: "",
                  trialChairPhone: "",
              };

    const formik = useFormik({
        initialValues,
        onSubmit: (values) => {
            if (!!data && !!data.getEvent) {
                const updatedEvent = { ...data.getEvent };
                updatedEvent.eventNumber = values.eventNumber;
                updatedEvent.locationCity = values.locationCity;
                updatedEvent.locationState = values.locationState;
                updatedEvent.trialSite = values.trialSite;
                updatedEvent.hostClub = values.hostClub;
                updatedEvent.trialChairName = values.trialChairName;
                updatedEvent.trialChairEmail = values.trialChairEmail;
                updatedEvent.trialChairPhone = values.trialChairPhone;

                updateEvent({ variables: { eventId, personId: userId, updatedEvent } }).catch((e) => {
                    setShowError(true);
                });
            }
        },
        validationSchema,
        enableReinitialize: true,
    });

    return loading ? (
        <div className="h-100">
            <Spinner animation="border" />
        </div>
    ) : (
        <>
            <Form onSubmit={formik.handleSubmit}>
                {result.called && !!result.data ? <Alert variant="success">Event data updated succesfully</Alert> : null}
                {result.error && showError ? <Alert variant="danger">{result.error.message}</Alert> : null}
                {!!error ? <Alert variant="danger">{error.message}</Alert> : null}
                <div className="row pb-3">
                    <div className="col">
                        <Form.Label>Event Number</Form.Label>
                        <Form.Control
                            id="eventNumber"
                            name="eventNumber"
                            placeholder="Event Number"
                            value={formik.values.eventNumber as string}
                            onChange={formik.handleChange}
                            isInvalid={!!formik.errors.eventNumber && !!formik.touched.eventNumber}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.hostClub}</Form.Control.Feedback>
                    </div>
                </div>
                <div className="row pb-3">
                    <div className="col">
                        <Form.Label>Host Club</Form.Label>
                        <Form.Control
                            id="hostClub"
                            name="hostClub"
                            placeholder="Host Club"
                            value={formik.values.hostClub as string}
                            onChange={formik.handleChange}
                            isInvalid={!!formik.errors.hostClub && !!formik.touched.hostClub}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.hostClub}</Form.Control.Feedback>
                    </div>
                </div>
                <div className="row pb-3">
                    <div className="col-xl-6 col-md-12">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            id="locationCity"
                            placeholder="City"
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
                            id="locationState"
                            placeholder="State"
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
                            id="trialSite"
                            placeholder="Trial Site"
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
                            id="trialChairName"
                            placeholder="Name"
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
                            id="trialChairEmail"
                            placeholder="Email"
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
                            id="trialChairPhone"
                            placeholder="Phone"
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
                <Button type="submit">{result.loading ? <Spinner animation="border" /> : "Submit"}</Button>
            </Form>
        </>
    );
};

export default BasicTrialConfig;
