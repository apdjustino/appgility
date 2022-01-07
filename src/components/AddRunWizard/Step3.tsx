import { useMutation, useReactiveVar } from "@apollo/client";
import React from "react";
import { Button, Nav, Spinner, Card, ListGroup, Form, Alert } from "react-bootstrap";
import { ADD_NEW_RUN } from "../../queries/runs/runs";
import { addRunFormVar } from "../../reactiveVars";
import { groupBy } from "lodash";
import { parseTimeStamp } from "../../utils/dates";
import { EventAndTrialMeta } from "../../pages/Registration";
import { useNavigate } from "react-router-dom";

type OwnProps = {
  activeStep: number;
  eventMeta: EventAndTrialMeta;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const Step3 = ({ activeStep, eventMeta, setActiveStep }: OwnProps) => {
  const runData = useReactiveVar(addRunFormVar);
  const runPrices = eventMeta.getEvent.runPrices;
  const [paymentReceived, setPaymentReceived] = React.useState<boolean>(false);
  const [showError, setShowError] = React.useState<string>(""); 
  const navigate = useNavigate();

  const [addRun, result] = useMutation(ADD_NEW_RUN, {
    update: (cache, { data: { addRun } }) => {
      cache.modify({
        fields: {
          getTrialRunsPaginated(paginatedRunResponse) {
            const updatedResponse = { ...paginatedRunResponse };
            const updatedRunList = [addRun, ...updatedResponse.runs];
            updatedResponse.runs = updatedRunList;
            return updatedResponse
          }
        }
      })
    }
  })

  const handleSubmit = () => {
    runData.runs.forEach(run => {
      addRun({ variables: {
        eventId: run.eventId,
        trialId: run.trialId,
        personId: run.personId,
        dogId: run.dog.dogId,
        run: {
          agilityClass: run.agilityClass,
          level: run.level,
          jumpHeight: run.jumpHeight,
          preferred: run.preferred,
          group: run.group,
          price: run.price,
          paid: paymentReceived
        }
      }}).then(() => {
        navigate("..");
      }).catch((e) => {
        setShowError(e.message)
      })
    })
  }

  const groupedRuns = groupBy(runData.runs, (run) => run.trialDate)
  let totalPrice = 0;
  console.log(runPrices)

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-xs-12 col-md-10 col-lg-8 col-xl-6 text-center">
          <h6 className="mb-4 text-uppercase text-muted">Step {activeStep} of 3</h6>
          <h1 className="mb-3">Confirmation</h1>
          <p className="mb-5 text-muted">Review runs and confirm selection</p>
        </div>
      </div>
      {!!showError ? (
          <Alert variant="danger">{showError}</Alert>
        ) : null}
      <div className="row mb-3">
        <div className="col">
          <h4 className="text-body fw-bold">{runData.runs[0].dog.callName}</h4>
        </div>
      </div>
      {Object.keys(groupedRuns).map((trialDate) => {
        const runs = groupedRuns[trialDate];
        return (
          <div className="row" key={trialDate}>
            <div className="col">
              <Card>
                <Card.Header>
                  <h4 className="card-header-title">Selected Runs for {parseTimeStamp(trialDate, "EEEE MMMM  do, y")}</h4>
                </Card.Header>
                <Card.Body>
                  <ListGroup>
                    {runs.map((run, i) => {
                      let price;
                      if (!!runPrices) {
                        const priceIndex = Math.min(i, runPrices.length - 1)
                        price = `$${runPrices[priceIndex] / 100}`
                        run.price = runPrices[priceIndex];
                        totalPrice += runPrices[priceIndex]
                      }
                      return (
                        <ListGroup.Item key={`${trialDate}-${i}`}>
                          <div className="row">
                            <div className="col auto">
                              <h4 className="text-body">
                                {run.agilityClass}{!!run.level ? ` - ${run.level} ` : ""} - {`${run.jumpHeight}"`} - {!!run.preferred ? "Preferred" : "Regular"} {price}</h4>
                            </div>
                          </div>
                        </ListGroup.Item>
                      )
                    })}
                  </ListGroup>
                </Card.Body>
              </Card>
            </div>
          </div>          
        )
      })}
      <div className="row">
        <div className="col">
          <div className="d-flex">
            <div className="mx-3">
              <h4 className="text-body">Total Cost of Selected Runs: ${totalPrice / 100}</h4>
            </div>
            <Form.Check 
              label="Payment Received"
              checked={paymentReceived}
              onChange={() => setPaymentReceived(!paymentReceived)}
            />
          </div>
        </div>
      </div>      
      <hr className="my-5"/>
      <Nav className="row align-items-center">
        <div className="col-auto">
          <Button variant="white" type="button" size="lg" onClick={() => setActiveStep(1)}>Back</Button>
        </div>
        <div className="col text-center">
          <h6 className="text-uppercase text-muted mb-0">Step {activeStep} of 3</h6>
        </div>
        <div className="col-auto">
          <Button size="lg" type="button" onClick={() => {
            handleSubmit()
          }}>
            {result.loading ? (
              <Spinner animation="border" />
            ) : "Finish"}
          </Button>
        </div>
      </Nav>
    </>
  )
}

export default Step3;