import React from "react";
import { Modal, Form, Spinner } from "react-bootstrap";
import Select from "react-select";
import { Formik } from "formik";
import { AgilityAbility, Run } from "../../../types/run";
import { SelectOptions } from "../../../types/generic";
import { useMutation } from "@apollo/client";
import { MOVE_UP } from "../queries";
import { useParams } from "react-router-dom";

type OwnProps = {
    run: Run;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type InitialValues = {
    level: SelectOptions<string>;
};

type ConfigureParams = {
    trialId: string;
    eventId: string;
};

const MoveupsModal = ({ run, setShowModal }: OwnProps) => {
    const { trialId, eventId } = useParams<ConfigureParams>();
    const [inValid, setInvalid] = React.useState<boolean>(false);

    const [moveUp, { loading }] = useMutation(MOVE_UP, {
        update: (cache, { data: { moveUp } }) => {
            cache.modify({
                fields: {
                    getTrialRunsPaginated(paginatedRunResponse) {
                        const updatedResponse = { ...paginatedRunResponse };
                        const updatedRuns = updatedResponse.runs.map((run: Run) => {
                            if (moveUp.runId === run.runId) {
                                const updatedRun = { ...run };
                                updatedRun.level = moveUp.level;
                                return updatedRun;
                            }
                            return run;
                        });

                        updatedResponse.runs = updatedRuns;
                        return updatedResponse;
                    },
                },
            });
            setShowModal(false);
        },
    });

    const levelOptions: SelectOptions<string>[] = [
        { label: "Novice", value: "NOVICE" },
        { label: "Open", value: "OPEN" },
        { label: "Excellent", value: "EXCELLENT" },
        { label: "Masters", value: "MASTERS" },
    ];

    const initialValues: InitialValues = {
        level: { label: "", value: "" },
    };
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
                if (values.level.value === "") {
                    setInvalid(true);
                    return;
                }
                setInvalid(false);
                const updatedRun = { ...run };
                updatedRun.level = values.level.value as AgilityAbility;
                moveUp({ variables: { eventId, trialId, runId: updatedRun.runId, newLevel: updatedRun.level } });
            }}
        >
            {(formik) => (
                <>
                    <Modal.Header>
                        <Modal.Title>Move-ups</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4 className="text-body text-focus mb-1 fw-bold">
                            {run.callName} - {run.agilityClass} - {run.level} - {run.jumpHeight} - Preferred: {run.preferred.toString()}
                        </h4>
                        <div className="row">
                            <div className="col">
                                <Form>
                                    <div className="form-group">
                                        <Form.Label>Move-up Level</Form.Label>
                                        <Form.Control
                                            name="level"
                                            placeholder="Updated Level"
                                            className="bg-transparent border-0 p-0"
                                            as={Select}
                                            options={levelOptions}
                                            value={formik.values.level as any}
                                            onChange={(newValue: any) => formik.setFieldValue("level", newValue)}
                                            isInvalid={inValid}
                                        />
                                        <Form.Control.Feedback type="invalid">Move-up level is required</Form.Control.Feedback>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-white"
                            onClick={() => {
                                setShowModal(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                formik.submitForm();
                            }}
                        >
                            {loading ? <Spinner animation="border" /> : "Save Changes"}
                        </button>
                    </Modal.Footer>
                </>
            )}
        </Formik>
    );
};

export default MoveupsModal;
