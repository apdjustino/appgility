import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Search } from "react-feather";
import { AsyncTypeahead, Highlighter } from "react-bootstrap-typeahead";
import { useLazyQuery } from "@apollo/client";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { SEARCH_PERSON } from "./query";

type OwnProps = {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

type TestOptions = {
  avatar_url: string;
  id: string;
  login: string;
}

type PersonView = {
  personId: string;
  name: string;
  email: string;
}

type QueryResponse = {
  searchPerson:PersonView[]
}

const AsyncTypeaheadControl = AsyncTypeahead as any;

const SEARCH_URI = 'https://api.github.com/search/users';

const Step1 = ({ activeStep, setActiveStep }: OwnProps) => {  
  const [options, setOptions] = React.useState<PersonView[]>([]);
  const [searchPerson, { data, loading, error }] = useLazyQuery<QueryResponse>(SEARCH_PERSON);

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
      
    </>
  )
}

export default Step1;