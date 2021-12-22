import { Scalars, Maybe } from './generic'
import { Dog, Person } from './person';

export enum AgilityClass {
  Standard = 'STANDARD',
  Jumpers = 'JUMPERS',
  Fast = 'FAST',
  T2B = 'T2B',
  PremierStandard = 'PREMIER_STANDARD',
  PremierJumpers = 'PREMIER_JUMPERS'
}

export enum AgilityAbility {
  Novice = 'NOVICE',
  Open = 'OPEN',
  Excellent = 'EXCELLENT',
  Masters = 'MASTERS'
}

export type Run = {
  __typename?: 'Run';
  id: Scalars['String'];
  type: Scalars['String'];
  runId: Scalars['String'];
  trialId: Scalars['String'];
  personId: Scalars['String'];
  personName: Scalars['String'];
  dogId: Scalars['String'];
  callName: Scalars['String'];
  agilityClass: AgilityClass;
  level?: Maybe<AgilityAbility>;
  preferred: Scalars['Boolean'];
  jumpHeight: Scalars['Int'];
  group?: Maybe<Scalars['String']>;
  armband?: Maybe<Scalars['String']>;
  courseLength?: Maybe<Scalars['Int']>;
  score?: Maybe<Scalars['Int']>;
  timeDeduction?: Maybe<Scalars['Int']>;
  time?: Maybe<Scalars['Float']>;
  qualified?: Maybe<Scalars['Boolean']>;
  points?: Maybe<Scalars['Int']>;
  sendBonus?: Maybe<Scalars['Boolean']>;
  wrongCourse?: Maybe<Scalars['Int']>;
  excusal?: Maybe<Scalars['Int']>;
  refusal?: Maybe<Scalars['Int']>;
  failure?: Maybe<Scalars['Int']>;
  table?: Maybe<Scalars['Int']>;
  rank?: Maybe<Scalars['Int']>;
  obstacles?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  paid?: Maybe<Scalars['Boolean']>;
  deleted: Scalars['Boolean'];
};

export type RunData = {
  trialId: string,
  agilityClass: string,
  ability: string,
  preferred: boolean,
  needsMeasured: boolean,
}

export type AddRunFormData = {
  personId: string,
  dogId: string,
  runs: RunData[]
}