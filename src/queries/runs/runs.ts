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