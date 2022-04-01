import { gql } from "@apollo/client";
export const GET_EVENT_NAME = gql`
    query GetEventName($eventId: String!) {
        getEvent(eventId: $eventId) {
            hostClub
        }
    }
`;
