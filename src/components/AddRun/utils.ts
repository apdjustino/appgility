type NewRunForm = {
  trialId: string,  
  standardType: string,
  standardLevel: string,            
  standardHeight: string,
  standardPrefLevel: string,
  standardPrefHeight: string,
  jumpersType: string,
  jumpersLevel: string,
  jumpersHeight: string,
  jumpersPrefLevel: string,
  jumpersPrefHeight: string,
  fastType: string,
  fastLevel: string,
  fastHeight: string, 
  fastPrefLevel: string,
  fastPrefHeight: string,
  t2b: boolean,
  t2bHeight: string,
  premierStandard: boolean,
  premierStandardHeight: string,
  premierJumpers: boolean
  premierJumpersHeight: string
}

type RunToAdd = {
  agilityClass: 'Standard' | 'Jumpers' | 'FAST' | 'T2B' | 'Premier Standard' | 'Premier Jumpers',
  level: string,
  jumpHeight: string,
  trialId: string,  
  group: string,
  personId: string,
  dogId: string,
  preferred: boolean
}

type EmptyRun = {}

type Run = RunToAdd | EmptyRun

export const buildRunsToAdd = (formData: NewRunForm[], personId: string, dogId: string): Run[] => {
  const runsToAdd: Run[] = []

  formData.forEach(trial => {
    if (trial.standardType === 'regular') {
      runsToAdd.push({
        trialId: trial.trialId,
        personId,
        dogId,
        agilityClass: 'Standard',
        level: trial.standardLevel,
        jumpHeight: trial.standardHeight,
        preferred: false,
        group: `standard-${trial.standardLevel}-${trial.standardHeight}`
      })
    }
    
    if (trial.standardType === 'preferred') {
      runsToAdd.push({
        trialId: trial.trialId,
        personId,
        dogId,
        agilityClass: 'Standard',
        level: trial.standardPrefLevel,
        jumpHeight: trial.standardPrefLevel,
        preferred: true,
        group: `standard-${trial.standardPrefLevel}-${trial.standardPrefHeight}`
      })
    }

    if (trial.jumpersType === 'regular') {
      runsToAdd.push({
        trialId: trial.trialId,
        personId,
        dogId,
        agilityClass: 'Jumpers',
        level: trial.jumpersLevel,
        jumpHeight: trial.jumpersHeight,
        preferred: false,
        group: `jumpers-${trial.jumpersLevel}-${trial.jumpersHeight}`
      })
    }

    if (trial.jumpersType === 'preferred') {
      runsToAdd.push({
        trialId: trial.trialId,
        personId,
        dogId,
        agilityClass: 'Standard',
        level: trial.jumpersPrefLevel,
        jumpHeight: trial.jumpersPrefHeight,
        preferred: true,
        group: `jumpers-${trial.standardPrefLevel}-${trial.standardPrefHeight}`
      })
    }

    if (trial.fastType === 'regular') {
      runsToAdd.push({
        trialId: trial.trialId,
        personId,
        dogId,
        agilityClass: 'FAST',
        level: trial.fastLevel,
        jumpHeight: trial.fastHeight,
        preferred: false,
        group: `fast-${trial.fastLevel}-${trial.fastHeight}`
      })
    }

    if (trial.fastType === 'preferred') {
      runsToAdd.push({
        trialId: trial.trialId,
        personId,
        dogId,
        agilityClass: 'FAST',
        level: trial.fastPrefLevel,
        jumpHeight: trial.fastPrefHeight,
        preferred: true,
        group: `fast-${trial.fastPrefLevel}-${trial.fastPrefHeight}`
      })
    }

    if (trial.t2b) {
      runsToAdd.push({
        trialId: trial.trialId,
        personId,
        dogId,
        agilityClass: 'T2B',
        level: '',
        jumpHeight: trial.t2bHeight,
        preferred: false,
        group: `t2b-${trial.t2bHeight}`
      })
    }

    if (trial.premierStandard) {
      runsToAdd.push({
        trialId: trial.trialId,
        personId,
        dogId,
        agilityClass: 'Premier Standard',
        level: '',
        jumpHeight: trial.premierStandardHeight,
        preferred: false,
        group: `t2b-${trial.premierStandardHeight}`
      })
    }

    if (trial.premierJumpers) {
      runsToAdd.push({
        trialId: trial.trialId,
        personId,
        dogId,
        agilityClass: 'Premier Jumpers',
        level: '',
        jumpHeight: trial.premierJumpersHeight,
        preferred: false,
        group: `t2b-${trial.premierJumpersHeight}`
      })
    }

  })

  return runsToAdd
}