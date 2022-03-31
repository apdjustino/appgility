import React from "react";
import { Modal } from "react-bootstrap";

type OwnProps = {
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setHideWarning: React.Dispatch<React.SetStateAction<boolean>>;
};

const MoveupsWarning = ({ setShowModal, setHideWarning }: OwnProps) => {
    return (
        <>
            <Modal.Header>
                <Modal.Title>Move-ups Ineligible</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4 className="text-body text-focus mb-3">
                    Move-ups are may not be processed after 6:00pm on the Monday preceding the set of trials starting on Thursday - Sunday.
                </h4>
                <h4 className="text-body text-focus mb-1">
                    For trials starting Monday - Wednesday move-ups may not be processed after 7 days prior the first trial.
                </h4>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-white" onClick={() => setShowModal(false)}>
                    Cancel
                </button>
                <button className="btn btn-primary" onClick={() => setHideWarning(true)}>
                    Proceed Anyway
                </button>
            </Modal.Footer>
        </>
    );
};

export default MoveupsWarning;
