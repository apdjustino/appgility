import React from "react";
import { Card, Modal } from "react-bootstrap";
import { Edit } from "react-feather";
import { parseTimeStamp } from "../../utils/dates";
import { chunk } from "lodash";
import { EventTrial } from "../../types/trial";
import AddTrial from "../AddTrial";
import { Judge } from "../../types/person";

type OwnProps = {
    trials: EventTrial[];
    selectedTrial: string;
    addTrialModal: boolean;
    setSelectedTrial: React.Dispatch<React.SetStateAction<string>>;
    setAddTrialModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const TrialCards = ({ trials, selectedTrial, addTrialModal, setSelectedTrial, setAddTrialModal }: OwnProps) => {
    const chunkedTrials = chunk(trials, 3);

    return (
        <>
            {trials.length > 0 ? (
                chunkedTrials.map((trialSet, i) => (
                    <div className="row py-4" key={`trialSet-${i}`}>
                        {trialSet.map((trial) => (
                            <div key={trial.trialId} className="col-md-4 col-12">
                                <div className="card card-fill" key={`trial-card-${trial.id}`}>
                                    <div className="card-header">
                                        <h4 className="card-header-title">{parseTimeStamp(trial.trialDate, "EEEE MMMM  do, y")}</h4>
                                        <button
                                            className="btn btn-rounded-circle"
                                            onClick={() => {
                                                setSelectedTrial(trial.trialId);
                                                setAddTrialModal(true);
                                            }}
                                        >
                                            <Edit />
                                        </button>
                                    </div>

                                    <div className="card-body" style={{ marginTop: "0px" }}>
                                        <div className="row py-2">
                                            <Card.Text>
                                                <div>
                                                    Run Limit: <span>{trial.runLimit}</span>
                                                </div>
                                                <div>
                                                    Online Entries: <span>{trial.onlineEntries}</span>
                                                </div>
                                                <div>
                                                    Mail-in Entries: <span>{trial.mailEntries}</span>
                                                </div>
                                                <div>
                                                    Allow Day to Day Moveups: <span>{!!trial.dayToDayMoveup ? trial.dayToDayMoveup.toString() : "false"}</span>
                                                </div>
                                                {!!trial.judges && trial.judges.length > 0 ? (
                                                    <div>Judges: {trial.judges.map((judge) => (judge as Judge).name).join(", ")}</div>
                                                ) : null}
                                            </Card.Text>
                                        </div>
                                        <div className="row py-2">
                                            <div className="list-group list-group-focus">
                                                {!!trial.standardAbility && trial.standardAbility.length > 0 ? (
                                                    <div className="list-group-item">
                                                        <h4 className="text-body text-focus mb-1 fw-bold">Standard:</h4>
                                                        <p className="text-muted mb-0">{trial.standardAbility?.map((x) => x?.label).join(", ")}</p>
                                                    </div>
                                                ) : null}

                                                {!!trial.standardPreferred && trial.standardPreferred.length > 0 ? (
                                                    <div className="list-group-item">
                                                        <h4 className="text-body text-focus mb-1 fw-bold">Standard Preferred:</h4>
                                                        <p className="text-muted mb-0">{trial.standardPreferred?.map((x) => x?.label).join(", ")}</p>
                                                    </div>
                                                ) : null}

                                                {!!trial.jumpersAbility && trial.jumpersAbility.length > 0 ? (
                                                    <div className="list-group-item">
                                                        <h4 className="text-body text-focus mb-1 fw-bold">Jumpers:</h4>
                                                        <p className="text-muted mb-0">{trial.jumpersAbility?.map((x) => x?.label).join(", ")}</p>
                                                    </div>
                                                ) : null}

                                                {!!trial.jumpersPreferred && trial.jumpersPreferred.length > 0 ? (
                                                    <div className="list-group-item">
                                                        <h4 className="text-body text-focus mb-1 fw-bold">Jumpers Preferred:</h4>
                                                        <p className="text-muted mb-0">{trial.jumpersPreferred?.map((x) => x?.label).join(", ")}</p>
                                                    </div>
                                                ) : null}

                                                {!!trial.fastAbility && trial.fastAbility.length > 0 ? (
                                                    <div className="list-group-item">
                                                        <h4 className="text-body text-focus mb-1 fw-bold">FAST:</h4>
                                                        <p className="text-muted mb-0">{trial.fastAbility?.map((x) => x?.label).join(", ")}</p>
                                                    </div>
                                                ) : null}

                                                {!!trial.fastPreferred && trial.fastPreferred.length > 0 ? (
                                                    <div className="list-group-item">
                                                        <h4 className="text-body text-focus mb-1 fw-bold">FAST Preferred:</h4>
                                                        <p className="text-muted mb-0">{trial.fastPreferred?.map((x) => x?.label).join(", ")}</p>
                                                    </div>
                                                ) : null}

                                                {trial.t2bClass ? <div className="list-group-item fw-bold">T2B</div> : null}
                                                {trial.premierStandard ? <div className="list-group-item fw-bold">Premier Standard</div> : null}
                                                {trial.premierJumpers ? <div className="list-group-item fw-bold">Premier Jumpers</div> : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <div className="d-flex flex-column justify-content-center align-items-center my-6">
                    <h2 className="text-body fst-italic">No Trials Found</h2>
                </div>
            )}
            <Modal className="modal-lighter modal-card" centered show={addTrialModal} onHide={() => setAddTrialModal(false)}>
                <Modal.Header>
                    <Modal.Title>{selectedTrial === "" ? "Add Trial" : "Edit Trial"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddTrial trialId={selectedTrial} onHide={() => setAddTrialModal(false)} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default TrialCards;
