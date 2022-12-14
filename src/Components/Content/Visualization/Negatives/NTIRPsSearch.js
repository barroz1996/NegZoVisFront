import React, { Component } from 'react';
import { Container, ToggleButtonGroup, ToggleButton, Col, Row, Button } from 'react-bootstrap';

import NSearchGraph from './NSearchGraph';
import NSearchMeanPresentation from './NSearchMeanPresentation'
import PsearchMeanPresentation from '../TirpsContent/PsearchMeanPresentation';
import NTIRPTimeLine from './NTIRPTimeLine'
import TIRPsPie from '../TirpsContent/TIRPsPie';
import DTirpBarPlot from '../TirpsContent/DTirpBarPlot';
import SymbolPop from '../TirpsContent/SymbolPop';
import NSearchTable from './NSearchTable';
import axios from 'axios';
import NSearchIntervals from './NSearchIntervals';
import SearchNLimits from './SearchNLimits';

import {
	getSubTree,
	searchTirps1Class,
	searchTirps2Class,
} from '../../../../networking/requests/visualization';

class NTIRPsSearch extends Component {
	constructor(props) {
		super(props);

		// const tables = JSON.parse(localStorage.States);
		// const statesEntries = tables.States.map((state) => {
		// 	const part2 = state.BinLabel ?? state.BinLabel;
		// 	const part1 = state.TemporalPropertyName ?? state.TemporalPropertyID;

		// 	const name = part1 + '.' + part2;

		// 	return [state.StateID, name];
		// });
		// const statesDict = Object.fromEntries(statesEntries);
		// const stateIDs = Object.keys(statesDict);

		this.open_route()

		this.state = {
			parameters: {
				minSizeCls0: 1,
				maxSizeCls0: 10,
				minHSCls0: 1,
				maxHSCls0: 100,
				minVSCls0: Math.round(parseFloat(localStorage.min_ver_support) * 100),
				maxVSCls0: 100,

				minHSCls1: 1,
				maxHSCls1: 100,
				minVSCls1: Math.round(parseFloat(localStorage.min_ver_support) * 100),
				maxVSCls1: 100,
			},

			minMMD: 0,
			maxMMD: 100,

			// startList: stateIDs,
			// containList: stateIDs,
			// endList: stateIDs,
			
			// dictionary_states: statesDict,
			// totalNumSymbols: stateIDs.length,

			showGraph: true,
			canExplore: false,
			searchResults: [],
			selected: [],
			measureToRate: {
				vs0: 2,
				vs1: 2,
				mhs0: 2,
				mhs1: 2,
				size: 2,
			},

			allTirps: {},
			chosenTIRP: undefined,
			modalShowRawPop: false,


			/////// OUR //////////
			outputAlgoritm : [],
			vnames : [],
			startNList: [],
			containNList: [],
			endNList: [],
			NmeasureToRate: {
				vs0: 2,
				mhs0: 2,
				size: 2,
			},
			Nparameters: {
				minSizeCls0: 1,
				maxSizeCls0: 10,
				minHSCls0: 1,
				maxHSCls0: 100,
				minVSCls0: 1,
				maxVSCls0: 100,
			},
			NSelected: []
		};
		this.getAllTirps();
	}

	async open_route() {
		let url = 'http://127.0.0.1:443/get_negative_data'
		const promise = await axios.get(url)
		this.setState({
			outputAlgoritm: promise.data
		})
		let surl = 'http://127.0.0.1:443/get_negative_variables'
		const spromise = await axios.get(surl)
		this.setState({
			vnames: spromise.data
		})
	}

	async getAllTirps() {
		const visualizationId = sessionStorage.getItem('visualizationId');
		const firstLevel = JSON.parse(localStorage.rootElement);
		const subTreesPromises = firstLevel.map(async (tirp) => {
			if (tirp._TIRP__childes.length === 0) return [];

			const data = await getSubTree(tirp._TIRP__symbols[0], visualizationId);
			const tirpsFamily = data['TIRPs'];
			const tirpChildrenArr = tirpsFamily['_TIRP__childes'];
			return tirpChildrenArr;
		});
		const subTressArray = await Promise.all(subTreesPromises);
		const subTress = subTressArray.map((subTree) =>
			this.flatTree(subTree, (tirp) => tirp['_TIRP__childes'])
		);
		const childrenTirps = subTress.flat();

		const allTirps = firstLevel.concat(childrenTirps);
		const allTirpsEntries = allTirps.map((tirp) => [tirp['_TIRP__unique_name'], tirp]);

		this.setState({
			allTirps: Object.fromEntries(allTirpsEntries),
		});
	}

	flatTree(tree, getChildren) {
		return tree.reduce((acc, curr) => {
			const children = getChildren(curr);
			const subTree = this.flatTree(children, getChildren);
			return acc.concat([curr, ...subTree]);
		}, []);
	}

	async componentDidMount() {
		await this.open_route()
	}

	changeParameter = (event) => {
		const parameterName = event.target.name;
		const parameterRawValue = parseInt(event.target.value);
		// const parameterValue = Math.max(parameterRawValue, event.target.min);
		const parameterValue = Math.max(parameterRawValue, 1);
		const newParameters = { ...this.state.parameters, [parameterName]: parameterValue };
		this.setState({ parameters: newParameters });
	};

	changeNParameter = (event) => {
		const parameterName = event.target.name;
		const parameterRawValue = parseInt(event.target.value);
		// const parameterValue = Math.max(parameterRawValue, event.target.min);
		const parameterValue = Math.max(parameterRawValue, 1);
		const newParameters = { ...this.state.Nparameters, [parameterName]: parameterValue };
		this.setState({ Nparameters: newParameters });
	};

	async searchTirps() {
		const visualizationId = sessionStorage.getItem('visualizationId');
		const data = this.props.isPredictive
			? await searchTirps2Class(
					true,
					this.state.startList,
					this.state.containList,
					this.state.endList,
					this.state.parameters.minHSCls0,
					this.state.parameters.maxHSCls0,
					this.state.parameters.minVSCls0,
					this.state.parameters.maxVSCls0,
					this.state.parameters.minHSCls1,
					this.state.parameters.maxHSCls1,
					this.state.parameters.minVSCls1,
					this.state.parameters.maxVSCls1,
					visualizationId,
					this.state.startList.length !== this.state.totalNumSymbols,
					this.state.containList.length !== this.state.totalNumSymbols,
					this.state.endList.length !== this.state.totalNumSymbols
			  )
			: await searchTirps1Class(
					'',
					this.state.startList,
					this.state.containList,
					this.state.endList,
					this.state.parameters.minHSCls0,
					this.state.parameters.maxHSCls0,
					this.state.parameters.minVSCls0,
					this.state.parameters.maxVSCls0,
					visualizationId,
					this.state.startList.length !== this.state.totalNumSymbols,
					this.state.containList.length !== this.state.totalNumSymbols,
					this.state.endList.length !== this.state.totalNumSymbols
			  );

		// const SIZE_IDX = 2;
		const searchResults = data['Results'].map((result) => result.split(','));
		// .filter(
		// 	(result) =>
		// 		parseInt(result[SIZE_IDX]) >= this.state.parameters.minSizeCls0 &&
		// 		parseInt(result[SIZE_IDX]) <= this.state.parameters.maxSizeCls0 &&
		// 		parseInt(result[SIZE_IDX]) >= this.state.parameters.minSizeCls1 &&
		// 		parseInt(result[SIZE_IDX]) <= this.state.parameters.maxSizeCls1
		// );

		this.setState({ searchResults });
		const scrollToElement = document.querySelector('.results-container');
		scrollToElement.scrollIntoView({ behavior: 'smooth' });
	}

	async searchNTirps() {
		let searchResults = this.state.outputAlgoritm

		if(this.state.startNList.length > 0){
			searchResults = searchResults.filter((row) =>
				row.negatives[0] ? 
						this.state.startNList.includes(String.fromCharCode(172) + this.state.vnames[row.elements[0][0]])
					:
						this.state.startNList.includes(this.state.vnames[row.elements[0][0]])
			) 
		}

		if(this.state.endNList.length > 0 ){
			searchResults = searchResults.filter((row) =>
				row.negatives[row.elements.length - 1] ? 
						this.state.endNList.includes(String.fromCharCode(172) + this.state.vnames[row.elements[row.elements.length - 1][row.elements[row.elements.length - 1].length - 1]])
					:
						this.state.endNList.includes(this.state.vnames[row.elements[row.elements.length - 1][row.elements[row.elements.length - 1].length - 1]])
				
			) 
		}

		if(this.state.containNList.length > 0 ){
			searchResults = searchResults.filter((row) => {
				let found = false
				let copyrow = []
				for (var i = 0; i < row.elements.length; i++)
    					copyrow[i] = row.elements[i].slice();

				copyrow[0] = copyrow[0].slice(1)
				copyrow[copyrow.length - 1] = copyrow[0].slice(0, copyrow.length - 1)

				copyrow.forEach( (row_i, index_i) => {
					row_i.forEach(element_j => {
						if (!found){
							found = row.negatives[index_i] ? 
									this.state.containNList.includes(String.fromCharCode(172) + this.state.vnames[element_j])
								:
									this.state.containNList.includes(this.state.vnames[element_j])
						}
					})
				})
				return found
			}) 
		}

		searchResults = searchResults.filter((row) =>
							this.state.Nparameters.minSizeCls0 <= row.elements.flat().length && row.elements.flat().length <= this.state.Nparameters.maxSizeCls0 && 
							this.state.Nparameters.minHSCls0 <= row['mean horizontal support']  && row['mean horizontal support'] <= this.state.Nparameters.maxHSCls0 
							// this.state.Nparameters.minVSCls0 <= (row['support'] / this.state.outputAlgoritm) * 100  &&
							//                                     (row['support'] / this.state.outputAlgoritm) * 100 <= this.state.Nparameters.maxVSCls0
		)


		this.setState({ searchResults });
		const scrollToElement = document.querySelector('.results-container');
		scrollToElement.scrollIntoView({ behavior: 'smooth' });
	}


	showTableOrGraph = () => {
		const radios = ['Graph', 'Table'];
		return (
			<Col sm={12} className='mb-4'>
				<ToggleButtonGroup defaultValue={0} name='options' style={{ width: '100%' }}>
					{radios.map((radio, idx) => (
						<ToggleButton
							className={'bg-hugobot-toggle-button'}
							key={idx}
							type='radio'
							color='info'
							name='radio'
							value={idx}
							onChange={() => this.setState({ showGraph: radio === 'Graph' })}
						>
							{radio}
						</ToggleButton>
					))}
				</ToggleButtonGroup>
			</Col>
		);
	};

	handleOnSelect(newSelected) {
		this.setState({
			NSelected: newSelected.row,
			canExplore: true
		});


		// const rawSymbols = newSelected[this.props.isPredictive ? 7 : 4];
		// const symbols = rawSymbols.slice(1, rawSymbols.length - 1);
		// const rawRelations = newSelected[this.props.isPredictive ? 8 : 5];
		// const relations = rawRelations.slice(0, rawRelations.length - 1);
		// const unique_name = symbols + '|' + relations;

		// this.setState({
		// 	selected: newSelected,
		// 	canExplore: true,
		// 	chosenTIRP: this.state.allTirps[unique_name],
		// });
	}

	render() {
		const type_of_comp = this.props.isPredictive ? 'disc' : 'tirp';
		return (
			<Container fluid>
				<Row>
					<Col sm={8}>
						<Row style={{ position: 'absolute', height: '100%' }}>
							<Col sm={4} style={{ height: '100%' }}>
								<NSearchIntervals
									title='First'
									vnames = {this.state.vnames}
									changeList={(startNList) => this.setState({ startNList })}
								/>
							</Col>
							<Col sm={4} style={{ height: '100%' }}>
								<NSearchIntervals
									title='Intermediate'
									vnames = {this.state.vnames}
									changeList={(containNList) => this.setState({ containNList })}
								/>
							</Col>
							<Col sm={4} style={{ height: '100%' }}>
								<NSearchIntervals
									title='Last'
									vnames = {this.state.vnames}
									changeList={(endNList) => this.setState({ endNList })}
								/>
							</Col>
						</Row>
					</Col>
					<Col sm={4}>
						<SearchNLimits
							searchTirps={this.searchNTirps.bind(this)}
							NmeasureToRate={this.state.NmeasureToRate}
							changeMeasureToRate={(NmeasureToRate) =>
								this.setState({ NmeasureToRate })
							}
							parameters={this.state.Nparameters}
							changeParameter={this.changeNParameter}
							isPredictive={this.props.isPredictive}
						/>
					</Col>
				</Row>
				<Row className='results-container'>
					<Col sm={8}>
						{this.showTableOrGraph()}
						{this.state.showGraph ? (
							<NSearchGraph
								// isPredictive={this.props.isPredictive}
								// minVS0={this.state.parameters.minVSCls0}
								// maxVS0={this.state.parameters.maxVSCls0}
								// minHS0={this.state.parameters.minHSCls0}
								// maxHS0={this.state.parameters.maxHSCls0}
								// minSize0={this.state.parameters.minSizeCls0}
								// maxSize0={this.state.parameters.maxSizeCls0}
								// minVS1={this.state.parameters.minVSCls1}
								// maxVS1={this.state.parameters.maxVSCls1}
								// minHS1={this.state.parameters.minHSCls1}
								// maxHS1={this.state.parameters.maxHSCls1}
								handleOnSelect={this.handleOnSelect.bind(this)}
								// measureToRate={this.state.measureToRate}
								// selectedSymbols={
								// 	this.state.selected[this.props.isPredictive ? 7 : 4]
								// }
								// selectedRelations={
								// 	this.state.selected[this.props.isPredictive ? 8 : 5]
								// }
								tirps={this.state.searchResults}
								// dictionary_states={this.state.dictionary_states}
							/>) 
						:
						(
							<NSearchTable
								handleOnSelect={this.handleOnSelect.bind(this)}
								// isPredictive={this.props.isPredictive}
								tirps={this.state.searchResults}
							/>
						)}
					</Col>
					<Col sm={4}>
						<Row>
							<Col sm={1}></Col>
							<Col sm={11}>
								{Object.keys(this.state.NSelected).length > 0  && (
									// <SelectedNTirpsTable 
									// 	currentLevel={0}
									// 	currentTirp={this.state.NSelected}
									// 	numOfSymbolInSelctedPath={this.state.NSelected.elements.flat().length}
								
									// ></SelectedNTirpsTable> 
									<NSearchMeanPresentation
										canExplore={this.state.canExplore}
										tirp={this.state.NSelected}
										// vs={this.state.NSelected['support']}
										// mhs={this.state.NSelected['mean horizontal support']}
										// mmd={this.state.NSelected['mean mean duration']}
										// currentLevel={this.state.selected[3]}
										// symbols={this.state.selected[4]}
										// relations={this.state.selected[5]}
										// row={this.state.NSelected.row}
								/>
								)}
								{/* {this.props.isPredictive ? (
									<PsearchMeanPresentation
										canExplore={this.state.canExplore}
										vs1={this.state.selected[1]}
										vs0={this.state.selected[0]}
										mmd1={this.state.selected[4]}
										mmd0={this.state.selected[5]}
										mhs1={this.state.selected[2]}
										mhs0={this.state.selected[3]}
										currentLevel={this.state.selected[6]}
										symbols={this.state.selected[7]}
										relations={this.state.selected[8]}
									/>
								) : (
									<SearchMeanPresentation
										canExplore={this.state.canExplore}
										vs={this.state.selected[0]}
										mhs={this.state.selected[1]}
										mmd={this.state.selected[2]}
										currentLevel={this.state.selected[3]}
										symbols={this.state.selected[4]}
										relations={this.state.selected[5]}
										row={this.state.selected}
									/>
								)} */}
							</Col>
						</Row>
					</Col>
				</Row>
				{Object.keys(this.state.NSelected).length > 0 && (
					<Row>
						{/* <Col sm={4}>
							<TIRPsPie row={null} type_of_comp={'disc'} />
						</Col> */}
						{/* {this.props.isPredictive && (
							<Col lg={3}>
								<DTirpBarPlot row={this.state.chosenTIRP} />
							</Col>
						)} */}
						<Col sm={8}>
							<NTIRPTimeLine
								tirp={this.state.NSelected}
								vnames={this.state.vnames}
							/>
						</Col>
					</Row>
				)}
			</Container>
		);
	}
}

export default NTIRPsSearch;
