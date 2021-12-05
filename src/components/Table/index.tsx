import React from 'react'
import { useTable, Column } from 'react-table';
import { Table as SemanticTable } from 'semantic-ui-react';

type OwnProps<T extends object> = {
  columns: Column<T>[],
  data: T[]
}

const Table = <T extends object>({ columns, data } : OwnProps<T>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<T>({ columns, data})

  return (
    <SemanticTable selectable {...getTableProps()}>
      <SemanticTable.Header>
        { headerGroups.map(headerGroup => (
          <SemanticTable.Row {...headerGroup.getHeaderGroupProps()}>
            { headerGroup.headers.map(column => (
              <SemanticTable.HeaderCell>{column.render('Header')}</SemanticTable.HeaderCell>
            ))}
          </SemanticTable.Row>
        ))}
      </SemanticTable.Header>
      <SemanticTable.Body {...getTableBodyProps()}>
        { rows.map(row => {
          prepareRow(row)
          return (
            <SemanticTable.Row {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <SemanticTable.Cell {...cell.getCellProps()}>{cell.render('Cell')}</SemanticTable.Cell>
              })}
            </SemanticTable.Row>
          )
        })}
      </SemanticTable.Body>
    </SemanticTable>
  )
}

export default Table;