import React from 'react'
import { useQuery } from '@apollo/client'
import { useLocation, useParams, Outlet, Link, Navigate, useOutletContext } from 'react-router-dom'
import { orderBy } from "lodash";
import { getEventId, selectedEventMenu } from "../../reactiveVars"
import { GET_TRIAL_META } from './query'
import { parseTimeStamp } from '../../utils/dates';

type ConfigureParams = {
  eventId: string,
  trialId: string
}

export type TrialMeta = {
  trialId: string;
  trialDate: string;
  dayToDayMoveup: boolean;
};

export type EventAndTrialMeta = {
  getEventTrials: TrialMeta[];
  getEvent: {
    name: string;
    runPrices?: number[]
  }
}

const Registration = () => {

  const params = useParams<ConfigureParams>()
  const { pathname } = useLocation();  
  const { data, error} = useQuery<EventAndTrialMeta>(GET_TRIAL_META, { variables : { eventId: params.eventId }});  
  const [firstTrialId, setFirstTrialId] = React.useState<string | undefined>();

  React.useEffect(() => {
    getEventId(params.eventId);
    selectedEventMenu("registration");
  }, [params]);

  React.useEffect(() => {
    if (!!data && data.getEventTrials.length > 0) {
      const orderedTrials = orderBy(data.getEventTrials, ["trialDate"]);    
      const firstTrial = orderedTrials[0];
      setFirstTrialId(firstTrial.trialId);
    }
  }, [data])  
    
  return !!params.trialId ? !!data ? (
    <div className="container-fluid">
      <div className="header mb-4">
        <div className="header-body">
          <div className="row align-items-end">
            <div className="col">
              <h6 className="header-pretitle">Event Configuration</h6>
              <h1 className="header-title">{!!data && !!data.getEvent ? data.getEvent.name : null}</h1>
            </div>
            <div className="col-auto">
              <ul className="nav nav-tabs header-tabs fs-3">
                {!!data.getEventTrials ? data.getEventTrials.map(({ trialDate, trialId }) => {
                  const label = parseTimeStamp(trialDate, "MMMM  do, y");
                  return (
                    <li className="nav-item">
                      <Link to={`/secretary/events/${params.eventId}/registration/${trialId}`} className={`nav-link text-center ${pathname.includes(trialId) ? "active" : null}`}>
                        {label}
                      </Link>
                    </li>
                  )
                }) : null}                
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <Outlet context={data}/>    
        </div>
      </div>
    </div>  
  ) : !!error ? (
    <div>There has been an error</div>
  ) : null : !!firstTrialId ? (
    <Navigate replace to={firstTrialId} />
  ) : null
    
}

export default Registration

export const useEventMeta = () => {
  return useOutletContext<EventAndTrialMeta>();
}