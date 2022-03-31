import { Maybe, Scalars } from "./generic";

export enum Sex {
    Male = "MALE",
    Female = "FEMALE",
}

export type Dog = {
    __typename?: "Dog";
    id: Scalars["String"];
    dogId: Scalars["String"];
    personId: Scalars["String"];
    type: Scalars["String"];
    callName: Scalars["String"];
    akcNumber?: Maybe<Scalars["String"]>;
    akcName?: Maybe<Scalars["String"]>;
    akcPrefix?: Maybe<Scalars["String"]>;
    akcSuffix?: Maybe<Scalars["String"]>;
    breed?: Maybe<Scalars["String"]>;
    dob?: Maybe<Scalars["String"]>;
    jumpHeight?: Maybe<Scalars["Int"]>;
    sex?: Maybe<Sex>;
    deleted?: Maybe<Scalars["Boolean"]>;
};

export type Person = {
    __typename?: "Person";
    id?: Maybe<Scalars["String"]>;
    type?: Maybe<Scalars["String"]>;
    personId?: Maybe<Scalars["String"]>;
    name?: Maybe<Scalars["String"]>;
    email?: Maybe<Scalars["String"]>;
    role?: Maybe<Scalars["String"]>;
    phone?: Maybe<Scalars["String"]>;
    address?: Maybe<Scalars["String"]>;
    city?: Maybe<Scalars["String"]>;
    state?: Maybe<Scalars["String"]>;
    zip?: Maybe<Scalars["String"]>;
    claimed?: Maybe<Scalars["Boolean"]>;
};

export type AddRunDogView = {
    dogId: Scalars["String"];
    callName: Scalars["String"];
};

export type Judge = {
    id?: Maybe<Scalars["String"]>;
    name: Scalars["String"];
    email?: Maybe<Scalars["String"]>;
    phone?: Maybe<Scalars["String"]>;
    akcIdentifier?: Maybe<Scalars["String"]>;
};
