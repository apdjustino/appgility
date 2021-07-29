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