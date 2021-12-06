import React from "react";
import EventList from "../../components/EventList";
import RecentActivity from "../../components/RecentActivity";
import RecentReports from "../../components/RecentReports";

const EventDashboard = () => {
  return (
    <>
      <div className="row px-5 py-3">
        <div className="col-12">
          <EventList />
        </div>
      </div>
      <div className="row px-5 py-3">
        <div className="col-6">
          <RecentActivity />
        </div>
        <div className="col-6">
          <RecentReports />
        </div>
      </div>
    </>
    
  )
}

export default EventDashboard