import React from "react";
import { Modal, Form, Spinner } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import Select from "react-select";
import { Formik } from "formik"
import { Run } from "../../../types/run";
import { SelectOptions } from "../../../types/generic";
import { useParams } from "react-router-dom";
import { EDIT_RUN } from "../queries";

type OwnProps = {
  run: Run      
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}

type InitialValues = {
  agilityClass: SelectOptions<string>;
  level: SelectOptions<string>;
  jumpHeight: SelectOptions<number | null>;
  preferred: boolean;
}

type ConfigureParams = {
  trialId: string;
  eventId: string;
}

const EditRunModal = ({ run, setShowModal }: OwnProps) => {
  const { trialId, eventId } = useParams<ConfigureParams>()
  
  const [editRun, { loading }] = useMutation(EDIT_RUN, {
    update: (cache, { data: { editRun } }) => {
      cache.modify({
        fields: {
          getTrialRunsPaginated(paginatedRunResponse) {            
            const updatedResponse = { ...paginatedRunResponse };
            const updatedRuns = updatedResponse.runs.map((run: Run) => {
              if (editRun.runId === run.runId) {
                const updatedRun = { ...run };
                updatedRun.level = editRun.level;
                updatedRun.agilityClass = editRun.agilityClass;
                updatedRun.preferred = editRun.preferred;
                updatedRun.jumpHeight = editRun.jumpHeight;
                return updatedRun;
              }
              return run;
            });

            updatedResponse.runs = updatedRuns;
            return updatedResponse;
          }
        }
      });
      setShowModal(false);
    } 
  })


  const agilityClassOptions: SelectOptions<string>[] = [
    { label: "Standard", value: "STANDARD"},
    { label: "Jumpers", value: "JUMPERS"},
    { label: "FAST", value: "FAST"},
    { label: "T2B", value: "T2B"},
    { label: "Premier Standard", value: "PREMIER_STANDARD"},
    { label: "Premier Jumpers", value: "PREMIER_JUMPERS"},
  ]
  
  const levelOptions: SelectOptions<string>[] = [
    { label: "Novice", value: "NOVICE"},
    { label: "Open", value: "OPEN"},
    { label: "Excellent", value: "EXCELLENT"},
    { label: "Masters", value: "MASTERS"}
  ]
  
  const heightValues: SelectOptions<number | null>[] = [
    { value: 4, label: '4"'},
    { value: 8, label: '8"'},
    { value: 12, label: '12"'},
    { value: 16, label: '16"'},
    { value: 20, label: '20"'},
    { value: 24, label: '24"'},
  ] 

  const initialValues: InitialValues = {
    agilityClass: { label: run.agilityClass, value: run.agilityClass},
    level: { label: run.level as string, value: run.level as string},
    jumpHeight: { label: `${run.jumpHeight}"`, value: run.jumpHeight},
    preferred: run.preferred
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        editRun({ variables: {
          eventId,
          trialId,
          runId: run.runId,
          updatedRun: {
            agilityClass: values.agilityClass.value,
            level: values.level.value,
            jumpHeight: values.jumpHeight.value,
            preferred: values.preferred
          }
        }})

      }}
    >
      {(formik) => (
        <>
          <Modal.Header>
            <Modal.Title>Edit Run</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4 className="text-body text-focus mb-1 fw-bold">
              {run.callName} - {run.agilityClass} - {run.level} - {run.jumpHeight} - Preferred: {run.preferred.toString()}
            </h4>
            <div className="row">
              <div className="col">
                <Form>
                  <div className="form-group">
                    <Form.Label>Class</Form.Label>
                    <Form.Control 
                      name="agilityClass"
                      placeholder="Updated Class"
                      className="bg-transparent border-0 p-0"
                      as={Select}
                      options={agilityClassOptions}
                      value={formik.values.agilityClass as any}
                      onChange={(newValue: any) => formik.setFieldValue("agilityClass", newValue)}
                    />
                  </div>
                  <div className="form-group">
                    <Form.Label>Level</Form.Label>
                    <Form.Control 
                      name="level"
                      placeholder="Updated Level"
                      className="bg-transparent border-0 p-0"
                      as={Select}
                      options={levelOptions}
                      value={formik.values.level as any}
                      onChange={(newValue: any) => formik.setFieldValue("level", newValue)}
                    />
                  </div>
                  <div className="form-group">
                    <Form.Label>Jump Height</Form.Label>
                    <Form.Control 
                      name="jumpHeight"
                      placeholder="Updated Jump Height"
                      className="bg-transparent border-0 p-0"
                      as={Select}
                      options={heightValues}
                      value={formik.values.jumpHeight as any}
                      onChange={(newValue: any) => formik.setFieldValue("jumpHeight", newValue)}
                    />
                  </div>
                  <div className="form-group">                    
                    <Form.Check 
                      name="preferred"
                      label="Preferred"                      
                      type="checkbox"                                            
                      checked={formik.values.preferred}
                      onChange={formik.handleChange}
                    />
                  </div>                
                </Form>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-white" onClick={() => {
              setShowModal(false)
            }}>Cancel</button>
            <button className="btn btn-primary" onClick={() => {
              formik.submitForm();
              setShowModal(false)
            }}>
              {loading ? (
              <Spinner animation="border" />
            ): "Save Changes"}
            </button>
          </Modal.Footer>
        </>  
      )}      
    </Formik>
  )
}

export default EditRunModal;

