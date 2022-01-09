import { gql } from '@apollo/client'

export const MOVE_UP = gql`
  mutation MoveUp($eventId: String!, $trialId: String!, $runId: String!, $newLevel: AgilityAbility!) {
    moveUp(eventId: $eventId, trialId: $trialId, runId: $runId, newLevel: $newLevel) {
      runId,
      level
    }
  }
`

export const EDIT_RUN = gql`
  mutation EditRun($eventId: String!, $trialId: String!, $runId: String!, $updatedRun: RunInput!) {
    editRun(eventId: $eventId, trialId: $trialId, runId: $runId, updatedRun: $updatedRun) {
      runId,
      agilityClass,
      level,
      jumpHeight,
      preferred
    }
  }
`

export const DELETE_RUN = gql`
  mutation DeleteRun($eventId: String!, $trialId: String!, $runId: String!) {
    deleteRun(eventId: $eventId, trialId: $trialId, runId: $runId) {
      runId
    }
  }
`