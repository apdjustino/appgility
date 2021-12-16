import React from "react";
import { Nav, Button, Modal } from "react-bootstrap";
import AddDog from "../AddDog";

type OwnProps ={ 
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const Step2 = ({ activeStep, setActiveStep }: OwnProps) => {
  const [showAddDogModal, setShowAddDogModal] = React.useState<boolean>(false);

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-xs-12 col-md-10 col-lg-8 col-xl-6 text-center">
          <h6 className="mb-4 text-uppercase text-muted">Step {activeStep} of 2</h6>
          <h1 className="mb-3">Create New Agility Runs</h1>
          <p className="mb-5 text-muted">Select or add a dog, then choose the classes and levels for the new agility runs.</p>
        </div>        
      </div>
      <div className="row">
        <div className="col">
          Stuff goes here
        </div>
        <div className="col-auto">
          <button className="btn btn-white" onClick={() => setShowAddDogModal(true)}>Add Dog</button>
        </div>
      </div>
      <hr className="my-5"/>
      <Nav className="row align-items-center">
        <div className="col-auto">
          <Button variant="white" type="button" size="lg" onClick={() => setActiveStep(1)}>Back</Button>
        </div>
        <div className="col text-center">
          <h6 className="text-uppercase text-muted mb-0">Step {activeStep} of 2</h6>
        </div>
        <div className="col-auto">
          <Button size="lg" disabled={true} onClick={() => {}}>
            Finish
          </Button>
        </div>
      </Nav>
      <Modal className="modal-lighter" centered show={showAddDogModal} onHide={() => setShowAddDogModal(false)}>
        <Modal.Header>
          <Modal.Title>Add New Exhibitor</Modal.Title>          
        </Modal.Header>
        <Modal.Body>
          <AddDog setShowAddDogModal={setShowAddDogModal} />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Step2;