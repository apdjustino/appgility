import React, { useMemo } from "react";
import { useLazyQuery } from "@apollo/client";
import { Dropdown, Form, InputGroup, ListGroup, Spinner, Card, Modal } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { GET_TRIAL_RUNS } from "../../queries/runs/runs";
import { Column } from "react-table";
import { MoreVertical } from "react-feather";
import { Search } from "react-feather";
import { PaginatedRunResponse, Run } from "../../types/run";
import RunTable from "../RunTable";
import Select from "react-select";
import { Formik } from "formik";
import { SizeMe } from "react-sizeme";
import { SelectOptions } from "../../types/generic";
import { isEmpty } from "lodash";
import { useDebounce } from "use-debounce";
import RegistrationModal from "./modals/RegistrationModal";
import { EventTrial } from "../../types/trial";
import { useEventMeta } from "../../pages/Registration";

type ConfigureParams = {
    eventId: string;
    trialId: string;
};

type RunQuery = {
    getTrialRunsPaginated: PaginatedRunResponse;
};

type filterInitialValues = {
    filterClass?: SelectOptions<string>[];
    filterLevel?: SelectOptions<string>[];
    filterJumpHeight?: SelectOptions<number>[];
    filterPreferred?: boolean;
    filterRegular?: boolean;
};

export type FilterAndSearch = {
    agilityClass?: string[];
    level?: string[];
    jumpHeight?: number[];
    preferred?: boolean;
    regular?: boolean;
};

export enum ModalTypes {
    Moveups = "moveups",
    Edit = "edit",
    Remove = "remove",
}

export type ModalConfig = {
    run?: Run;
    type: ModalTypes;
};

const TrialRegistration = () => {
    const { eventId, trialId } = useParams<ConfigureParams>();
    const [showModal, setShowModal] = React.useState<boolean>(false);
    const [modalType, setModalType] = React.useState<ModalConfig>({ type: ModalTypes.Moveups });
    const [getRuns, { data, fetchMore, loading }] = useLazyQuery<RunQuery>(GET_TRIAL_RUNS, { variables: { trialId }, notifyOnNetworkStatusChange: true });
    const [filterAndSearch, setFilterAndSearch] = React.useState<FilterAndSearch>({});
    const [filterIsOpen, setFilterIsOpen] = React.useState<boolean>(false);
    const [searchText, setSearchText] = React.useState<string>("");
    const [debouncedSearchText] = useDebounce(searchText, 750);
    const eventMeta = useEventMeta();

    React.useEffect(() => {
        const { agilityClass, level, jumpHeight, preferred, regular } = filterAndSearch;
        if (!!data && !!data.getTrialRunsPaginated) {
            getRuns({
                variables: {
                    trialId,
                    agilityClass,
                    level,
                    jumpHeight,
                    preferred,
                    regular,
                    search: debouncedSearchText.toLowerCase(),
                    continuationToken: data.getTrialRunsPaginated.continuationToken,
                },
            });
        } else {
            getRuns({ variables: { trialId, agilityClass, level, jumpHeight, preferred, regular, search: debouncedSearchText.toLowerCase() } });
        }
    }, [trialId, filterAndSearch, debouncedSearchText]);

    console.log(data);

    const mobileColumns: Column<Run>[] = [
        {
            accessor: ({ agilityClass, level, jumpHeight, preferred, dogId, callName, personId, personName, runId }) => ({
                agilityClass,
                level,
                jumpHeight,
                preferred,
                dogId,
                callName,
                personId,
                personName,
                runId,
            }),
            id: "runId",
            Header: "",
            Cell: ({ value }: any) => {
                return (
                    <ListGroup className="list-group-focus">
                        <ListGroup.Item>
                            <div className="row">
                                <div className="col">
                                    <h4 className="text-body text-focus mb-1">
                                        {value.agilityClass} {value.preferred ? "- Preferred" : ""}
                                    </h4>
                                    <p className="text-muted">
                                        {value.level} {value.jumpHeight}"
                                    </p>
                                </div>
                                <div className="col-auto d-flex">
                                    <div>
                                        <h4 className="text-body text-focus mb-1">{value.callName}</h4>
                                        <p className="text-muted">{value.personName}</p>
                                    </div>
                                    <div className="ms-4">
                                        <Dropdown align="end">
                                            <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                                                <MoreVertical size={17} />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item href="#!">Move Ups</Dropdown.Item>
                                                <Dropdown.Item href="#!">Remove</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                );
            },
        },
    ];

    const classesOptions: SelectOptions<string>[] = [
        { label: "Standard", value: "STANDARD" },
        { label: "Jumpers", value: "JUMPERS" },
        { label: "FAST", value: "FAST" },
        { label: "T2B", value: "T2B" },
        { label: "Premier Standard", value: "PREMIER_STANDARD" },
        { label: "Premier Jumpers", value: "PREMIER_JUMPERS" },
    ];

    const levelOptions: SelectOptions<string>[] = [
        { label: "Novice", value: "NOVICE" },
        { label: "Open", value: "OPEN" },
        { label: "Excellent", value: "EXCELLENT" },
        { label: "Masters", value: "MASTERS" },
    ];

    const jumpHeightOptions: SelectOptions<number>[] = [
        { value: 4, label: '4"' },
        { value: 8, label: '8"' },
        { value: 12, label: '12"' },
        { value: 16, label: '16"' },
        { value: 20, label: '20"' },
        { value: 24, label: '24"' },
    ];

    const filterInitialValues: filterInitialValues = {};

    return (
        <>
            <div className="row pb-3">
                <div className="col">
                    <div className="header-pretitle">Runs</div>
                </div>
                <div className="col-auto">
                    <Link to={`/secretary/events/${eventId}/registration/${trialId}/add`}>
                        <button className="btn btn-white" type="button">
                            Add New Run
                        </button>
                    </Link>
                </div>
            </div>
            <Formik
                initialValues={filterInitialValues}
                enableReinitialize={true}
                onSubmit={(values) => {
                    const newFilterAndSearch: FilterAndSearch = {};

                    if (isEmpty(values)) {
                        setFilterAndSearch({});
                    }

                    if (!!values.filterClass) {
                        newFilterAndSearch.agilityClass =
                            values.filterClass.length > 0 ? values.filterClass.map((agilityClass) => agilityClass.value) : undefined;
                    }

                    if (!!values.filterLevel) {
                        newFilterAndSearch.level = values.filterLevel.length > 0 ? values.filterLevel.map((agilityLevel) => agilityLevel.value) : undefined;
                    }

                    if (!!values.filterJumpHeight) {
                        newFilterAndSearch.jumpHeight =
                            values.filterJumpHeight.length > 0 ? values.filterJumpHeight.map((jumpHeight) => jumpHeight.value) : undefined;
                    }

                    if (!!values.filterPreferred) {
                        newFilterAndSearch.preferred = values.filterPreferred;
                    }

                    if (!!values.filterRegular) {
                        newFilterAndSearch.regular = values.filterRegular;
                    }

                    setFilterAndSearch(newFilterAndSearch);

                    setFilterIsOpen(false);
                }}
            >
                {(formik) => (
                    <div className="row">
                        <div className="col">
                            <div className="d-flex">
                                <Dropdown show={filterIsOpen} onToggle={() => setFilterIsOpen(!filterIsOpen)}>
                                    <Dropdown.Toggle as="button" className="btn btn-white" onClick={() => setFilterIsOpen(!filterIsOpen)}>
                                        Add Filter
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Card.Body style={{ minWidth: "400px" }}>
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <Card.Title>Class</Card.Title>
                                                    <div className="w-100">
                                                        <Select
                                                            name="filterClass"
                                                            options={classesOptions}
                                                            isMulti={true}
                                                            isClearable={true}
                                                            value={formik.values.filterClass}
                                                            onChange={(newValue: any) => formik.setFieldValue("filterClass", newValue)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <Card.Title>Level</Card.Title>
                                                    <div className="w-100">
                                                        <Select
                                                            name="filterLevel"
                                                            options={levelOptions}
                                                            isMulti={true}
                                                            isClearable={true}
                                                            value={formik.values.filterLevel}
                                                            onChange={(newValue: any) => formik.setFieldValue("filterLevel", newValue)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <Card.Title>Jump Height</Card.Title>
                                                    <div className="w-100">
                                                        <Select
                                                            name="filterJumpHeight"
                                                            options={jumpHeightOptions}
                                                            isMulti={true}
                                                            isClearable={true}
                                                            value={formik.values.filterJumpHeight}
                                                            onChange={(newValue: any) => formik.setFieldValue("filterJumpHeight", newValue)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <Form.Check
                                                        inline
                                                        label="Preferred"
                                                        name="filterPreferred"
                                                        type="checkbox"
                                                        disabled={formik.values.filterRegular}
                                                        checked={formik.values.filterPreferred}
                                                        onClick={() => {
                                                            const newValue = !formik.values.filterPreferred;
                                                            formik.setFieldValue("filterPreferred", newValue);
                                                        }}
                                                    />
                                                    <Form.Check
                                                        inline
                                                        label="Regular"
                                                        name="filterRegular"
                                                        type="checkbox"
                                                        disabled={formik.values.filterPreferred}
                                                        checked={formik.values.filterRegular}
                                                        onClick={() => {
                                                            const newValue = !formik.values.filterRegular;
                                                            formik.setFieldValue("filterRegular", newValue);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end mt-3">
                                                <button className="btn btn-white" type="button" onClick={() => formik.submitForm()}>
                                                    Apply Filters
                                                </button>
                                            </div>
                                        </Card.Body>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <InputGroup className="input-group-merge input-group-reverse mb-3 ms-2">
                                    <Form.Control type="search" placeholder="Search by owner or call name" onChange={(e) => setSearchText(e.target.value)} />
                                    <InputGroup.Text>
                                        <Search size="1em" />
                                    </InputGroup.Text>
                                </InputGroup>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col d-flex">
                                {!!filterAndSearch.agilityClass
                                    ? filterAndSearch.agilityClass.map((classItem) => (
                                          <div className="btn btn-white btn-sm d-inline-block me-3" style={{ cursor: "default" }}>
                                              <span className="align-middle">{classItem}</span>
                                              <i
                                                  className="fe fe-x-circle ps-2 align-middle"
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() => {
                                                      const newFilterAndSearch = { ...filterAndSearch };
                                                      const classes = filterAndSearch.agilityClass?.filter((item) => item !== classItem);
                                                      newFilterAndSearch.agilityClass = !!classes && classes.length > 0 ? classes : undefined;
                                                      formik.setFieldValue("filterClass", null);
                                                      setFilterAndSearch(newFilterAndSearch);
                                                  }}
                                              ></i>
                                          </div>
                                      ))
                                    : null}
                                {!!filterAndSearch.level
                                    ? filterAndSearch.level.map((level) => (
                                          <div className="btn btn-white btn-sm d-inline-block me-3" style={{ cursor: "default" }}>
                                              <span className="align-middle">{level}</span>
                                              <i
                                                  className="fe fe-x-circle ps-2 align-middle"
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() => {
                                                      const newFilterAndSearch = { ...filterAndSearch };
                                                      const levels = filterAndSearch.level?.filter((item) => item !== level);
                                                      newFilterAndSearch.level = !!levels && levels.length > 0 ? levels : undefined;
                                                      formik.setFieldValue("filterLevel", null);
                                                      setFilterAndSearch(newFilterAndSearch);
                                                  }}
                                              ></i>
                                          </div>
                                      ))
                                    : null}
                                {!!filterAndSearch.jumpHeight
                                    ? filterAndSearch.jumpHeight.map((height) => (
                                          <div className="btn btn-white btn-sm d-inline-block me-3" style={{ cursor: "default" }}>
                                              <span className="align-middle">{height}"</span>
                                              <i
                                                  className="fe fe-x-circle ps-2 align-middle"
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() => {
                                                      const newFilterAndSearch = { ...filterAndSearch };
                                                      const heights = filterAndSearch.jumpHeight?.filter((item) => item !== height);
                                                      newFilterAndSearch.jumpHeight = !!heights && heights.length > 0 ? heights : undefined;
                                                      formik.setFieldValue("filterJumpHeight", null);
                                                      setFilterAndSearch(newFilterAndSearch);
                                                  }}
                                              ></i>
                                          </div>
                                      ))
                                    : null}
                                {!!filterAndSearch.preferred ? (
                                    <div className="btn btn-white btn-sm d-inline-block me-3" style={{ cursor: "default" }}>
                                        <span className="align-middle">Preferred</span>
                                        <i
                                            className="fe fe-x-circle ps-2 align-middle"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                const newFilterAndSearch = { ...filterAndSearch };
                                                newFilterAndSearch.preferred = false;
                                                formik.setFieldValue("filterPreferred", undefined);
                                                setFilterAndSearch(newFilterAndSearch);
                                            }}
                                        ></i>
                                    </div>
                                ) : null}
                                {!!filterAndSearch.regular ? (
                                    <div className="btn btn-white btn-sm d-inline-block me-3" style={{ cursor: "default" }}>
                                        <span className="align-middle">Regular</span>
                                        <i
                                            className="fe fe-x-circle ps-2 align-middle"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                const newFilterAndSearch = { ...filterAndSearch };
                                                newFilterAndSearch.regular = false;
                                                formik.setFieldValue("filterRegular", undefined);
                                                setFilterAndSearch(newFilterAndSearch);
                                            }}
                                        ></i>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                {/* <div className="d-block d-md-none">
                <RunTable data={tableData} columns={mobileColumns} showHeader={false}/>
                  </div> */}
                                {!!data && data.getTrialRunsPaginated ? (
                                    <div className="d-none d-md-block">
                                        <div className="row">
                                            <SizeMe>
                                                {({ size }) =>
                                                    !!size.width ? (
                                                        <RunTable
                                                            data={data.getTrialRunsPaginated}
                                                            width={size.width}
                                                            loading={loading}
                                                            fetchMore={fetchMore}
                                                            setShowModal={setShowModal}
                                                            setModalType={setModalType}
                                                        />
                                                    ) : (
                                                        <div />
                                                    )
                                                }
                                            </SizeMe>
                                        </div>
                                    </div>
                                ) : loading ? (
                                    <div className="d-flex justify-content-center">
                                        <Spinner animation="border" />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}
            </Formik>
            <Modal className="modal-lighter" centered show={showModal} onHide={() => setShowModal(false)}>
                <RegistrationModal config={modalType} trialData={eventMeta.getEventTrials} setShowModal={setShowModal} />
            </Modal>
        </>
    );
};

export default TrialRegistration;
