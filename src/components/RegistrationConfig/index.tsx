import { useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import * as Yup from "yup";
import React from "react";
import { useParams } from "react-router-dom";
import { Spinner, Form, Alert, Button } from "react-bootstrap";
import { GET_EVENT, GET_PERSON_EVENTS, UPDATE_EVENT } from "../../queries/trials/trials";
import { Formik, FieldArray } from "formik";
import { Event } from "../../types/event";
import { X } from "react-feather";
import NumberFormat from "react-number-format";
import { parseInputDate, parseTimeStamp } from "../../utils/dates";

type RouteParams = {
    eventId: string;
};

type QueryResponse = {
    getEvent: Event;
};

type Price = {
    price: string;
};

type InitialValues = {
    openingDate: string | undefined | null;
    closingDate: string | undefined | null;
    runPrices: Price[];
};

const RegistrationConfig = () => {
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
        openingDate: Yup.string().required("Required"),
        closingDate: Yup.string().required("Required"),
        runPrices: Yup.array()
            .of(
                Yup.object().shape({
                    price: Yup.number().min(0, "Minimum price is 0").required("Required"),
                }),
            )
            .min(1, "Must have at least one price")
            .max(6, "No more than 6 prices allowed"),
    });

    const initialValues: InitialValues =
        !!data && !!data.getEvent && !loading
            ? {
                  openingDate: parseTimeStamp(data.getEvent.openingDate as string, "yyyy-MM-dd"),
                  closingDate: parseTimeStamp(data.getEvent.closingDate as string, "yyyy-MM-dd"),
                  runPrices: !!data.getEvent.runPrices
                      ? data.getEvent.runPrices.map((rawPrice) => {
                            const price: Price = { price: !!rawPrice ? `${rawPrice / 100}` : "0" };
                            return price;
                        })
                      : [],
              }
            : {
                  openingDate: "",
                  closingDate: "",
                  runPrices: [],
              };

    return loading ? (
        <div className="h-100">
            <Spinner animation="border" />
        </div>
    ) : (
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
                if (!!data && !!data.getEvent) {
                    const updatedEvent = { ...data.getEvent };
                    updatedEvent.openingDate = parseInputDate(values.openingDate);
                    updatedEvent.closingDate = parseInputDate(values.closingDate);
                    updatedEvent.runPrices = values.runPrices.map(({ price }) => {
                        return Math.floor(parseFloat(price) * 100);
                    });

                    updateEvent({
                        variables: {
                            eventId,
                            personId: userId,
                            updatedEvent,
                        },
                    }).catch(() => {
                        setShowError(true);
                    });
                }
            }}
            validationSchema={validationSchema}
            enableReinitialize={true}
        >
            {(formik) => (
                <Form onSubmit={formik.handleSubmit}>
                    {result.called && !!result.data ? <Alert variant="success">Event data updated succesfully</Alert> : null}
                    {result.error && showError ? <Alert variant="danger">{result.error.message}</Alert> : null}
                    {!!error ? <Alert variant="danger">{error.message}</Alert> : null}

                    <div className="row pb-3">
                        <div className="col-xl-6 col-md-12">
                            <Form.Label>Opening Date</Form.Label>
                            <Form.Control
                                id="openingDate"
                                name="openingDate"
                                type="date"
                                onChange={formik.handleChange}
                                value={formik.values.openingDate as string}
                                isInvalid={!!formik.errors.openingDate && !!formik.touched.openingDate}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.openingDate}</Form.Control.Feedback>
                        </div>
                        <div className="col-xl-6 col-md-12">
                            <Form.Label>Closing Date</Form.Label>
                            <Form.Control
                                id="closingDate"
                                name="closingDate"
                                type="date"
                                onChange={formik.handleChange}
                                value={formik.values.closingDate as string}
                                isInvalid={!!formik.errors.closingDate && !!formik.touched.closingDate}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.closingDate}</Form.Control.Feedback>
                        </div>
                    </div>
                    <div className="row pb-3">
                        <div className="col-xl-6 col-md-12">
                            <h4 className="text-body">Trial Prices (limit 6)</h4>
                            <FieldArray name="runPrices">
                                {({ push, remove }) => (
                                    <div>
                                        <div className="pb-3">
                                            <button className="btn btn-white" type="button" onClick={() => push({ price: "" })}>
                                                Add Price
                                            </button>
                                        </div>
                                        {typeof formik.errors.runPrices === "string" ? <Alert variant="danger">{formik.errors.runPrices}</Alert> : null}
                                        {formik.values.runPrices.map((runPrice, index) => (
                                            <div className="d-flex pb-3">
                                                <div className="me-3">
                                                    <Form.Control
                                                        name={`runPrices[${index}].price`}
                                                        as={NumberFormat}
                                                        prefix="$"
                                                        onValueChange={(values: any) => {
                                                            formik.setFieldValue(`runPrices[${index}].price`, values.value);
                                                        }}
                                                        value={formik.values.runPrices[index].price}
                                                        isInvalid={
                                                            !!formik.getFieldMeta(`runPrices[${index}].price`).error &&
                                                            !!formik.getFieldMeta(`runPrices[${index}].price`).touched
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {formik.getFieldMeta(`runPrices[${index}].price`).error}
                                                    </Form.Control.Feedback>
                                                </div>
                                                <button className="btn btn-white btn-rounded-circle" type="button" onClick={() => remove(index)}>
                                                    <X size="1em" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </FieldArray>
                        </div>
                    </div>
                    <Button type="button" onClick={() => formik.submitForm()}>
                        {result.loading ? <Spinner animation="border" /> : "Submit"}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default RegistrationConfig;
