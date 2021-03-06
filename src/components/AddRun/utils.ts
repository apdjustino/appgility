import { SelectOptions } from "../../types/generic";
import { RunToAdd } from "../../types/run";

export type NewRunForm = {
    trialId: string;
    trialDate: string;
    standardPreferred: boolean;
    standardLevel: SelectOptions<string> | undefined;
    standardHeight: SelectOptions<number> | undefined;
    jumpersPreferred: boolean;
    jumpersLevel: SelectOptions<string> | undefined;
    jumpersHeight: SelectOptions<number> | undefined;
    fastPreferred: boolean;
    fastLevel: SelectOptions<string> | undefined;
    fastHeight: SelectOptions<number> | undefined;
    t2bHeight: SelectOptions<number> | undefined;
    premierStandardHeight: SelectOptions<number> | undefined;
    premierJumpersHeight: SelectOptions<number> | undefined;
};

type EmptyRun = {};

export type Run = RunToAdd | EmptyRun;

export const buildRunsToAdd = (eventId: string, formData: NewRunForm[], personId: string, dog: { callName: string; dogId: string }): RunToAdd[] => {
    const runsToAdd: RunToAdd[] = [];

    formData.forEach((trial) => {
        if (!trial.standardPreferred && !!trial.standardLevel && !!trial.standardHeight) {
            runsToAdd.push({
                eventId,
                trialId: trial.trialId,
                trialDate: trial.trialDate,
                personId,
                dog,
                agilityClass: "STANDARD",
                level: trial.standardLevel.value,
                jumpHeight: trial.standardHeight.value,
                preferred: false,
                group: `standard-${trial.standardLevel.value}-${trial.standardHeight.value}`,
            });
        }

        if (trial.standardPreferred && !!trial.standardLevel && !!trial.standardHeight) {
            runsToAdd.push({
                eventId,
                trialId: trial.trialId,
                trialDate: trial.trialDate,
                personId,
                dog,
                agilityClass: "STANDARD",
                level: trial.standardLevel.value,
                jumpHeight: trial.standardHeight.value,
                preferred: true,
                group: `standard-${trial.standardLevel.value}-${trial.standardHeight.value}`,
            });
        }

        if (!trial.jumpersPreferred && !!trial.jumpersLevel && !!trial.jumpersHeight) {
            runsToAdd.push({
                eventId,
                trialId: trial.trialId,
                trialDate: trial.trialDate,
                personId,
                dog,
                agilityClass: "JUMPERS",
                level: trial.jumpersLevel.value,
                jumpHeight: trial.jumpersHeight.value,
                preferred: false,
                group: `jumpers-${trial.jumpersLevel.value}-${trial.jumpersHeight.value}`,
            });
        }

        if (trial.jumpersPreferred && !!trial.jumpersLevel && !!trial.jumpersHeight) {
            runsToAdd.push({
                eventId,
                trialId: trial.trialId,
                trialDate: trial.trialDate,
                personId,
                dog,
                agilityClass: "JUMPERS",
                level: trial.jumpersLevel.value,
                jumpHeight: trial.jumpersHeight.value,
                preferred: true,
                group: `jumpers-${trial.jumpersLevel.value}-${trial.jumpersHeight.value}`,
            });
        }

        if (!trial.fastPreferred && !!trial.fastHeight && !!trial.fastLevel) {
            runsToAdd.push({
                eventId,
                trialId: trial.trialId,
                trialDate: trial.trialDate,
                personId,
                dog,
                agilityClass: "FAST",
                level: trial.fastLevel.value,
                jumpHeight: trial.fastHeight.value,
                preferred: false,
                group: `fast-${trial.fastLevel.value}-${trial.fastHeight.value}`,
            });
        }

        if (trial.fastPreferred && !!trial.fastHeight && !!trial.fastLevel) {
            runsToAdd.push({
                eventId,
                trialId: trial.trialId,
                trialDate: trial.trialDate,
                personId,
                dog,
                agilityClass: "FAST",
                level: trial.fastLevel.value,
                jumpHeight: trial.fastHeight.value,
                preferred: true,
                group: `fast-${trial.fastLevel.value}-${trial.fastHeight.value}`,
            });
        }

        if (!!trial.t2bHeight) {
            runsToAdd.push({
                eventId,
                trialId: trial.trialId,
                trialDate: trial.trialDate,
                personId,
                dog,
                agilityClass: "T2B",
                level: null,
                jumpHeight: trial.t2bHeight.value,
                preferred: false,
                group: `t2b-${trial.t2bHeight.value}`,
            });
        }

        if (!!trial.premierStandardHeight) {
            runsToAdd.push({
                eventId,
                trialId: trial.trialId,
                trialDate: trial.trialDate,
                personId,
                dog,
                agilityClass: "PREMIER_STANDARD",
                level: null,
                jumpHeight: trial.premierStandardHeight.value,
                preferred: false,
                group: `prem_standard-${trial.premierStandardHeight.value}`,
            });
        }

        if (!!trial.premierJumpersHeight) {
            runsToAdd.push({
                eventId,
                trialId: trial.trialId,
                trialDate: trial.trialDate,
                personId,
                dog,
                agilityClass: "PREMIER_JUMPERS",
                level: null,
                jumpHeight: trial.premierJumpersHeight.value,
                preferred: false,
                group: `prem_jumpers-${trial.premierJumpersHeight.value}`,
            });
        }
    });

    return runsToAdd;
};
