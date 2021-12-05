import { gql } from '@apollo/client'

export const CONFIG_NEW_RUN = gql`
  query ConfigNewRun($eventId: String!, $personId: String!) {
    getEventTrials(eventId: $eventId) {
      trialId,
      trialDate,
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
      premierJumpers,
      runLimit
    }
    getPersonDogs(personId: $personId) {
      dogId,
      callName
    }
  }
`

export const ADD_NEW_RUN = gql`
  mutation AddNewRun($eventId: String!, $trialId: String!, $personId: String!, $dogId: String!, $run: RunInput!) {
    addRun(eventId: $eventId, trialId: $trialId, personId: $personId, dogId: $dogId, run: $run) {
      runId,
      agilityClass,
      level,
      preferred,
      jumpHeight
    }
  }
`

export const GET_TRIAL_RUNS = gql`
  query GetTrialRuns($trialId: String!) {
    getTrialRuns(trialId: $trialId) {
      runId
      trialId
      person {
        name
        personId
      }
      dog {
        callName
        dogId
      }
      agilityClass
      level
      preferred
      jumpHeight
      group
      armband
      courseLength
      score
      timeDeduction
      time
      qualified
      points
      sendBonus
      wrongCourse
      excusal
      refusal
      failure
      table
      rank
      obstacles
      paid
      deleted
    }
  }
`