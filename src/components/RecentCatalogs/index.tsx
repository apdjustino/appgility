import React from "react";

const RecentCatalogs = () => {
  return (
    <div className="card card-fill">
      <div className="card-header">
        <h4 className="card-header-title">Recent Catalogs</h4>
        <button className="small btn btn-link" type="button">View All</button>
      </div>
      <div className="card-body">
        <div className="list-group list-group-flush my-n3">
            <div className="list-group-item">
              <div className="row">
                <div className="text-center fst-italic">No Catalogs to Show</div>
              </div>
            </div>
            
        </div>
      </div>
    </div>
  )
}

export default RecentCatalogs