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

  console.log(trialRunsQuery.data);
  
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
    <div className={style.container}>
      <div className={style.buttonGroupContainer}>          
          <Button.Group>
            <Popup content='Add trial run' trigger={<Button icon onClick={() => history.push(`${url}/add/person`)}><Icon name='add circle' /></Button>}/>
            <Popup content='Configure online registration' trigger={<Button icon><Icon name='settings' /></Button>}/>            
            <Popup content='Upload trial data' trigger={<Button icon><Icon name='cloud upload' /></Button>}/>                        
          </Button.Group>          
        </div>
        <div className={style.tableContainer}>
          <Table data={tableData} columns={columns} />
        </div>     
    </div>
  )
}

export default TrialRegistration