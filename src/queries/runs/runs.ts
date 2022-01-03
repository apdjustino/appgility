import { gql } from '@apollo/client'

export const CONFIG_NEW_RUN = gql`
  query ConfigNewRun($eventId: String!, $personId: String!) {
    getEventTrials(eventId: $eventId) {
      trialId,
      trialDate,
      standardClass,
      standardAbility {
        label,
        value
      },
      standardPreferred {
        label,
        value
      },
      jumpersClass,
      jumpersAbility {
        label,
        value
      },
      jumpersPreferred {
        label,
        value
      },
      fastClass,
      fastAbility {
        label,
        value
      },
      fastPreferred {
        label,
        value
      },
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
      runId
      personName
      callName
      agilityClass
      level
      preferred
      jumpHeight
    }
  }
`

export const GET_TRIAL_RUNS = gql`
  query GetTrialRuns($trialId: String!, $agilityClass: [AgilityClass], $level: [AgilityAbility], $jumpHeight: [Int], $preferred: Boolean, $regular: Boolean, $search: String, $continuationToken: String) {
    getTrialRunsPaginated(trialId: $trialId, agilityClass: $agilityClass, level: $level, jumpHeight: $jumpHeight, preferred: $preferred, regular: $regular, search: $search, continuationToken: $continuationToken) {
      runs {
        runId            
        personName
        callName     
        agilityClass
        level
        preferred
        jumpHeight        
      },
      continuationToken,
      hasMoreResults
    }
  }
`