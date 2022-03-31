import { gql } from "@apollo/client";

export const GET_TRIAL_META = gql`
    query GetTrialMeta($eventId: String!) {
        getEventTrials(eventId: $eventId) {
            trialId
            trialDate
            dayToDayMoveup
        }
        getEvent(eventId: $eventId) {
            name
            runPrices
        }
    }
`;
