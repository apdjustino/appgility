import React from "react";
import { Form, InputGroup, Modal, Nav, Button } from "react-bootstrap";
import { Search } from "react-feather";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
import { useLazyQuery, useReactiveVar } from "@apollo/client";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { SEARCH_PERSON } from "./query";
import { addRunFormVar, selectedPersonForRunVar } from "../../reactiveVars";
import AddPerson from "../AddPerson";

type OwnProps = {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

export type PersonView = {
  personId: string;
  name: string;
  email: string;
}

type QueryResponse = {
  searchPerson:PersonView[]
}

const AsyncTypeaheadControl = AsyncTypeahead as any;

const Step1 = ({ activeStep, setActiveStep }: OwnProps) => {  
  const [options, setOptions] = React.useState<PersonView[]>([]);
  const [showAddPersonModal, setShowAddPersonModal] = React.useState<boolean>(false);
  const [searchPerson, { data, loading, error }] = useLazyQuery<QueryResponse>(SEARCH_PERSON);
  const runInfo = useReactiveVar(addRunFormVar);
  const selectedOption = useReactiveVar(selectedPersonForRunVar);

  React.useEffect(() => {
    if (!!data && !!data.searchPerson) {
      setOptions(data.searchPerson);
    }
  }, [data])

  const handleSearch = (query: string) => {
    searchPerson({ variables: { query }})
  };    

  const filterBy = () => true;

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-xs-12 col-md-10 col-lg-8 col-xl-6 text-center">
          <h6 className="mb-4 text-uppercase text-muted">Step {activeStep} of 2</h6>
          <h1 className="mb-3">Find an Exhibitor</h1>
          <p className="mb-5 text-muted">Search for an existing exhibitor or create a new exhibitor</p>
        </div>        
      </div>
      <div className="row">
        <div className="col">
          <div className="form-group">
            <AsyncTypeaheadControl 
              filterBy={filterBy}
              id="exhibitor search"
              isLoading={loading}
              labelKey="name"
              minLength={2}
              onSearch={handleSearch}
              options={options}
              useCache={false}
              onChange={(selected: PersonView[]) => {
                selectedPersonForRunVar([]);             
                if (selected.length > 0) {
                  addRunFormVar({ personId: selected[0].personId, runs: [], dogId: "" })
                  selectedPersonForRunVar(selected);
                }                                
              }}
              selected={selectedOption}
              renderMenuItemChildren={(option: PersonView, props: any) => {
                const splitString = option.name.split(" ")
                const firstInitial = splitString[0][0];
                const lastInitial = splitString[splitString.length - 1][0];
                return (
                  <>
                    <div className="avatar avatar-xs me-2" data-testid="user-icon-wrapper">
                      <span className="avatar-title rounded-circle">
                        {firstInitial}{lastInitial}
                      </span>
                    </div>                
                    <Highlighter search={props.text}>
                      {`${option.name} - ${option.email}`}
                    </Highlighter>
                  </>
                )
              }}
              renderInput={({ inputRef, referenceElementRef, ...inputProps }: any) => (
                <InputGroup className="input-group-merge input-group-reverse mb-3">
                  <Form.Control
                    {...inputProps}
                    placeholder="Search for exhibitor by email or name"
                    type="search"
                    ref={(input: any) => {
                      inputRef(input);
                      referenceElementRef(input);
                    }}
                  />
                  <InputGroup.Text>
                    <Search size="1em"/>
                  </InputGroup.Text>
                </InputGroup>
              )}
            />          
          </div>
        </div>
        <div className="col-auto">
          <button className="btn btn-white" onClick={() => setShowAddPersonModal(true)}>Add New Exhibitor</button>
        </div>
      </div>
      <hr className="my-5"/>
      <Nav className="row align-items-center">
        <div className="col-auto">
          <Button variant="white" type="button" size="lg">Cancel</Button>
        </div>
        <div className="col text-center">
          <h6 className="text-uppercase text-muted mb-0">Step {activeStep} of 2</h6>
        </div>
        <div className="col-auto">
          <Button size="lg" disabled={selectedOption.length === 0} onClick={() => setActiveStep(activeStep + 1)}>
            Next
          </Button>
        </div>
      </Nav>
      <Modal className="modal-lighter" centered show={showAddPersonModal} onHide={() => setShowAddPersonModal(false)}>
        <Modal.Header>
          <Modal.Title>Add New Exhibitor</Modal.Title>          
        </Modal.Header>
        <Modal.Body>
          <AddPerson setShowAddPersonModal={setShowAddPersonModal} />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Step1;