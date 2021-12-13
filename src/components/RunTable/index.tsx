import React from 'react'
import { useTable, Column } from 'react-table';
import { RunView } from '../../types/run';

type OwnProps = {
  columns: Column<RunView>[],
  data: RunView[]
}

const RunTable = <T extends object>({ columns, data } : OwnProps) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<RunView>({ columns, data})

  return (
    <div className="table-responsive mb-0" style={{minHeight: "300px"}}>
      <table className="table table-sm table-nowrap table-hover card-table" {...getTableProps()}>
        <thead>
          { headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              { headerGroup.headers.map(column => (
                <th>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="list" {...getTableBodyProps()}>
          { rows.map(row => {
            prepareRow(row)
            return (
              <tr className="border-bottom" {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default RunTable;