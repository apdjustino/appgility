import React from "react";
import { useEventMeta } from "../../pages/Registration";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

const AddRunWizard = () => {
    const [activeStep, setActiveStep] = React.useState<number>(1);
    const eventMeta = useEventMeta();

    return (
        <div className="main-content">
            <div className="container-lg">
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-lg-10 col-xl-8 py-4">
                        {activeStep === 1 ? <Step1 activeStep={activeStep} setActiveStep={setActiveStep} /> : null}
                        {activeStep === 2 ? <Step2 activeStep={activeStep} setActiveStep={setActiveStep} /> : null}
                        {activeStep === 3 ? <Step3 activeStep={activeStep} eventMeta={eventMeta} setActiveStep={setActiveStep} /> : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRunWizard;
