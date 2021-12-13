import React from "react";

type OwnProps = {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const Step1 = ({ activeStep, setActiveStep }: OwnProps) => {

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-xs-12 col-md-10 col-lg-8 col-xl-6 text-center">
          <h6 className="mb-4 text-uppercase text-muted">Step {activeStep} of 2</h6>
          <h1 className="mb-3">Find an Exhibitor</h1>
          <p className="mb-5 text-muted">Search for an existing exhibitor or create a new exhibitor</p>
        </div>
      </div>
      
    </>
  )
}

export default Step1;