import style from './TrialRegistration.module.scss'

import React, { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { Button, Grid, Icon, Popup, List } from 'semantic-ui-react'
import { useHistory, useRouteMatch } from 'react-router'
import { GET_TRIAL_RUNS } from '../../queries/runs/runs'
import { Column } from 'react-table'
import { RunView } from '../../types/run'
import Table from '../Table'

type ButtonGroupItem = {
  key: string,
  icon: string
}

type RunQuery = {
  getTrialRuns: RunView[]
}

type OwnProps = {
  trialId: string
}

const TrialRegistration = ({ trialId } : OwnProps) => { 
  const history = useHistory()
  const { url } = useRouteMatch()
  const trialRunsQuery = useQuery<RunQuery>(GET_TRIAL_RUNS, { variables: { trialId }})
  
  const columnsRaw: Column<RunView>[] = [
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
      accessor: 'dog',
      Header: 'Call Name',
      Cell: ({ value }) => String(value.callName),
    },
    {
      accessor: 'person',
      Header: 'Owner',
      Cell: ({ value }) => String(value.name),
    }
  ]

  const columns = useMemo(() => columnsRaw, [])
  const tableData = useMemo(() => trialRunsQuery.data ? trialRunsQuery.data.getTrialRuns : [], [trialRunsQuery]) as RunView[]

  return (
    <>
      <div className="row pb-3">
        <div className="col">
          <div className="header-pretitle">Runs</div>
        </div>
        <div className="col-auto">
          <button className="btn btn-white" type="button" onClick={() => {}}>Add New Run</button>
        </div>        
      </div>
      <div className="row pt-3">
        <div className="col">
            <Table data={tableData} columns={columns} />
          </div>     
      </div>
    </>
  )
}

export default TrialRegistration