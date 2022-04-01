import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useFormik } from "formik";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { ADD_NEW_EVENT, GET_PERSON_EVENTS } from "../../queries/trials/trials";

interface InitialValues {
    eventNumber: string;
    locationCity: string;
    locationState: string;
    trialSite?: string;
    hostClub?: string;
}

interface OwnProps {
    showDialog: boolean;
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddNewTrial = ({ showDialog, setShowDialog }: OwnProps) => {
    const { user } = useAuth0();
    const userId = !!user ? user["https://graph.appgility.com/personId"] : "";

    const [addNewEvent, result] = useMutation(ADD_NEW_EVENT, {
        update: () => setShowDialog(false),
        refetchQueries: [{ query: GET_PERSON_EVENTS, variables: { personId: userId } }],
    });
    const formik = useFormik({
        initialValues: {
            eventNumber: "",
            locationCity: "",
            locationState: "",
            trialSite: "",
            hostClub: "",
        },
        onSubmit: (values: InitialValues) => {
            addNewEvent({
                variables: {
                    data: values,
                    personId: userId,
                },
            });
        },
        validate: (values: InitialValues) => {
            const errors: any = {};
            if (!values.eventNumber) {
                errors.eventNumber = "Required";
            }

            if (!values.hostClub) {
                errors.hostClub = "Required";
            }

            if (!values.locationCity) {
                errors.locationCity = "Required";
            }

            if (!values.locationState) {
                errors.locationState = "Required";
            }

            if (!values.trialSite) {
                errors.trialSite = "Required";
            }

            return errors;
        },
    });

    return (
        <>
            <Modal className="modal-lighter" centered show={showDialog} onHide={() => setShowDialog(false)}>
                <Modal.Header>
                    <Modal.Title>Create New Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="form-group">
                            <Form.Label>Event Number</Form.Label>
                            <Form.Control
                                id="eventNumber"
                                name="eventNumber"
                                value={formik.values.eventNumber}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.eventNumber && !!formik.touched.eventNumber}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.hostClub}</Form.Control.Feedback>
                        </div>
                        <div className="form-group">
                            <Form.Label>Host Club</Form.Label>
                            <Form.Control
                                id="hostClub"
                                name="hostClub"
                                value={formik.values.hostClub}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.hostClub && !!formik.touched.hostClub}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.hostClub}</Form.Control.Feedback>
                        </div>
                        <div className="form-group">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                id="locationCity"
                                name="locationCity"
                                value={formik.values.locationCity}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.locationCity && !!formik.touched.locationCity}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.locationCity}</Form.Control.Feedback>
                        </div>
                        <div className="form-group">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                                id="locationState"
                                name="locationState"
                                value={formik.values.locationState}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.locationState && !!formik.touched.locationState}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.locationState}</Form.Control.Feedback>
                        </div>
                        <div className="form-group">
                            <Form.Label>Trial Site</Form.Label>
                            <Form.Control
                                id="trialSite"
                                name="trialSite"
                                value={formik.values.trialSite}
                                onChange={formik.handleChange}
                                isInvalid={!!formik.errors.trialSite && !!formik.touched.trialSite}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.trialSite}</Form.Control.Feedback>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => formik.handleSubmit()}>{result.loading ? <Spinner animation="border" /> : "Add Event"}</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddNewTrial;
