import React, { Component } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
const headerSortingStyle = { backgroundColor: '#c8e6c9' };

class NTirp {
	constructor(symbols, size, vs, mhs, mmd, row) {
		this.symbols = symbols;
		this.size = size;
		this.vs = vs;
		this.mhs = mhs;
		this.mmd = mmd;
		this.row = row

		// this.dmhs = Math.abs(parseFloat(mhs0) - parseFloat(mhs1));
		// this.dmmd = Math.abs(parseFloat(mmd0) - parseFloat(mmd1));
	}
}

class NSearchTable extends Component {
	state = {
		sortFunc: undefined,
		sortedCol: null,
		sortAsc: true,
		selectedTirp: null,

        vnames: []
	};

    async componentDidMount() {
		let allVnames = []  
		let surl = 'http://127.0.0.1:443/get_negative_variables'
		const spromise = await axios.get(surl)
		for (const [key, value] of Object.entries(spromise.data)) {
            allVnames.push(value)
            allVnames.push(String.fromCharCode(172) + value)
          }
		this.setState({
			vnames: allVnames, 
		})
	}

	computeStates() {
		const statesTable = JSON.parse(localStorage.States);
		const statesEntries = statesTable.States.map((state) => {
			const property = state.TemporalPropertyName ?? state.TemporalPropertyID;
			const bin = state.BinLabel ?? state.BinID;
			const name = property + '.' + bin;
			return [state.StateID, name];
		});
		return Object.fromEntries(statesEntries);
	}

	parseTirps() {
        const tirps = this.props.tirps.map((result) => {
			const symbols = result.elements;
            const size = result.elements.flat().length
            const vs = result['support']
            const mhs = result['mean horizontal support']
            const mmd = result['mean mean duration']

			return new NTirp(
				symbols,
				size,
				vs,
				mhs,
				mmd,
				result
			);
		});

		return tirps;
	}

	getSymbols(symbolsRawStr) {
		// symbolsRawStr of format: '(11-12-'
		const states = this.computeStates();
		const cleanedSymbolsRawStr = symbolsRawStr.substring(1, symbolsRawStr.length - 1);
		const symbols = cleanedSymbolsRawStr.split('-');
		const symbolsNames = symbols.map((symbol) => states[symbol]);
		return symbolsNames.join('-');
	}

	handleOnSelect = (tirp, index) => {
        this.props.handleOnSelect(tirp)
	};

	render() {
		const data = this.parseTirps()
		const stringSort = (a, b, numeric) => {
			return a.localeCompare(b, navigator.languages[0] || navigator.language, {
				numeric,
				ignorePunctuation: true,
			});
		};

		const renderColumn = (columnName, columnTitle, numeric = true) => {
			const selected = this.state.sortedCol === columnName;
			const attributes = {
				onClick: () => {
					const sortFunc = (a, b) => {
						return this.state.sortAsc
							? stringSort(a[columnName], b[columnName], numeric)
							: stringSort(b[columnName], a[columnName], numeric);
					};
					this.setState((state) => ({
						sortFunc,
						sortedCol: columnName,
						sortAsc: !state.sortAsc,
					}));
				},
				style: selected ? headerSortingStyle : {},
			};
			return (
				<th {...attributes}>
					{selected && <i className='fa fa-sort mr-2'></i>}
					{columnTitle}
				</th>
			);
		};
		return (
			<Row>
				<Col>
					<div className='search-table'>
						<Table
							striped={true}
							bordered={true}
							hover={true}
							style={{ tableLayout: 'fixed', textAlign: 'center' }}
						>
							<thead>
								<tr>
									{renderColumn('size', 'Size')}
									{renderColumn('symbols', 'Symbols')}
									{renderColumn('vs', 'V.S', true)}
									{renderColumn('mhs', 'M.H.S', true)}
									{renderColumn('mmd', 'M.M.D', true)}
								</tr>
							</thead>
							<tbody>
								{data.map((tirp, index) => {
									const selected = this.state.selectedTirp === index;
									return (
										<tr
											key={index}
											onClick={() => {
												this.handleOnSelect(tirp, index);
											}}
											style={selected ? { backgroundColor: '#AED6F1' } : {}}
										>
											<td>{tirp.size}</td>
											<td>{tirp.symbols.map(symbol => this.state.vnames[symbol]).join()}</td>
											<td>{tirp.vs}</td>
											<td>{tirp.mhs}</td>
											<td>{tirp.mmd}</td>
										</tr>
									);
								})}
								{data.length === 0 && (
									<tr>
										<td colSpan={this.props.isPredictive ? 10 : 6}>Empty</td>
									</tr>
								)}
							</tbody>
						</Table>
					</div>
				</Col>
			</Row>
		);
	}
}
export default NSearchTable;
