import React from "react";
import { Nav, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";
import AddDog from "../AddDog";
import { EventTrial } from "../../types/trial";
import { AddRunDogView } from "../../types/person";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { ADD_NEW_RUN, CONFIG_NEW_RUN, GET_TRIAL_RUNS } from "../../queries/runs/runs";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { addRunFormVar } from "../../reactiveVars";
import AddRun from "../AddRun";
import { Formik } from "formik";
import { buildRunsToAdd, NewRunForm, Run, RunToAdd } from "../AddRun/utils";

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
  const { eventId, trialId } = useParams<Params>();  
  const [dogOptions, setDogOptions] = React.useState<DogOptions[]>([]);  
  const runFormData = useReactiveVar(addRunFormVar);
  const { data, loading, error } = useQuery<QueryResponse>(CONFIG_NEW_RUN, { variables: { eventId, personId: runFormData.personId }});
  const [addRun, result] = useMutation(ADD_NEW_RUN)
  const [showError, setShowError] = React.useState<string>("");  
  const navigate = useNavigate();

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
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values) => {
          const runs = buildRunsToAdd(values.trials, runFormData.personId, runFormData.dogId)
          if (runs.length === 0) {
            setShowError("No runs to add.");
            return;
          }
          console.log(runs);
          setShowError("");     
          runs.forEach((run: Run) => {
            addRun({ variables: {
              eventId,
              trialId: (run as RunToAdd).trialId,
              personId: (run as RunToAdd).personId,
              dogId: (run as RunToAdd).dogId,
              run: {
                agilityClass: (run as RunToAdd).agilityClass,
                level: (run as RunToAdd).level,
                jumpHeight: (run as RunToAdd).jumpHeight,
                preferred: (run as RunToAdd).preferred,
                group: (run as RunToAdd).group,
              }
            }, refetchQueries: [
              { query: GET_TRIAL_RUNS, variables: { trialId: (run as RunToAdd).trialId }}
            ]}).then((result) => {
              navigate("..");
            }).catch((e) => {
              setShowError(e.message)
            })
          })
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
            {!!runFormData.dogId ? (
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
                <h6 className="text-uppercase text-muted mb-0">Step {activeStep} of 2</h6>
              </div>
              <div className="col-auto">
                <Button size="lg" type="button" onClick={() => formik.submitForm()}>
                  {result.loading ? (
                    <Spinner animation="border" />
                  ) : "Finish"}
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