import React, { Component } from 'react';
// import Chart from "react-google-charts";
import { Row, Col } from 'react-bootstrap';

import SearchAxisPop from '../TirpsContent/SearchAxisPop';

import { Chart as ChartJS, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import axios from 'axios';

ChartJS.register(LinearScale, PointElement, zoomPlugin, Tooltip, Legend, Title);

const X_AXIS = 'X_AXIS';
const Y_AXIS = 'Y_AXIS';
const COLOR_AXIS = 'Bubble Color';
const SIZE_AXIS = 'Bubble Size';

class Tirp {
	constructor(symbols, symbolNames, relations, size, vs0, mhs0, mmd0, vs1, mhs1, mmd1, rating) {
		this.symbols = symbols;
		this.symbolNames = symbolNames;
		this.relations = relations;
		this.size = size;
		this.vs0 = vs0;
		this.mhs0 = mhs0;
		this.mmd0 = mmd0;
		this.vs1 = vs1;
		this.mhs1 = mhs1;
		this.mmd1 = mmd1;
		this.rating = rating;

		this.dmhs = Math.abs(parseFloat(mhs0) - parseFloat(mhs1));
		this.dmmd = Math.abs(parseFloat(mmd0) - parseFloat(mmd1));
	}
}

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

class NSearchGraph extends Component {
	// measureToTitles = {
	// 	vs0: `Vertical Support - ${localStorage.class_name}`,
	// 	mhs0: `Mean Horizontal - ${localStorage.class_name}`,
	// 	mmd0: `Mean Mean Duration - ${localStorage.class_name}`,
	// 	vs1: `Vertical Support - ${localStorage.second_class_name}`,
	// 	mhs1: `Mean Horizontal Support - ${localStorage.second_class_name}`,
	// 	mmd1: `Mean Mean Duration - ${localStorage.second_class_name}`,
	// 	dmhs: 'Delta Mean Horizontal Support',
	// 	dmmd: 'Delta Mean Mean Duration',
	// 	rating: 'Query Rating',
	// };

	measureToTitles = {
		vs: `Vertical Support`,
		mhs: `Mean Horizontal`,
		mmd: `Mean Mean Duration`,
		size: `Num Of Events In Pattern`
	};



	state = {
		axisToMeasure: {
			[X_AXIS]: 'vs',
			[Y_AXIS]: 'mhs',
			[COLOR_AXIS]: 'mmd',
			[SIZE_AXIS]: 'size',
		},
		vnames: [],
	};

	axisToTitle(axis) {
		return this.measureToTitles[this.state.axisToMeasure[axis]];
	}

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

	calculatePerProperty(maxMetric, minMetric, property) {
		const RATE_MAX = 0;
		const RATE_MIN = 1;
		const RATE_MEAN = 2;

		const propertyToMetric = {
			[RATE_MEAN]: Math.abs((maxMetric + minMetric) / 2),
			[RATE_MAX]: maxMetric,
			[RATE_MIN]: minMetric,
		};
		const metric = propertyToMetric[property];
		if (metric === undefined) alert('property should be either mean, max or min');
		return metric;
	}

	calculateQueryRating(size, vs0, vs1, mhs0, mhs1) {
		const delta = (x, y) => Math.abs(x - y);

		const basesParams = [
			{
				measure: 'vs0',
				min: this.props.minVS0,
				max: this.props.maxVS0,
				value: vs0,
			},
			{
				measure: 'mhs0',
				min: this.props.minHS0,
				max: this.props.maxHS0,
				value: mhs0,
			},
			{
				measure: 'size',
				min: this.props.minSize0,
				max: this.props.maxSize0,
				value: size,
			},
		];

		const predictiveBaseParams = [
			{
				measure: 'vs1',
				min: this.props.minVS1,
				max: this.props.maxVS1,
				value: vs1,
			},
			{
				measure: 'mhs1',
				min: this.props.minHS1,
				max: this.props.maxHS1,
				value: mhs1,
			},
		];
		const bases = basesParams
			.concat(this.props.isPredictive ? predictiveBaseParams : [])
			.map((baseParams) => ({
				base: this.calculatePerProperty(
					baseParams.max,
					baseParams.min,
					this.props.measureToRate[baseParams.measure]
				),
				value: baseParams.value,
				measure: baseParams.measure,
			}));

		const queryRating = bases.reduce((acc, curr) => acc + delta(curr.base, curr.value), 0);

		return 500 - queryRating;
	}

	calculateTirps() {
		const tirps = this.props.tirps.map((result) => {
			const symbols = result.elements;
			// const symbolsNumbers = symbols.split(/[(-]+/);
			// const cleanedSymbolsNumber = symbolsNumbers.slice(1, symbolsNumbers.length - 1);
			// const symbolNames = cleanedSymbolsNumber.map(
			// 	(symbolNumber) => this.props.dictionary_states[symbolNumber]
			// );
			// const symbolString = symbolNames.join(',');
			// const relations = result[1];
            const size = result.elements.flat().length
			// const size = parseInt(result[2]);
			// const vs0 = (result[4] / parseInt(localStorage.num_of_entities)) * 100;
			// const vs1 = (result[10] / parseInt(localStorage.num_of_entities_class_1)) * 100;
			// const mhs0 = parseFloat(result[5]);
			// const mhs1 = parseFloat(result[11]);
			// const mmd0 = parseFloat(result[7]);
			// const mmd1 = parseFloat(result[13]);
			// const rating = this.calculateQueryRating(size, vs0, vs1, mhs0, mhs1);
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

	onSelect(tirp) {
		this.props.handleOnSelect(tirp)
		// 	this.props.isPredictive
		// 		? [
		// 				tirp.vs0,
		// 				tirp.vs1,
		// 				tirp.mhs0,
		// 				tirp.mhs1,
		// 				tirp.mmd0,
		// 				tirp.mmd1,
		// 				tirp.size,
		// 				tirp.symbols,
		// 				tirp.relations,
		// 		  ]
		// 		: [
		// 				tirp.vs0,
		// 				tirp.mhs0,
		// 				tirp.mmd0,
		// 				tirp.size,
		// 				tirp.symbols,
		// 				tirp.relations,
		// 				tirp.rating,
		// 		  ]
		// );
	}

	render() {
		const tirps = this.calculateTirps();
		// We are not using the parsing option because it does'nt get updated when the axes change
		const data = tirps.map((tirp) => {
			return {
				...tirp,
				x: tirp[this.state.axisToMeasure[X_AXIS]],
				y: tirp[this.state.axisToMeasure[Y_AXIS]],
			};
		});

		function pickHex(color1, color2, weight) {
			var w1 = weight;
			var w2 = 1 - w1;
			var rgb = [
				Math.round(color1[0] * w1 + color2[0] * w2),
				Math.round(color1[1] * w1 + color2[1] * w2),
				Math.round(color1[2] * w1 + color2[2] * w2),
			];
			return rgb;
		}
		const axisOptions = (axis) => {
			return {
				// beginAtZero: true,
				title: {
					display: true,
					text: this.axisToTitle(axis),
					font: {
						size: 28,
					},
				},
			};
		};

		const dynamicAxes = ['vs', 'mhs', 'mmd', 'size']
		// this.props.isPredictive
		// 	? ['vs0', 'mhs0', 'mmd0', 'vs1', 'mhs1', 'mmd1', 'dmhs', 'dmmd']
		// 	: ['vs0', 'mhs0', 'mmd0'];

		return (
			<div>
				<Row>
					<Col>
						<Bubble
							height={100}
							options={{
								onClick: (e) => {
									const elements = e.chart.getActiveElements();
									if (elements.length > 0) {
										const index = elements[0].index;
										const tirp = tirps[index];
										this.onSelect(tirp);
									}
								},

								responsive: true,
								plugins: {
									legend: {
										display: false,
									},
									tooltip: {
										enabled: true,
										displayColors: false,
										callbacks: {
											title: (items) => {
												const tirp = items[0].raw;
												const symbols = tirp.symbols;
												// const flatSymbols = symbols.flat()
												// const flatNames = flatSymbols.map(element => this.state.vnames[element])
												// return flatNames.join();
												const firstSymbol = symbols.flat()[0]
												return this.state.vnames[firstSymbol]
											},
											label: (item) => {
												const properties = 
														{
															VS: 'vs',
															MHS: 'mhs',
															MMD: 'mmd',
															Size: 'size',
													  	};
												return Object.entries(properties).map(
													([name, value]) => {
														return `${name}: ${item.raw[value].toFixed(
															2
														)}`;
													}
												);
											},
										},
									},
									zoom: {
										pan: {
											enabled: true,
											mode: 'xy',
										},
										zoom: {
											// drag: {
											// 	enabled: true,
											// },
											wheel: {
												enabled: true,
											},
											pinch: {
												enabled: true,
											},
											mode: 'xy',
										},
									},
								},

								scales: {
									y: axisOptions(Y_AXIS),
									x: axisOptions(X_AXIS),
								},
								elements: {
									point: {
										borderColor: (context) => {
											if (!context.raw) return undefined;

											const tirp = context.raw;
											// if (
											// 	tirp.relations === this.props.selectedRelations &&
											// 	tirp.symbols === this.props.selectedSymbols
											// ) {
											// 	return 'black';
											// }
											return '#C9C9C9';
										},
										borderWidth: (context) => {
											if (!context.raw) return undefined;

											const tirp = context.raw;
											// if (
											// 	tirp.relations === this.props.selectedRelations &&
											// 	tirp.symbols === this.props.selectedSymbols
											// ) {
											// 	return 2.5;
											// }
											return 1;
										},
										backgroundColor: (context) => {
											if (!context.raw) return undefined;

											const rawToValue = (raw) =>
												raw[this.state.axisToMeasure[COLOR_AXIS]];
											const colors = context.dataset.data.map((point) =>
												rawToValue(point)
											);
											const minColor = Math.min(...colors);
											const maxColor = Math.max(...colors);
											const delta = maxColor - minColor;
											const normalizedColor =
												(rawToValue(context.raw) - minColor) /
												(delta === 0 ? 1 : delta);

											const [r, g, b] = pickHex(
												[0, 0, 255],
												[255, 255, 255],
												normalizedColor
											);
											return `rgb(${r},${g},${b})`;
										},
										radius: (context) => {
											if (!context.raw) return undefined;

											const radiuses = context.dataset.data.map(
												(point) => point.size
											);
											const minRadius = Math.min(...radiuses);
											const maxRadius = Math.max(...radiuses);
											const delta = maxRadius - minRadius;
											const normalizedRadius =
												(context.raw.size - minRadius) /
												(delta === 0 ? 1 : delta);

											return 10 + normalizedRadius * 10;
										},
									},
								},
							}}
							data={{ datasets: [{ data }] }}
						/>

						<div className='gradient'>{this.axisToTitle(COLOR_AXIS)}</div>
					</Col>
				</Row>

				<SearchAxisPop
					axes={this.state.axisToMeasure}
					options={{
						[X_AXIS]: dynamicAxes,
						[Y_AXIS]: dynamicAxes,
						[COLOR_AXIS]: dynamicAxes,
						[SIZE_AXIS]: ['size'],
					}}
					measureToTitles={this.measureToTitles}
					onChange={(newAxisToMeasure) => {
						this.setState({
							axisToMeasure: newAxisToMeasure,
						});
					}}
				></SearchAxisPop>
			</div>
		);
	}
}

export default NSearchGraph;
