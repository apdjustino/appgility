import React from "react"
import { Modal } from "react-bootstrap";
import { ModalTypes, ModalConfig, FilterAndSearch } from "../index"
import MoveupsModal from "./MoveupsModal";
import EditRunModal from "./EditRunModal";
import MoveupsWarning from "./MoveupsWarning";
import { moveUpEligible } from "../../../utils/akcRules/moveUps"; 
import { TrialDates } from "../../../pages/Registration";

type OwnProps = {
  config: ModalConfig;
  trialData: TrialDates[] | undefined;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;  
}

const RegistrationModal = ({ config, setShowModal, trialData }: OwnProps) => {
  const [hideWarning, setHideWarning] = React.useState<boolean>(false);

  switch (config.type) {
    case ModalTypes.Moveups:
      if (!!trialData && trialData[0].dayToDayMoveup) {
        return !!config.run ? <MoveupsModal run={config.run} setShowModal={setShowModal}/> : null      
      }

      if (!!trialData && moveUpEligible(trialData[0].trialDate) || hideWarning) {
        return !!config.run ? <MoveupsModal run={config.run} setShowModal={setShowModal}/> : null      
      }

      return <MoveupsWarning setShowModal={setShowModal} setHideWarning={setHideWarning}/>
      
    
      case ModalTypes.Edit: 
      return !!config.run ? <EditRunModal run={config.run} setShowModal={setShowModal}/> : null      

    default:
      return null
  }

}

export default RegistrationModal