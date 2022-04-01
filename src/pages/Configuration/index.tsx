import React from "react";
import { useParams } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
import { useLocation } from "react-router";
import { getEventId, selectedEventMenu } from "../../reactiveVars";
import { useQuery } from "@apollo/client";
import { GET_EVENT_NAME } from "./query";

type EventParams = {
    eventId: string;
};

type QueryResponse = {
    getEvent: {
        hostClub: string;
    };
};

const Configuration = () => {
    const { pathname } = useLocation();
    const params = useParams<EventParams>();

    const { data } = useQuery<QueryResponse>(GET_EVENT_NAME, { variables: { eventId: params.eventId } });

    React.useEffect(() => {
        getEventId(params.eventId);
        selectedEventMenu("configuration");
    }, [params]);

    return (
        <div className="container-fluid">
            <div className="header mb-4">
                <div className="header-body">
                    <div className="row align-items-end">
                        <div className="col">
                            <h6 className="header-pretitle">Event Configuration</h6>
                            <h1 className="header-title">{!!data && !!data.getEvent ? data.getEvent.hostClub : null}</h1>
                        </div>
                        <div className="col-auto">
                            <ul className="nav nav-tabs header-tabs fs-3">
                                <li className="nav-item">
                                    <Link to="trials" className={`nav-link text-center ${pathname.includes("trials") ? "active" : null}`}>
                                        Trials
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="basic" className={`nav-link text-center ${pathname.includes("basic") ? "active" : null}`}>
                                        Basic
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="registration" className={`nav-link text-center ${pathname.includes("registration") ? "active" : null}`}>
                                        Registration
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Configuration;
