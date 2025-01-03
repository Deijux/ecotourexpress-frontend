import Styles from './PageSchema.module.css'
import PropTypes from 'prop-types'
import { useState } from 'react'

function PageSchema({
	title,
	columns,
	data,
	actions,
	activeModal,
	handleRowClick,
	dataInitialState,
}) {
	const [selectedRowIndex, setSelectedRowIndex] = useState(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [rowsPerPage, setRowsPerPage] = useState(5)

	const indexOfLastRow = currentPage * rowsPerPage
	const indexOfFirstRow = indexOfLastRow - rowsPerPage
	const currentRows = data.slice(indexOfFirstRow, indexOfLastRow)

	const totalPages = Math.ceil(data.length / rowsPerPage)

	const handleClick = (e, rowIndex, row) => {
		e.stopPropagation()

		setSelectedRowIndex(prevIndex => {
			if (prevIndex === rowIndex) {
				handleRowClick(dataInitialState)
				return null
			}
			handleRowClick(row)
			return rowIndex
		})
	}

	const paginate = pageNumber => setCurrentPage(pageNumber)

	return (
		<main className={Styles.main}>
			<section className={Styles.subHeader}>
				<ul>
					{actions.map((action, index) => (
						<li key={index}>
							<button onClick={() => activeModal(action.label)}>
								<i className={action.icon}></i>
								{action.label}
							</button>
						</li>
					))}
				</ul>
			</section>
			<section className={Styles.content}>
				<div className={Styles.titleBox}>
					<h1>{title}</h1>
				</div>
				<div className={Styles.containerAllTable}>
					<div className={Styles.tableContainer}>
						<table>
							<thead>
								<tr>
									{columns.map((column, index) => (
										<th key={index}>{column.header}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{Array.isArray(currentRows) && currentRows.length > 0 ? (
									currentRows.map((row, rowIndex) => (
										<tr
											key={rowIndex}
											onClick={e => {
												handleClick(e, rowIndex, row)
											}}
											style={{
												backgroundColor:
													selectedRowIndex === rowIndex
														? 'rgb(31, 41, 55)'
														: 'transparent',
											}}
										>
											{columns.map((column, colIndex) => (
												<td key={colIndex}>{row[column.column]}</td>
											))}
										</tr>
									))
								) : (
									<tr>
										<td colSpan={columns.length}>No hay datos disponibles</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
					<div className={Styles.pagination}>
						<button onClick={() => paginate(1)} disabled={currentPage === 1}>
							Inicio
						</button>
						<button
							onClick={() => paginate(currentPage - 1)}
							disabled={currentPage === 1}
						>
							Anterior
						</button>
						<span>
							{currentPage} - {totalPages === 0 ? 1 : totalPages}
						</span>
						<button
							onClick={() => paginate(currentPage + 1)}
							disabled={currentPage === totalPages || totalPages === 0}
						>
							Siguiente
						</button>
						<button
							onClick={() => paginate(totalPages)}
							disabled={currentPage === totalPages || totalPages === 0}
						>
							Final
						</button>
						<div className={Styles.rowsPerPage}>
							<label htmlFor='rowsPerPage'>Filas por página</label>
							<select
								name='rowsPerPage'
								id='rowsPerPage'
								onChange={e => setRowsPerPage(e.target.value)}
							>
								<option value='5'>5</option>
								<option value='10'>10</option>
								<option value='15'>15</option>
								<option value='20'>20</option>
							</select>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}

PageSchema.proptypes = {
	title: PropTypes.string,
	columns: PropTypes.shape({
		column: PropTypes.string,
		header: PropTypes.string,
	}),
	data: PropTypes.array,
	actions: PropTypes.arrayOf({
		label: PropTypes.string,
		icon: PropTypes.string,
	}),
	activeModal: PropTypes.func,
	handleRowClick: PropTypes.func,
	dataInitialState: PropTypes.object,
}

export default PageSchema
