import React from "react";
import Step1 from "./Step1";

const AddRunWizard = () => {
  const [activeStep, setActiveStep] = React.useState<number>(1);

  return (
    <div className="main-content">
      <div className="container-lg">
        <div className="row justify-content-center">
          <div className="col-xs-12 col-lg-10 col-xl-8 py-4">
            {activeStep === 1 ? (
              <Step1 activeStep={activeStep} setActiveStep={setActiveStep} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddRunWizard;