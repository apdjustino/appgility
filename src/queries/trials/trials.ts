import { gql } from "@apollo/client";

export const GET_PERSON_EVENTS = gql`
    query GetPersonEvents($personId: String!) {
        getPersonEvents(personId: $personId) {
            eventId
            hostClub
            personId
            locationCity
            locationState
            trialSite
            status
            trialDates
        }
    }
`;

export const ADD_NEW_EVENT = gql`
    mutation AddEvent($data: CreateNewEventInput, $personId: String) {
        addEvent(data: $data, personId: $personId) {
            eventId
            status
        }
    }
`;

export const GET_EVENT = gql`
    query GetEvent($eventId: String!) {
        getEvent(eventId: $eventId) {
            id
            type
            eventId
            locationCity
            locationState
            status
            trialSite
            hostClub
            runPrices
            trialChairName
            trialChairEmail
            trialChairPhone
            openingDate
            closingDate
            premiumLink
        }
    }
`;

export const UPDATE_EVENT = gql`
    mutation UpdateEvent($eventId: String!, $updatedEvent: UpdateEventInput!, $personId: String!) {
        updateEvent(eventId: $eventId, updatedEvent: $updatedEvent, personId: $personId) {
            eventId
        }
    }
`;

export const GET_TRIALS = gql`
    query GetTrials($eventId: String!) {
        getEventTrials(eventId: $eventId) {
            id
            trialId
            eventId
            type
            trialDate
            onlineEntries
            mailEntries
            standardClass
            standardAbility {
                label
                value
            }
            standardPreferred {
                label
                value
            }
            jumpersClass
            jumpersAbility {
                label
                value
            }
            jumpersPreferred {
                label
                value
            }
            fastClass
            fastAbility {
                label
                value
            }
            fastPreferred {
                label
                value
            }
            t2bClass
            premierStandard
            premierJumpers
            runLimit
            dayToDayMoveup
            judges {
                name
                email
                phone
                akcIdentifier
            }
        }
    }
`;

export const GET_EVENT_TRIAL = gql`
    query GetEventTrial($trialId: String!, $eventId: String!) {
        getEventTrial(trialId: $trialId, eventId: $eventId) {
            id
            trialId
            eventId
            type
            trialDate
            onlineEntries
            mailEntries
            standardClass
            standardAbility {
                label
                value
            }
            standardPreferred {
                label
                value
            }
            jumpersClass
            jumpersAbility {
                label
                value
            }
            jumpersPreferred {
                label
                value
            }
            fastClass
            fastAbility {
                label
                value
            }
            fastPreferred {
                label
                value
            }
            t2bClass
            premierStandard
            premierJumpers
            runLimit
            dayToDayMoveup
            judges {
                name
                email
                phone
                akcIdentifier
            }
        }
    }
`;

export const ADD_TRIAL = gql`
    mutation AddEventTrial($eventTrial: AddEventTrial!) {
        addEventTrial(eventTrial: $eventTrial) {
            trialId
            eventId
            trialDate
        }
    }
`;

export const UPDATE_TRIAL = gql`
    mutation UpdateEventTrial($trialId: String!, $eventId: String!, $eventTrial: UpdateEventTrial!) {
        updateEventTrial(trialId: $trialId, eventId: $eventId, eventTrial: $eventTrial) {
            trialId
            eventId
            trialDate
        }
    }
`;
