import React, { Component } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

class NSearchIntervals extends Component {
	constructor(props) {
		super(props);

		const intervals = this.props.intervals;
		const stateIDs = Object.keys(intervals);
		this.data = stateIDs.map((stateID) => ({ id: stateID, name: intervals[stateID] }));
		this.state = {
			filter: '',
			selected: stateIDs,
            vnames: [],
		};
	}

    async open_route() {
		let surl = 'http://127.0.0.1:443/get_negative_variables'
		const spromise = await axios.get(surl)
		this.setState({
			vnames: spromise.data
		})

        let allVnames = []     
        for (const [key, value] of Object.entries(this.state.vnames)) {
            allVnames.push(value)
            allVnames.push(String.fromCharCode(172) + value)
          }

        this.setState({
			vnames: allVnames
		})

        console.log("vnames: ")
        console.log(this.state.vnames)
	}


    componentDidMount() {
		this.open_route()
	}

    getAllVnames(){
        // let allVnames = []     
        // for (const [key, value] of Object.entries(this.state.vnames)) {
        //     allVnames.push(value)
        //     allVnames.push(String.fromCharCode(172) + value)
        //   }

        // this.setState({
		// 	vnames: allVnames
		// })

        // console.log("vnames: ")
        // console.log(this.state.vnames)
    }


	handleOnSelect = (selected, id) => {
		const newSelected = selected
			? this.state.selected.filter((x) => x !== id)
			: [...this.state.selected, id];

		this.setState({ selected: newSelected });
		this.props.changeList(newSelected);
	};

	handleOnSelectAll = () => {
		const allSelected = this.state.selected.length === this.data.length;
		let newSelected = allSelected ? [] : this.data.map((r) => r.id);
		this.setState({ selected: newSelected });
		this.props.changeList(newSelected);
	};

	render() {
        this.getAllVnames()
		return (
			<div className='intervals'>
				<div className='vertical-scroll-intervals'>
					<Table
						striped={true}
						bordered={true}
						hover={true}
						className='btable'
						style={{ tableLayout: 'fixed', textAlign: 'center' }}
					>
						<thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
							<tr>
								<th
									onClick={() => this.handleOnSelectAll()}
									style={{ width: '10%' }}
								>
									<input
										type='checkbox'
										// checked={this.state.selected.length === this.data.length}
										onChange={() => this.handleOnSelectAll()}
									/>
								</th>
								<th style={{fontSize: 'large'}}>{this.props.title + " Symbol"}</th>
							</tr>
							<tr>
								<th></th>
								<th style={{ paddingBottom: 0, paddingTop: 0 }}>
									<input
										type='text'
										className={'filter-input FontAwesome'}
										style={{ color: '#d7dfdf' }}
										placeholder='&#xF002; Filter'
										// value={this.state.filter}
                                        value={this.state.vnames}
										// onChange={(e) => this.setState({ filter: e.target.value })}
									/>
								</th>
							</tr>
						</thead>
						<tbody>
							{this.state.vnames
								// .filter((symbol) => (symbol).toLowerCase().includes((this.state.filter).toLowerCase()))
                                .filter((symbol) => (symbol).toLowerCase())
								.map((symbol, index) => {
									const selected = false;
									// const checked =
									// 	this.state.selected.find((id) => id === symbol.id) !==
									// 	undefined;
									return (
										<tr
											key={index}
											// onClick={() => this.handleOnSelect(checked, symbol)}
											style={selected ? { backgroundColor: '#AED6F1' } : {}}
										>
											<td>
												<input
													type='checkbox'
													// checked={checked}
													// onChange={() =>
													// 	this.handleOnSelect(checked, symbol)
													// }
												/>
											</td>
											<td>{symbol}</td>
										</tr>
									);
								})}
						</tbody>
					</Table>
				</div>
			</div>
		);
	}
}

export default NSearchIntervals;
