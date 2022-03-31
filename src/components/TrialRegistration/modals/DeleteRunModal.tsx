import React from "react";
import { Modal, Form, Spinner } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { DELETE_RUN } from "../queries";
import { Run } from "../../../types/run";
import { useParams } from "react-router-dom";

type OwnProps = {
    run: Run;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

type ConfigureParams = {
    trialId: string;
    eventId: string;
};

const DeleteRunModal = ({ run, setShowModal }: OwnProps) => {
    const { trialId, eventId } = useParams<ConfigureParams>();
    const [deleteRun, { loading }] = useMutation(DELETE_RUN, {
        update: (cache, { data: { deleteRun } }) => {
            cache.modify({
                fields: {
                    getTrialRunsPaginated(paginatedRunResponse) {
                        const updatedResponse = { ...paginatedRunResponse };
                        const updatedRuns = updatedResponse.runs.filter((run: Run) => deleteRun.runId !== run.runId);
                        updatedResponse.runs = updatedRuns;
                    },
                },
            });
            setShowModal(false);
        },
    });

    return (
        <>
            <Modal.Header>
                <Modal.Title>Delete Run</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you would like to delete this run?</Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={() => deleteRun({ variables: { eventId, trialId, runId: run.runId } })}>
                    {loading ? <Spinner animation="border" /> : "Delete"}
                </button>
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                    Cancel
                </button>
            </Modal.Footer>
        </>
    );
};

export default DeleteRunModal;
