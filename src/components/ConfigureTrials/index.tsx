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
          <button className="btn btn-white" type="button">Add New Trial</button>
        </div>
      </div>
      {data.getEventTrials.length > 0 ? (
        <TrialCards trials={data.getEventTrials} setTrial={() => {}}/>
      ): (
        <div className="d-flex flex-column justify-content-center align-items-center my-6">
          <h2 className="text-body fst-italic">No Trials Found</h2>          
        </div>
      )}
      
    </>
  ) : (
    <p>There has been an error</p>
  )
}

export default ConfigureTrials;