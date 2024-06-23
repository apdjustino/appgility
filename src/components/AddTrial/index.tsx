import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import * as Yup from "yup";
import { Spinner, Form, Alert, Button, Dropdown, Card } from "react-bootstrap";
import { useFormik, Formik } from "formik";
import { ADD_TRIAL, GET_EVENT_TRIAL, GET_TRIALS, UPDATE_TRIAL } from "../../queries/trials/trials";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { parseInputDate, parseTimeStamp } from "../../utils/dates";

import { Judge } from "../../types/person";

type ClassesOptions = {
    label: string;
    value: string;
};

type ownProps = {
    trialId: string;
    onHide: () => void;
};

type ConfigureParams = {
    eventId: string;
};

const AddTrial = ({ trialId, onHide }: ownProps) => {
    const classesOptions: ClassesOptions[] = [
        { label: "Novice A", value: "NOVICE_A" },
        { label: "Novice B", value: "NOVICE_B" },
        { label: "Open", value: "OPEN" },
        { label: "Excellent", value: "EXCELLENT" },
        { label: "Masters", value: "MASTERS" },
    ];

    const validationSchema = Yup.object().shape({
        trialDate: Yup.string().required("Required"),
        mailEntries: Yup.number().min(1, "Minimium is 1 entries").required("Required"),
        onlineEntries: Yup.number().min(1, "Minimium is 1 entries").required("Required"),
        runLimit: Yup.number().min(1, "At least one run is required").required("Required"),
        standardAbility: Yup.array().when("standardClass", {
            is: true,
            then: Yup.array().required("At least one ability is required").nullable(),
            otherwise: Yup.array().nullable(),
        }),
        standardPreferred: Yup.array().when("standardClass", {
            is: true,
            then: Yup.array().required("At least one ability is required").nullable(),
            otherwise: Yup.array().nullable(),
        }),
        jumpersAbility: Yup.array().when("jumpersClass", {
            is: true,
            then: Yup.array().required("At least one ability is required").nullable(),
            otherwise: Yup.array().nullable(),
        }),
        jumpersPreferred: Yup.array().when("jumpersClass", {
            is: true,
            then: Yup.array().required("At least one ability is required").nullable(),
            otherwise: Yup.array().nullable(),
        }),
        fastAbility: Yup.array().when("fastClass", {
            is: true,
            then: Yup.array().required("At least one ability is required").nullable(),
            otherwise: Yup.array().nullable(),
        }),
        fastPreferred: Yup.array().when("fastClass", {
            is: true,
            then: Yup.array().required("At least one ability is required").nullable(),
            otherwise: Yup.array().nullable(),
        }),
    });

    const judgeValidationSchema = Yup.object().shape({
        name: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email format"),
        phone: Yup.string(),
        akcIdentifier: Yup.string(),
    });

    const params = useParams<ConfigureParams>();
    const [showError, setShowError] = useState(false);
    const [judgesIsOpen, setJudgesIsOpen] = useState<boolean>(false);
    const [judges, setJudges] = useState<Judge[]>([]);

    const trialQuery = useQuery(GET_EVENT_TRIAL, { variables: { trialId: trialId, eventId: params.eventId } });

    const [addTrial, result] = useMutation(ADD_TRIAL, {
        refetchQueries: [{ query: GET_TRIALS, variables: { eventId: params.eventId } }],
    });

    const [updateTrial, updateResult] = useMutation(UPDATE_TRIAL, {
        refetchQueries: [{ query: GET_TRIALS, variables: { eventId: params.eventId } }],
    });

    const judgeFormInitialValues: Judge = {
        name: "",
        email: "",
        phone: "",
        akcIdentifier: "",
    };

    React.useEffect(() => {
        if (!!trialQuery.data && !!trialQuery.data.getEventTrial && !!trialQuery.data.getEventTrial.judges && trialQuery.data.getEventTrial.judges.length > 0) {
            setJudges(trialQuery.data.getEventTrial.judges);
        }
    }, [trialQuery.data]);

    const formik = useFormik({
        initialValues: !trialQuery.data
            ? {
                  standardClass: false,
                  jumpersClass: false,
                  fastClass: false,
                  t2bClass: false,
                  premierStandard: false,
                  premierJumpers: false,
                  standardAbility: [
                      { label: "Novice A", value: "NOVICE_A" },
                      { label: "Novice B", value: "NOVICE_B" },
                      { label: "Open", value: "OPEN" },
                      { label: "Excellent", value: "EXCELLENT" },
                      { label: "Masters", value: "MASTERS" },
                  ],
                  standardPreferred: [
                      { label: "Novice A", value: "NOVICE_A" },
                      { label: "Novice B", value: "NOVICE_B" },
                      { label: "Open", value: "OPEN" },
                      { label: "Excellent", value: "EXCELLENT" },
                      { label: "Masters", value: "MASTERS" },
                  ],
                  jumpersAbility: [
                      { label: "Novice A", value: "NOVICE_A" },
                      { label: "Novice B", value: "NOVICE_B" },
                      { label: "Open", value: "OPEN" },
                      { label: "Excellent", value: "EXCELLENT" },
                      { label: "Masters", value: "MASTERS" },
                  ],
                  jumpersPreferred: [
                      { label: "Novice A", value: "NOVICE_A" },
                      { label: "Novice B", value: "NOVICE_B" },
                      { label: "Open", value: "OPEN" },
                      { label: "Excellent", value: "EXCELLENT" },
                      { label: "Masters", value: "MASTERS" },
                  ],
                  fastAbility: [
                      { label: "Novice A", value: "NOVICE_A" },
                      { label: "Novice B", value: "NOVICE_B" },
                      { label: "Open", value: "OPEN" },
                      { label: "Excellent", value: "EXCELLENT" },
                      { label: "Masters", value: "MASTERS" },
                  ],
                  fastPreferred: [
                      { label: "Novice A", value: "NOVICE_A" },
                      { label: "Novice B", value: "NOVICE_B" },
                      { label: "Open", value: "OPEN" },
                      { label: "Excellent", value: "EXCELLENT" },
                      { label: "Masters", value: "MASTERS" },
                  ],
              }
            : { ...trialQuery.data.getEventTrial, trialDate: parseTimeStamp(trialQuery.data.getEventTrial.trialDate, "yyyy-MM-dd") },
        onSubmit: (values) => {
            if (trialId && trialId !== "") {
                const trialToUpdate = { ...trialQuery.data.getEventTrial };

                Object.keys(trialToUpdate).forEach((key) => {
                    trialToUpdate[key] = (values as any)[key];
                });

                const newTrialDate = parseInputDate(trialToUpdate.trialDate);
                trialToUpdate.trialDate = newTrialDate;

                trialToUpdate["judges"] = judges;
                trialToUpdate["dayToDayMoveup"] = values.dayToDayMoveup;

                updateTrial({
                    variables: {
                        trialId,
                        eventId: params.eventId,
                        eventTrial: trialToUpdate,
                    },
                })
                    .then(() => {
                        onHide();
                    })
                    .catch(() => {
                        setShowError(true);
                    });
                return;
            }

            const addNewTrial = { ...values };
            addNewTrial.eventId = params.eventId;

            const newTrialDate = parseInputDate(addNewTrial.trialDate);
            addNewTrial.trialDate = newTrialDate;

            addNewTrial.judges = judges;

            addTrial({ variables: { eventTrial: addNewTrial } })
                .catch(() => {
                    setShowError(true);
                })
                .then(() => {
                    onHide();
                })
                .catch(() => {
                    setShowError(true);
                });
        },
        enableReinitialize: true,
        validationSchema,
    });

    return trialQuery.loading ? (
        <div className="h-100">
            <Spinner animation="border" />
        </div>
    ) : (
        <>
            <Form onSubmit={() => formik.handleSubmit()}>
                {(result.called && !!result.data) || (updateResult.called && !!updateResult.data) ? (
                    <Alert variant="success">Event data updated succesfully</Alert>
                ) : null}
                {result.error && showError ? (
                    <Alert variant="danger">{result.error.message}</Alert>
                ) : updateResult.error && showError ? (
                    <Alert variant="danger">{updateResult.error.message}</Alert>
                ) : null}
                <div>
                    <>
                        <div className="row pb-2">
                            <div className="col-12">
                                <div className="form-group">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control
                                        id="trialDate"
                                        name="trialDate"
                                        value={formik.values.trialDate}
                                        onChange={formik.handleChange}
                                        type="date"
                                        isInvalid={!!formik.errors.trialDate && !!formik.touched.trialDate}
                                    />
                                    <Form.Control.Feedback type="invalid">{formik.errors.trialDate as string}</Form.Control.Feedback>
                                </div>
                            </div>
                        </div>
                        <div className="row pb-2">
                            <div className="col-6">
                                <div className="form-group">
                                    <Form.Label>Online Entries</Form.Label>
                                    <Form.Control
                                        id="onlineEntries"
                                        name="onlineEntries"
                                        value={formik.values.onlineEntries}
                                        onChange={formik.handleChange}
                                        type="number"
                                        isInvalid={!!formik.errors.onlineEntries && !!formik.touched.onlineEntries}
                                    />
                                    <Form.Control.Feedback type="invalid">{formik.errors.onlineEntries as string}</Form.Control.Feedback>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="form-group">
                                    <Form.Label>Mail-in Entries</Form.Label>
                                    <Form.Control
                                        id="mailEntries"
                                        name="mailEntries"
                                        value={formik.values.mailEntries}
                                        type="number"
                                        onChange={formik.handleChange}
                                        isInvalid={!!formik.errors.mailEntries && !!formik.touched.mailEntries}
                                    />
                                    <Form.Control.Feedback type="invalid">{formik.errors.mailEntries as string}</Form.Control.Feedback>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <Form.Label>Run Limit</Form.Label>
                            <Form.Control
                                id="runLimit"
                                name="runLimit"
                                value={formik.values.runLimit}
                                onChange={formik.handleChange}
                                type="number"
                                isInvalid={!!formik.errors.runLimit && !!formik.touched.runLimit}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.runLimit as string}</Form.Control.Feedback>
                        </div>

                        <div className="form-group">
                            <Form.Check
                                name="dayToDayMoveup"
                                label="Allow Day to Day Move ups"
                                value={formik.values.dayToDayMoveup}
                                checked={formik.values.dayToDayMoveup}
                                onChange={formik.handleChange}
                                type="checkbox"
                            />
                        </div>

                        <div className="row mb-3">
                            <div className="col d-flex">
                                <div className="pe-3">
                                    <Form.Label>Judges: </Form.Label>
                                </div>
                                {judges.length > 0
                                    ? judges.map((judge) => (
                                          <div className="btn btn-white btn-sm d-inline-block me-3" style={{ cursor: "default" }}>
                                              <span className="align-middle">{judge.name}</span>
                                              <i
                                                  className="fe fe-x-circle ps-2 align-middle"
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() => {
                                                      const newJudges = judges.filter((j) => j.name !== judge.name);
                                                      setJudges(newJudges);
                                                  }}
                                              ></i>
                                          </div>
                                      ))
                                    : null}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col d-flex">
                                <div className="pe-3">
                                    <Dropdown show={judgesIsOpen} onToggle={() => setJudgesIsOpen(!judgesIsOpen)}>
                                        <Dropdown.Toggle
                                            as="button"
                                            className="btn btn-white btn-sm"
                                            type="button"
                                            onClick={() => setJudgesIsOpen(!judgesIsOpen)}
                                        >
                                            Add Judge
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Card.Body style={{ minWidth: "300px" }}>
                                                <Formik
                                                    initialValues={judgeFormInitialValues}
                                                    onSubmit={(values, { resetForm }) => {
                                                        const newJudges = [...judges];
                                                        newJudges.push(values);
                                                        setJudges(newJudges);
                                                        resetForm();
                                                    }}
                                                    validationSchema={judgeValidationSchema}
                                                >
                                                    {({ values, errors, touched, submitForm, handleChange }) => (
                                                        <Form>
                                                            <div className="row">
                                                                <div className="col">
                                                                    <Form.Label>Name</Form.Label>
                                                                    <Form.Control
                                                                        name="name"
                                                                        value={values.name}
                                                                        onChange={handleChange}
                                                                        isInvalid={!!errors.name && !!touched.name}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                                                    <Form.Label>Email</Form.Label>
                                                                    <Form.Control
                                                                        name="email"
                                                                        value={values.email as string}
                                                                        onChange={handleChange}
                                                                        isInvalid={!!errors.email && !!touched.email}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                                                    <Form.Label>Phone</Form.Label>
                                                                    <Form.Control
                                                                        name="phone"
                                                                        value={values.phone as string}
                                                                        onChange={handleChange}
                                                                        isInvalid={!!errors.phone && !!touched.phone}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                                                                    <Form.Label>AKC Id</Form.Label>
                                                                    <Form.Control
                                                                        name="akcIdentifier"
                                                                        value={values.akcIdentifier as string}
                                                                        onChange={handleChange}
                                                                        isInvalid={!!errors.akcIdentifier && !!touched.akcIdentifier}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">{errors.akcIdentifier}</Form.Control.Feedback>
                                                                    <div className="mt-3">
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-white"
                                                                            onClick={() => {
                                                                                submitForm();
                                                                                setJudgesIsOpen(false);
                                                                            }}
                                                                        >
                                                                            Add Judge
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Form>
                                                    )}
                                                </Formik>
                                            </Card.Body>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        <h5>Classes: </h5>
                        <div className="row">
                            <div className="col-3">
                                <Form.Check
                                    id="standardClass"
                                    name="standardClass"
                                    value={formik.values.standardClass}
                                    checked={formik.values.standardClass}
                                    onChange={formik.handleChange}
                                    type="checkbox"
                                    label="Standard"
                                    style={{ marginRight: "8px" }}
                                    isInvalid={!!formik.errors.standardClass}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.standardClass as string}</Form.Control.Feedback>
                            </div>
                            <div className="col-9">
                                {formik.values.standardClass ? (
                                    <div>
                                        <Form.Label>Regular</Form.Label>
                                        <Select
                                            id="standardAbility"
                                            name="standardAbility"
                                            value={formik.values.standardAbility}
                                            onChange={(newValue: any, actionMeta: any) => {
                                                formik.setFieldValue(`standardAbility`, newValue);
                                                formik.setFieldValue(`standardPreferred`, newValue);
                                            }}
                                            isMulti
                                            options={classesOptions}
                                        />
                                        {!!formik.errors.standardAbility ? (
                                            <Alert variant="danger" id="error-standard-ability">
                                                {formik.errors.standardAbility as string}
                                            </Alert>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <Form.Check
                                    id="jumpersClass"
                                    name="jumpersClass"
                                    value={formik.values.jumpersClass}
                                    checked={formik.values.jumpersClass}
                                    onChange={formik.handleChange}
                                    type="checkbox"
                                    label="JWW"
                                    style={{ marginRight: "8px" }}
                                    isInvalid={!!formik.errors.jumpersClass}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.jumpersClass as string}</Form.Control.Feedback>
                            </div>
                            <div className="col-9">
                                {formik.values.jumpersClass ? (
                                    <div>
                                        <Form.Label>Regular</Form.Label>
                                        <Select
                                            id="jumpersAbility"
                                            name="jumpersAbility"
                                            value={formik.values.jumpersAbility}
                                            onChange={(newValue: any, actionMeta: any) => {
                                                formik.setFieldValue(`jumpersAbility`, newValue);
                                                formik.setFieldValue(`jumpersPreferred`, newValue);
                                            }}
                                            isMulti
                                            options={classesOptions}
                                        />
                                        {!!formik.errors.jumpersAbility ? (
                                            <Alert variant="danger" id="error-standard-ability">
                                                {formik.errors.jumpersAbility as string}
                                            </Alert>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <Form.Check
                                    id="fastClass"
                                    name="fastClass"
                                    value={formik.values.fastClass}
                                    checked={formik.values.fastClass}
                                    onChange={formik.handleChange}
                                    label="FAST"
                                    type="checkbox"
                                    isInvalid={!!formik.errors.fastClass}
                                />
                                <Form.Control.Feedback type="invalid">{formik.errors.fastClass as string}</Form.Control.Feedback>
                            </div>
                            <div className="col-9">
                                {formik.values.fastClass ? (
                                    <div>
                                        <Form.Label>Regular</Form.Label>
                                        <Select
                                            id="fastAbility"
                                            name="fastAbility"
                                            value={formik.values.fastAbility}
                                            onChange={(newValue: any, actionMeta: any) => {
                                                formik.setFieldValue(`fastAbility`, newValue);
                                                formik.setFieldValue(`fastPreferred`, newValue);
                                            }}
                                            isMulti
                                            options={classesOptions}
                                        />
                                        {!!formik.errors.fastAbility ? (
                                            <Alert variant="danger" id="error-standard-ability">
                                                {formik.errors.fastAbility as string}
                                            </Alert>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <Form.Check
                            id="t2bClass"
                            name="t2bClass"
                            value={formik.values.t2bClass}
                            checked={formik.values.t2bClass}
                            onChange={formik.handleChange}
                            label="T2B"
                            type="checkbox"
                            isInvalid={!!formik.errors.t2bClass}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.t2bClass as string}</Form.Control.Feedback>
                        <Form.Check
                            id="premierStandard"
                            name="premierStandard"
                            value={formik.values.premierStandard}
                            checked={formik.values.premierStandard}
                            onChange={formik.handleChange}
                            label="Premier Standard"
                            type="checkbox"
                            isInvalid={!!formik.errors.premierStandard}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.premierStandard as string}</Form.Control.Feedback>
                        <Form.Check
                            id="premierJumpers"
                            name="premierJumpers"
                            value={formik.values.premierJumpers}
                            checked={formik.values.premierJumpers}
                            onChange={formik.handleChange}
                            label="Premier Jumpers"
                            isInvalid={!!formik.errors.premierJumpers}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.premierJumpers as string}</Form.Control.Feedback>
                        <br />
                    </>
                </div>
            </Form>
            <Button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    formik.submitForm();
                }}
            >
                {result.loading || updateResult.loading ? <Spinner animation="border" /> : "Submit"}
            </Button>
        </>
    );
};

export default AddTrial;
