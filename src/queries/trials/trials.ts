import { gql } from '@apollo/client'

export const GET_PERSON_EVENTS = gql`
  query GetPersonEvents($personId: String!) {
    getPersonEvents(personId: $personId) {
      eventId,
      name,
      personId,      
      locationCity,
      locationState,
      trialSite,
      status
    }
  }
`

export const ADD_NEW_EVENT = gql`
  mutation AddEvent($data: CreateNewEventInput, $personId: String) {
    addEvent(data: $data, personId: $personId) {
      eventId,
      name,
      status
    }
  }
`

export const GET_EVENT = gql`
  query GetEvent($eventId: String!) {
    getEvent(eventId: $eventId) {
      id,
      type,
      eventId,
      name,
      locationCity,
      locationState,
      status,
      trialSite,
      hostClub,
      price,
      altPrice,
      registrationEnabled,    
      registrationCutoff,
      premiumLink
    }
  }
`

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($eventId: String!, $updatedEvent: UpdateEventInput!) {
    updateEvent(eventId: $eventId, updatedEvent: $updatedEvent) {
      eventId,
      name
    }
  }
`