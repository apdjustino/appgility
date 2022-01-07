import React from "react";
import { Nav, Button, Modal, Form, Alert } from "react-bootstrap";
import AddDog from "../AddDog";
import { EventTrial } from "../../types/trial";
import { AddRunDogView } from "../../types/person";
import { useQuery, useReactiveVar } from "@apollo/client";
import { CONFIG_NEW_RUN } from "../../queries/runs/runs";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { addRunFormVar } from "../../reactiveVars";
import AddRun from "../AddRun";
import { Formik } from "formik";
import { buildRunsToAdd, NewRunForm } from "../AddRun/utils";

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

type InitialValues = {
  trials: NewRunForm[]
}

const Step2 = ({ activeStep, setActiveStep }: OwnProps) => {
  const [showAddDogModal, setShowAddDogModal] = React.useState<boolean>(false);
  const { eventId } = useParams<Params>();  
  const [dogOptions, setDogOptions] = React.useState<DogOptions[]>([]);  
  const runFormData = useReactiveVar(addRunFormVar);
  const { data, loading, error } = useQuery<QueryResponse>(CONFIG_NEW_RUN, { variables: { eventId, personId: runFormData.personId }});
  const [showError, setShowError] = React.useState<string>("");    


  React.useEffect(() => {
    if (!!data && !!data.getPersonDogs) {
      const options: DogOptions[] = data.getPersonDogs.map(dog => ({
        label: dog.callName,
        value: dog.dogId
      }))

      setDogOptions(options);
    }
  }, [data, setDogOptions])

  const initialValues: InitialValues = {
    trials: !!data && !loading ? data.getEventTrials.map(trial => ({
      trialId: trial.trialId,
      trialDate: trial.trialDate as string,            
      standardPreferred: false,
      standardLevel: undefined,            
      standardHeight: undefined,            
      jumpersPreferred: false,
      jumpersLevel: undefined,
      jumpersHeight: undefined,            
      fastPreferred: false,
      fastLevel: undefined,
      fastHeight: undefined,                  
      t2bHeight: undefined,      
      premierStandardHeight: undefined,      
      premierJumpersHeight: undefined
    })) : []
  }

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-xs-12 col-md-10 col-lg-8 col-xl-6 text-center">
          <h6 className="mb-4 text-uppercase text-muted">Step {activeStep} of 3</h6>
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
              newRunFormData.dog = { callName: newValue.label, dogId: newValue.value };
              addRunFormVar(newRunFormData);
            }}
          />
        </div>
        <div className="col-auto d-flex align-items-end">
          <button className="btn btn-white mb-1" onClick={() => setShowAddDogModal(true)}>Add Dog</button>
        </div>
      </div>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values) => {
          const runs = buildRunsToAdd(eventId as string, values.trials, runFormData.personId, runFormData.dog)
          if (runs.length === 0) {
            setShowError("No runs to add.");
            return;
          }
          
          setShowError("");     

          const newRunFormData = { ...runFormData }
          newRunFormData.runs = runs;
          addRunFormVar(newRunFormData)
          setActiveStep(3);
        }}
        validate={({ trials }) => {
          let hasError = false
          const errors: any = { trials: trials.map(trial => (
            {
              standardLevel: undefined,
              standardHeight: undefined,              
              jumpersLevel: undefined,
              jumpersHeight: undefined,              
              fastLevel: undefined,
              fastHeight: undefined,                            
              t2bHeight: undefined,
              premierStandardHeight: undefined,
              premierJumpersHeight: undefined
            }))}
          trials.forEach((trial, index) => {            
            if (!!trial.standardLevel || !!trial.standardHeight) {
              if (!trial.standardLevel) {
                errors.trials[index].standardLevel = 'Level is required to add this run'
                hasError = true
              }
  
              if (!trial.standardHeight) {
                errors.trials[index].standardHeight = 'Height is required to add this run'
                hasError = true
              }
            }
            
            if (!!trial.jumpersLevel || !!trial.jumpersHeight) {
              if (!trial.jumpersLevel) {
                errors.trials[index].jumpersLevel = 'Level is required to add this run'
                hasError = true
              }
  
              if (!trial.jumpersHeight) {
                errors.trials[index].jumpersHeight = 'Height is required to add this run'
                hasError = true
              }            
            }
            

            if (!!trial.fastLevel || !!trial.fastHeight) {
              if (!trial.fastLevel) {
                errors.trials[index].fastLevel = 'Level is required to add this run'
                hasError = true
              }
  
              if (!trial.fastHeight) {
                errors.trials[index].fastHeight = 'Height is required to add this run'
                hasError = true
              }
            }                        
          })
          
          return hasError ? errors : {}
        }}
      >
        {(formik) => {          
          return (
            <>
            {!!runFormData.dog.dogId ? (
              <div className="row mb-3">
                <div className="col">
                  <AddRun formik={formik}/>
                </div>
              </div>
            ) : null}
            {!!showError ? (
              <Alert variant="danger">{showError}</Alert>
            ) : null}
            <hr className="my-5"/>
            <Nav className="row align-items-center">
              <div className="col-auto">
                <Button variant="white" type="button" size="lg" onClick={() => setActiveStep(1)}>Back</Button>
              </div>
              <div className="col text-center">
                <h6 className="text-uppercase text-muted mb-0">Step {activeStep} of 3</h6>
              </div>
              <div className="col-auto">
                <Button size="lg" type="button" onClick={() => formik.submitForm()}>
                  Next
                </Button>
              </div>
            </Nav>
          </>
          )          
        }}
      </Formik>             
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