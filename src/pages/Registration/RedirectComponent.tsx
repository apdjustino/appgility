import React from "react";
import { useParams, Link } from "react-router-dom";

type OwnProps = {
    redirectTrialId: string | undefined;
};

type ConfigureParams = {
    eventId: string;
};

const RedirectComponent = ({ redirectTrialId }: OwnProps) => {
    const { eventId } = useParams<ConfigureParams>();
    return !!redirectTrialId ? (
        // <Redirect to={`/secretary/events/${eventId}/registration/${redirectTrialId}`}/>
        <div />
    ) : (
        <div className="d-flex flex-column justify-content-center align-items-center my-6">
            <h2 className="text-body fst-italic">
                No Trials Found.{" "}
                <Link className="link-primary" to={`/secretary/events/${eventId}/configuration/trials`}>
                    Click here
                </Link>{" "}
                to add a new trial.
            </h2>
        </div>
    );
};

export default RedirectComponent;
