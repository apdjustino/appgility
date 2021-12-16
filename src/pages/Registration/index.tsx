import React from 'react'
import { useQuery } from '@apollo/client'
import { useLocation, useParams, useRouteMatch, useHistory, Switch, Link, Redirect } from 'react-router-dom'
import { orderBy } from "lodash";
import moment from 'moment'
import TrialRegistration from '../../components/TrialRegistration'
import { getEventId, selectedEventMenu } from "../../reactiveVars"
import { GET_TRIAL_DATES } from './query'
import ProtectedRoute from '../../components/ProtectedRoute'
import RedirectComponent from './RedirectComponent';
import AddRunWizard from '../../components/AddRunWizard';

type ConfigureParams = {
  eventId: string
}

type TrialDates = {
  trialId: string;
  trialDate: string;
};

type QueryResponse = {
  getEventTrials: TrialDates[];
  getEvent: {
    name: string;
  }
}

const Registration = () => {

  const params = useParams<ConfigureParams>()
  const { pathname } = useLocation();
  const { path } = useRouteMatch();
  const { data, error} = useQuery<QueryResponse>(GET_TRIAL_DATES, { variables : { eventId: params.eventId }});
  const history = useHistory();
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
    
  return !!data ? (
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
                  const label = moment(trialDate, "YYYY-MM-DD").format("dddd - MM/DD/YYYY");
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
          <Switch>
            <ProtectedRoute path={`${path}/:trialId/add`} component={AddRunWizard} />
            <ProtectedRoute path={`${path}/:trialId`} component={TrialRegistration} />
            <ProtectedRoute path={`${path}`} component={() => <RedirectComponent redirectTrialId={firstTrialId}/>} />
          </Switch>     
        </div>
      </div>
    </div>  
  ) : !!error ? (
    <div>There has been an error</div>
  ) : null
    
}

export default Registration