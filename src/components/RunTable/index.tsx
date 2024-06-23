import React from "react";
import { useTable, Column, useBlockLayout } from "react-table";
import { MoreVertical } from "react-feather";
import { PaginatedRunResponse, Run } from "../../types/run";
import InfiniteLoader from "react-window-infinite-loader";
import { FixedSizeList } from "react-window";
import { Dropdown } from "react-bootstrap";
import { ModalConfig, ModalTypes } from "../TrialRegistration";

type OwnProps = {
    data: PaginatedRunResponse;
    width: number;
    loading: boolean;
    fetchMore: any;
    setModalType: React.Dispatch<React.SetStateAction<ModalConfig>>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const RunTable = ({ data, width, loading, fetchMore, setModalType, setShowModal }: OwnProps) => {
    const loadNextPage = () => {
        fetchMore({
            variables: {
                continuationToken: data.continuationToken,
            },
        });
    };

    const columns: Column<Run>[] = React.useMemo(
        () => [
            {
                accessor: "agilityClass",
                Header: "Class",
                Cell: ({ value }) => <p className="text-capitalize">{String(value).toLowerCase()}</p>,
                width: width / 7,
            },
            {
                accessor: "level",
                Header: "Level",
                Cell: ({ value }) => <span className="text-capitalize">{!!value ? String(value).split("_").join(" ").toLowerCase() : "--"}</span>,
                width: width / 7,
            },
            {
                accessor: "jumpHeight",
                Header: "Jump Height",
                Cell: ({ value }) => <span className="text-capitalize">{String(value).toLowerCase()}"</span>,
                width: width / 7,
            },
            {
                accessor: "preferred",
                Header: "Preferred",
                Cell: ({ value }) => <span className="text-capitalize">{String(value).toLowerCase()}</span>,
                width: width / 7,
            },
            {
                accessor: "callName",
                Header: "Call Name",
                Cell: ({ value }) => <span className="text-capitalize">{String(value).toLowerCase()}</span>,
                width: width / 7,
            },
            {
                accessor: "personName",
                Header: "Owner",
                Cell: ({ value }) => <span className="text-capitalize">{String(value).toLowerCase()}</span>,
                width: 200,
            },
            {
                accessor: (originalRow) => originalRow,
                Header: "",
                id: "actionMenu",
                Cell: ({ value }: { value: Run }) => {
                    return (
                        <Dropdown align="end">
                            <Dropdown.Toggle as="span" className="dropdown-ellipses" role="button">
                                <MoreVertical size={17} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    onClick={() => {
                                        const config: ModalConfig = { type: ModalTypes.Moveups, run: value };
                                        setModalType(config);
                                        setShowModal(true);
                                    }}
                                >
                                    Move Ups
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        const config: ModalConfig = { type: ModalTypes.Edit, run: value };
                                        setModalType(config);
                                        setShowModal(true);
                                    }}
                                >
                                    Edit Run
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        const config: ModalConfig = { type: ModalTypes.Remove, run: value };
                                        setModalType(config);
                                        setShowModal(true);
                                    }}
                                >
                                    Remove
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    );
                },
                width: 100,
            },
        ],
        [width, setModalType, setShowModal],
    );

    const defaultColumn = React.useMemo(
        () => ({
            width: 150,
        }),
        [],
    );

    const tableData = React.useMemo(() => (!!data && data.runs ? data.runs : []), [data]) as Run[];

    const itemCount = data.hasMoreResults ? tableData.length + 1 : tableData.length;

    const loadMoreItems = loading ? () => {} : loadNextPage;

    const isItemLoaded = (index: number) => !data.hasMoreResults || index < tableData.length;

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Run>({ columns, data: tableData, defaultColumn }, useBlockLayout);

    const RenderRow = React.useCallback(
        ({ index, style }: any) => {
            const row = rows[index];
            if (!!row) {
                prepareRow(row);
            }

            return isItemLoaded(index) ? (
                <div {...row.getRowProps({ style })}>
                    {row.cells.map((cell) => {
                        return (
                            <div {...cell.getCellProps({ style: { padding: "1rem" } })} className="border-top border-bottom text-center">
                                {cell.render("Cell")}
                            </div>
                        );
                    })}
                </div>
            ) : null;
        },
        // eslint-disable-next-line
        [prepareRow, rows],
    );

    return (
        <div className="d-inline-block" {...getTableProps()}>
            <div>
                {headerGroups.map((headerGroup) => (
                    <div {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <div
                                className="text-muted text-uppercase fs-5 border-top border-bottom text-center"
                                {...column.getHeaderProps({
                                    style: {
                                        backgroundColor: "#F9FBFD",
                                        fontWeight: 600,
                                        letterSpacing: ".08em",
                                        verticalAlign: "middle",
                                        padding: "1rem",
                                    },
                                })}
                            >
                                {column.render("Header")}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div {...getTableBodyProps()}>
                <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
                    {({ onItemsRendered, ref }) => (
                        <FixedSizeList height={400} itemCount={itemCount} itemSize={53} width={width} onItemsRendered={onItemsRendered} ref={ref}>
                            {RenderRow}
                        </FixedSizeList>
                    )}
                </InfiniteLoader>
            </div>
        </div>
    );
};

export default RunTable;
