import { useQuery } from "@apollo/client";
import React from "react";
import { Spinner } from "react-bootstrap";
import { GET_TRIALS } from "../../queries/trials/trials";
import { EventTrial } from "../../types/trial";
import TrialCards from "../TrialCards";

type OwnProps = {
  eventId: string;
}

type QueryResponse = {
  getEventTrials: EventTrial[]
}

const ConfigureTrials = ({ eventId }: OwnProps) => {

  const [addTrialModal, setAddTrialModal] = React.useState<boolean>(false);
  const [selectedTrial, setSelectedTrial] = React.useState<string>("");

  const { data, loading, error} = useQuery<QueryResponse>(GET_TRIALS, { variables: { eventId }});
  console.log(data)
  return loading ? (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" />
    </div>
  ) : !!data && !!data.getEventTrials && !error ? (
    <>
      <div className="row">
        <div className="col">
          <div className="header-pretitle">Trials</div>
        </div>
        <div className="col-auto">
          <button className="btn btn-white" type="button" onClick={() => {
            setSelectedTrial("");
            setAddTrialModal(true);
          }}>Add New Trial</button>
        </div>
      </div>
      <TrialCards 
          addTrialModal={addTrialModal} 
          selectedTrial={selectedTrial} 
          trials={data.getEventTrials} 
          setSelectedTrial={setSelectedTrial} 
          setAddTrialModal={setAddTrialModal} />
      
    </>
  ) : (
    <p>There has been an error</p>
  )
}

export default ConfigureTrials;