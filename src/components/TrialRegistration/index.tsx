import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { Dropdown, Form, InputGroup, ListGroup } from "react-bootstrap"
import { useParams, Link } from 'react-router-dom'
import { GET_TRIAL_RUNS } from '../../queries/runs/runs'
import { Column } from 'react-table'
import { Search } from 'react-feather'
import { Run } from '../../types/run'
import RunTable from '../RunTable'
import { MoreVertical } from "react-feather";
import { Dog, Person } from '../../types/person'

type ConfigureParams = {
  eventId: string;
  trialId: string;
}

type RunQuery = {
  getTrialRuns: Run[]
}


const TrialRegistration = () => { 
  const { eventId, trialId } = useParams<ConfigureParams>();
  const trialRunsQuery = useQuery<RunQuery>(GET_TRIAL_RUNS, { variables: { trialId }})
  
  const columnsRaw: Column<Run>[] = [
    {
      accessor: 'agilityClass',
      Header: 'Class',
      Cell: ({ value }) => String(value)
    },
    {
      accessor: 'level',
      Header: 'Level',
      Cell: ({ value }) => !!value ? String(value) : '--',
    },
    {
      accessor: 'jumpHeight',
      Header: 'Jump Height',
      Cell: ({ value }) => String(value),
    },
    {
      accessor: 'preferred',
      Header: 'Preferred',
      Cell: ({ value }) => String(value),
    },
    {
      accessor: 'callName',
      Header: 'Call Name',
      Cell: ({ value }) => String(value),
    },
    {
      accessor: 'personName',
      Header: 'Owner',
      Cell: ({ value }) => String(value),
    },
    {
      accessor: "runId",
      Header: "",
      Cell: ({ value }) => {        
        return (
          <Dropdown align="end">
            <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
              <MoreVertical size={17}/>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#!">Move Ups</Dropdown.Item>
              <Dropdown.Item href="#!">Remove</Dropdown.Item>              
            </Dropdown.Menu>
          </Dropdown>
        )
      }
    }
  ]

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

  const columns = useMemo(() => columnsRaw, [])
  const tableData = useMemo(() => trialRunsQuery.data ? trialRunsQuery.data.getTrialRuns : [], [trialRunsQuery]) as any
  console.log(tableData)
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
          {!!tableData ? (
            <div className="d-none d-md-block">
              <RunTable data={tableData} columns={columns} showHeader={true}/>
            </div>  
          ) : null}          
        </div>     
      </div>
    </>
  )
}

export default TrialRegistration