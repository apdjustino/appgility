import React from "react"
import { Modal } from "react-bootstrap";
import { ModalTypes, ModalConfig, FilterAndSearch } from "../index"
import MoveupsModal from "./MoveupsModal";
import EditRunModal from "./EditRunModal";

type OwnProps = {
  config: ModalConfig;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;  
}

const RegistrationModal = ({ config, setShowModal }: OwnProps) => {

  switch (config.type) {
    case ModalTypes.Moveups:
      return !!config.run ? <MoveupsModal run={config.run} setShowModal={setShowModal}/> : null
      break;
    
      case ModalTypes.Edit: 
      return !!config.run ? <EditRunModal run={config.run} setShowModal={setShowModal}/> : null
      break;

    default:
      return null
  }

}

export default RegistrationModal