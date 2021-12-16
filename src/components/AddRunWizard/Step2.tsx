import React from "react";
import { Nav, Button, Modal, Form } from "react-bootstrap";
import AddDog from "../AddDog";
import { EventTrial } from "../../types/trial";
import { AddRunDogView } from "../../types/person";
import { useQuery, useReactiveVar } from "@apollo/client";
import { CONFIG_NEW_RUN } from "../../queries/runs/runs";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../utils/contexts"
import Select from "react-select";
import { addRunFormVar } from "../../reactiveVars";

type OwnProps ={ 
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

type QueryResponse = {
  getEventTrials: EventTrial[];
  getPersonDogs: AddRunDogView[];
}

type Params = {
  eventId: string;
  trialId: string;
}

type DogOptions = {
  label: string;
  value: string;
}

const Step2 = ({ activeStep, setActiveStep }: OwnProps) => {
  const [showAddDogModal, setShowAddDogModal] = React.useState<boolean>(false);
  const { eventId } = useParams<Params>();
  const { userId } = React.useContext(AuthContext)
  const [dogOptions, setDogOptions] = React.useState<DogOptions[]>([]);  
  const runFormData = useReactiveVar(addRunFormVar);
  const { data, loading, error } = useQuery<QueryResponse>(CONFIG_NEW_RUN, { variables: { eventId, personId: runFormData.personId }});

  React.useEffect(() => {
    if (!!data && !!data.getPersonDogs) {
      const options: DogOptions[] = data.getPersonDogs.map(dog => ({
        label: dog.callName,
        value: dog.dogId
      }))

      setDogOptions(options);
    }
  }, [data, setDogOptions])

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
          <Form.Label>Dogs</Form.Label>
          <Select
            options={dogOptions}
            placeholder="Choose a dog"
            noOptionsMessage={() => <strong>No dogs available, add a new one</strong>}
            onChange={(newValue: any) => {
              const newRunFormData = { ...runFormData };
              newRunFormData.dogId = newValue.value;
              addRunFormVar(newRunFormData);
            }}
          />
        </div>
        <div className="col-auto d-flex align-items-end">
          <button className="btn btn-white mb-1" onClick={() => setShowAddDogModal(true)}>Add Dog</button>
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
          <Modal.Title>Add New Dog</Modal.Title>          
        </Modal.Header>
        <Modal.Body>
          <AddDog setShowAddDogModal={setShowAddDogModal} />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Step2;