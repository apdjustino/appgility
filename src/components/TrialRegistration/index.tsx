import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { Dropdown, Form, InputGroup, ListGroup, Spinner } from "react-bootstrap"
import { useParams, Link } from 'react-router-dom'
import { GET_TRIAL_RUNS } from '../../queries/runs/runs'
import { Column } from 'react-table'
import { MoreVertical } from "react-feather";
import { Search } from 'react-feather'
import { PaginatedRunResponse, Run } from '../../types/run'
import RunTable from '../RunTable'

import { Dog, Person } from '../../types/person'
import { SizeMe } from "react-sizeme";

type ConfigureParams = {
  eventId: string;
  trialId: string;
}

type RunQuery = {
  getTrialRunsPaginated: PaginatedRunResponse
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
      <div className="row pt-3">
        <div className="col">
          <InputGroup className="input-group-merge input-group-reverse mb-3">
            <Form.Control type="search" placeholder="Search runs"/>
            <InputGroup.Text>
              <Search size="1em" />
            </InputGroup.Text>
          </InputGroup>
          {/* <div className="d-block d-md-none">
            <RunTable data={tableData} columns={mobileColumns} showHeader={false}/>
          </div> */}
          {!!data && data.getTrialRunsPaginated ? (
            <div className="d-none d-md-block">
              <div className="row">
                <SizeMe>
                  {({ size }) => !!size.width ? (
                    <RunTable data={data.getTrialRunsPaginated} width={size.width - 20} loading={loading} fetchMore={fetchMore}/>   
                  ) : <div />}
                </SizeMe>                
              </div>          
            </div>  
          ) : null}          
        </div>     
      </div>
    </>
  )
}

export default TrialRegistration