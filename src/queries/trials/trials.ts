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

export const GET_TRIALS = gql`
  query GetTrials($eventId: String!) {
    getEventTrials(eventId: $eventId) {
      id,
      trialId,
      eventId,
      type,
      akcTrialNumber,
      trialDate,
      onlineEntries,
      mailEntries,
      standardClass,
      standardAbility,
      standardPreferred,
      jumpersClass,
      jumpersAbility,
      jumpersPreferred,
      fastClass,
      fastAbility,
      fastPreferred,
      t2bClass,
      premierStandard,
      premierJumpers
    }
  }
`

export const GET_EVENT_TRIAL = gql`
  query GetEventTrial($trialId: String!, $eventId: String!) {
    getEventTrial(trialId: $trialId, eventId: $eventId) {
      id,
      trialId,
      eventId,
      type,
      akcTrialNumber,
      trialDate,
      onlineEntries,
      mailEntries,
      standardClass,
      standardAbility,
      standardPreferred,
      jumpersClass,
      jumpersAbility,
      jumpersPreferred,
      fastClass,
      fastAbility,
      fastPreferred,
      t2bClass,
      premierStandard,
      premierJumpers
    }
  }
`

export const ADD_TRIAL = gql`
  mutation AddEventTrial($eventTrial: AddEventTrial!) {
    addEventTrial(eventTrial: $eventTrial) {
      trialId,
      eventId,
      trialDate
    }
  }
`

export const UPDATE_TRIAL = gql`
  mutation UpdateEventTrial($trialId: String!, $eventId: String!, $eventTrial: UpdateEventTrial!) {
    updateEventTrial(trialId: $trialId, eventId: $eventId, eventTrial: $eventTrial) {
      trialId,
      eventId,
      trialDate
    }
  }
`