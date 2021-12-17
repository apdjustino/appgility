import React from "react";
import EventList from "../../components/EventList";
import { Modal } from "react-bootstrap";
import RecentActivity from "../../components/RecentActivity";
import RecentCatalogs from "../../components/RecentCatalogs";
import AddNewTrial from "../../components/AddNewEvent";

const EventDashboard = () => {
  const [showDialog, setShowDialog] = React.useState<boolean>(false);
  return (
    <>
      <div className="row px-5 py-3">
        <div className="col-12">
          <EventList setShowDialog={setShowDialog}/>
        </div>
      </div>
      <div className="row px-5 py-3">
        <div className="col-md-6 col-12">
          <RecentActivity />
        </div>
        <div className="col-md-6 col-12">
          <RecentCatalogs />
        </div>
      </div>
      <AddNewTrial showDialog={showDialog} setShowDialog={setShowDialog} />
    </>
    
  )
}

export default EventDashboard