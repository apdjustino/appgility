import React from "react";
import { Activity } from "react-feather";

const RecentActivity = () => {
    return (
        <div className="card card-fill">
            <div className="card-header">
                <h4 className="card-header-title">Recent Activity</h4>
                <button className="small btn btn-link" type="button">
                    View All
                </button>
            </div>
            <div className="card-body">
                <div className="list-group list-group-flush list-group-activity my-n3">
                    <div className="list-group-item">
                        <div className="row">
                            <div className="col-auto">
                                <div className="avatar avatar-sm">
                                    <div className="avatar-title fs-lg bg-primary-soft rounded-circle text-primary">
                                        <Activity />
                                    </div>
                                </div>
                            </div>
                            <div className="col ms-n2">
                                <p className="text-gray-700 mb-0">Event 1 was created</p>
                                <small className="text-muted">1m ago</small>
                            </div>
                        </div>
                    </div>
                    <div className="list-group-item">
                        <div className="row">
                            <div className="col-auto">
                                <div className="avatar avatar-sm">
                                    <div className="avatar-title fs-lg bg-primary-soft rounded-circle text-primary">
                                        <Activity />
                                    </div>
                                </div>
                            </div>
                            <div className="col ms-n2">
                                <p className="text-gray-700 mb-0">Event 2 was created</p>
                                <small className="text-muted">2m ago</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentActivity;
