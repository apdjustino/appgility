import { Scalars, Maybe } from "./generic";
import { Judge } from "./person";

export type EventTrial = {
    __typename?: "EventTrial";
    id: Scalars["String"];
    trialId: Scalars["String"];
    eventId: Scalars["String"];
    type: Scalars["String"];
    trialDate?: Maybe<Scalars["String"]>;
    onlineEntries?: Maybe<Scalars["Int"]>;
    mailEntries?: Maybe<Scalars["Int"]>;
    standardClass?: Maybe<Scalars["Boolean"]>;
    standardAbility?: Maybe<Array<Maybe<Ability>>>;
    standardPreferred?: Maybe<Array<Maybe<Ability>>>;
    jumpersClass?: Maybe<Scalars["Boolean"]>;
    jumpersAbility?: Maybe<Array<Maybe<Ability>>>;
    jumpersPreferred?: Maybe<Array<Maybe<Ability>>>;
    fastClass?: Maybe<Scalars["Boolean"]>;
    fastAbility?: Maybe<Array<Maybe<Ability>>>;
    fastPreferred?: Maybe<Array<Maybe<Ability>>>;
    t2bClass?: Maybe<Scalars["Boolean"]>;
    premierStandard?: Maybe<Scalars["Boolean"]>;
    premierJumpers?: Maybe<Scalars["Boolean"]>;
    runLimit?: Maybe<Scalars["Int"]>;
    createdAt?: Maybe<Scalars["String"]>;
    dayToDayMoveup?: Maybe<Scalars["Boolean"]>;
    judges?: Maybe<Array<Maybe<Judge>>>;
};

export type Ability = {
    __typename?: "Ability";
    label: Scalars["String"];
    value: Scalars["String"];
};
