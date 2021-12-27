import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { Dropdown, Form, InputGroup, ListGroup, Spinner, Card } from "react-bootstrap"
import { useParams, Link } from 'react-router-dom'
import { GET_TRIAL_RUNS } from '../../queries/runs/runs'
import { Column } from 'react-table'
import { MoreVertical } from "react-feather";
import { Search, Filter } from 'react-feather'
import { PaginatedRunResponse, Run } from '../../types/run'
import RunTable from '../RunTable'
import Select from "react-select";
import { Formik } from "formik";
import { Dog, Person } from '../../types/person'
import { SizeMe } from "react-sizeme";
import { SelectOptions } from '../../types/generic'

type ConfigureParams = {
  eventId: string;
  trialId: string;
}

type RunQuery = {
  getTrialRunsPaginated: PaginatedRunResponse
}

type filterInitialValues = {
  filterClass?: SelectOptions<string>[];
  filterLevel?: SelectOptions<string>[];
  filterJumpHeight?: SelectOptions<number>[];
  filterPreferred?: boolean;
}


const TrialRegistration = () => { 
  const { eventId, trialId } = useParams<ConfigureParams>();
  const { data, fetchMore, loading } = useQuery<RunQuery>(GET_TRIAL_RUNS, { variables: { trialId }, notifyOnNetworkStatusChange: true})    

  const mobileColumns: Column<Run>[] = [
    {
      accessor: ({ agilityClass, level, jumpHeight, preferred, dogId, callName, personId, personName, runId}) => ({
        agilityClass,
        level,
        jumpHeight,
        preferred,
        dogId,
        callName,
        personId,
        personName,
        runId
      }),
      id: "runId",
      Header: "",
      Cell: ({ value }: any) => {
        return (
          <ListGroup className="list-group-focus">
            <ListGroup.Item>
              <div className="row">
                <div className="col">
                  <h4 className="text-body text-focus mb-1">{value.agilityClass} {value.preferred ? "- Preferred" : ""}</h4>
                  <p className="text-muted">{value.level} {value.jumpHeight}"</p>
                </div>
                <div className="col-auto d-flex">
                  <div>
                    <h4 className="text-body text-focus mb-1">{value.callName}</h4>
                    <p className="text-muted">{value.personName}</p>
                  </div>
                  <div className="ms-4">
                    <Dropdown align="end">
                      <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                        <MoreVertical size={17}/>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#!">Move Ups</Dropdown.Item>
                        <Dropdown.Item href="#!">Remove</Dropdown.Item>              
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>                  
                </div>
              </div>
            </ListGroup.Item>
          </ListGroup>
        )
      }
    }
  ]
  
  const classesOptions: SelectOptions<string>[] = [
    { label: "Standard", value: "STANDARD" },
    { label: "Jumpers", value: "JUMPERS" },
    { label: "FAST", value: "FAST" },
    { label: "T2B", value: "T2B" },
    { label: "Premier Standard", value: "PREMIER_STANDARD" },
    { label: "Premier Jumpers", value: "PREMIER_JUMPERS" },
  ];

  const levelOptions: SelectOptions<string>[] = [
    { label: 'Novice', value: 'nov' },
    { label: 'Open', value: 'open' },
    { label: 'Excellent', value: 'exc'},
    { label: 'Masters', value: 'mast' }    
  ]

  const jumpHeightOptions: SelectOptions<number>[] = [
    { value: 4, label: '4"'},
    { value: 8, label: '8"'},
    { value: 12, label: '12"'},
    { value: 16, label: '16"'},
    { value: 20, label: '20"'},
    { value: 24, label: '24"'},
  ]

  const filterInitialValues: filterInitialValues = {}
  
  return (
    <>
      <div className="row pb-3">
        <div className="col">
          <div className="header-pretitle">Runs</div>          
        </div>
        <div className="col-auto">
          <Link to={`/secretary/events/${eventId}/registration/${trialId}/add`}>
            <button className="btn btn-white" type="button">Add New Run</button>
          </Link>          
        </div>        
      </div>
      <div className="row">
        <div className="col">          
          <div className="d-flex">
            <Dropdown>
              <Dropdown.Toggle as="button" className="btn btn-white">
                Add Filter
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Formik
                  initialValues={filterInitialValues}
                  onSubmit={(values) => {
                    console.log(values)
                  }}
                >
                  {(formik) => (
                    <Card.Body style={{minWidth: "400px"}}>
                      <div className="row mb-3">
                        <div className="col">
                          <Card.Title>Class</Card.Title>
                          <div className="w-100">
                            <Select
                              name="filterClass" 
                              options={classesOptions}
                              isMulti={true}
                              isClearable={true}
                              value={formik.values.filterClass}
                              onChange={(newValue: any) => formik.setFieldValue("filterClass", newValue)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col">
                          <Card.Title>Level</Card.Title>  
                          <div className="w-100">
                            <Select
                              name="filterLevel"
                              options={levelOptions}
                              isMulti={true}
                              isClearable={true}
                              value={formik.values.filterLevel}
                              onChange={(newValue: any) => formik.setFieldValue("filterLevel", newValue)}
                            />
                          </div>
                        </div>  
                      </div>
                      <div className="row mb-3">
                        <div className="col">
                          <Card.Title>Jump Height</Card.Title>  
                          <div className="w-100">
                            <Select
                              name="filterJumpHeight" 
                              options={jumpHeightOptions}
                              isMulti={true}
                              isClearable={true}
                              value={formik.values.filterJumpHeight}
                              onChange={(newValue: any) => formik.setFieldValue("filterJumpHeight", newValue)}
                            />
                          </div>
                        </div>  
                      </div>
                      <div className="row mb-3">
                        <div className="col">
                          <Card.Title>Preferred</Card.Title>  
                          <Form.Check 
                            name="filterPreferred"
                            type="checkbox"
                            checked={formik.values.filterPreferred}
                            onClick={() => {
                              const newValue = !formik.values.filterPreferred
                              formik.setFieldValue("filterPreferred", newValue)
                            }}
                          />
                        </div>  
                      </div>
                      <div className="d-flex justify-content-end mt-3">
                        <button className="btn btn-white" onClick={() => formik.submitForm()}>Apply Filters</button>
                      </div>                                  
                    </Card.Body>
                  )}                  
                </Formik>
              </Dropdown.Menu>
            </Dropdown>
            <InputGroup className="input-group-merge input-group-reverse mb-3 ms-2">
              <Form.Control type="search" placeholder="Search by owner or call name"/>
              <InputGroup.Text>
                <Search size="1em" />              
              </InputGroup.Text>            
            </InputGroup>
          </div>                        
        </div>
        <div className="row mb-3">
          <div className="col d-flex">
            {/* <div className="btn btn-white btn-sm d-inline-block me-3">
              <span className="align-middle">Standard</span>
              <i className="fe fe-x-circle ps-2 align-middle" style={{cursor: "pointer"}}></i>
            </div>
            <div className="btn btn-white btn-sm d-inline-block me-3">
              <span className="align-middle">Standard</span>
              <i className="fe fe-x-circle ps-2 align-middle" style={{cursor: "pointer"}}></i>
            </div> */}
          </div>
        </div>
        <div className="row">
          <div className="col">
            {/* <div className="d-block d-md-none">
            <RunTable data={tableData} columns={mobileColumns} showHeader={false}/>
              </div> */}
              {!!data && data.getTrialRunsPaginated ? (
                <div className="d-none d-md-block">
                  <div className="row">
                    <SizeMe>
                      {({ size }) => !!size.width ? (
                        <RunTable data={data.getTrialRunsPaginated} width={size.width} loading={loading} fetchMore={fetchMore}/>   
                      ) : <div />}
                    </SizeMe>                
                  </div>          
                </div>  
              ) : null}      
          </div>
        </div>   
      </div>
    </>
  )
}

export default TrialRegistration