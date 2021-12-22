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
      runId,
      agilityClass,
      level,
      preferred,
      jumpHeight
    }
  }
`

export const GET_TRIAL_RUNS = gql`
  query GetTrialRuns($trialId: String!, $continuationToken: String) {
    getTrialRunsPaginated(trialId: $trialId, continuationToken: $continuationToken) {
      runs {
        runId
        trialId
        personId
        personName
        callName
        dogId
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
      },
      continuationToken,
      hasMoreResults
    }
  }
`