import React from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Search } from "react-feather";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import 'react-bootstrap-typeahead/css/Typeahead.css';

type OwnProps = {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

type TestOptions = {
  avatar_url: string;
  id: string;
  login: string;
}

const AsyncTypeaheadControl = AsyncTypeahead as any;

const SEARCH_URI = 'https://api.github.com/search/users';

const Step1 = ({ activeStep, setActiveStep }: OwnProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [options, setOptions] = React.useState<TestOptions[]>([]);
  
  const handleSearch = (query: any) => {
    setIsLoading(true);

    fetch(`${SEARCH_URI}?q=${query}+in:login&page=1&per_page=50`)
      .then((resp) => resp.json())
      .then(({ items }) => {
        const options = items.map((i: any) => ({
          avatar_url: i.avatar_url,
          id: i.id,
          login: i.login,
        }));

        setOptions(options);
        setIsLoading(false);
      });
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
          isLoading={isLoading}
          labelKey="login"
          minLength={3}
          onSearch={handleSearch}
          options={options}
          renderMenuItemChildren={(option: any, props: any) => (
            <>
              <img
                alt={option.login}
                src={option.avatar_url}
                style={{
                  height: '24px',
                  marginRight: '10px',
                  width: '24px',
                }}
              />
              <span>{option.login}</span>
            </>
          )}
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