import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

class NTirpMatrix extends Component {
	state = {
		matrix: [],
		tirp: {},
        currentLevel: 0,
	};
	constructor(props) {
		super(props);
		this.state.tirp = this.props.tirp;
        this.currentLevel = this.props.currentLevel
		if (this.props.show && this.props.currentLevel > 0) {
			this.DrawMatrix();
		}
	}

	DrawMatrix = () => {
        let currTirp = this.props.tirp;
		let symbols = this.props.currentLevel > 0 ? currTirp.elements : [];
		// let relations = currTirp._TIRP__rel;
		let matrix = new Array(symbols.length);
		let iterations = 1;
		let relIndex = 0;
		// let num = 1;

		for (let i = 0; i < matrix.length; i++) {
			matrix[i] = [];
			// num = num + 1 ;
		}
		matrix[0] = symbols.slice(1, symbols.length + 1);
		matrix[0].unshift('');
		let cols = symbols.slice(0, symbols.length - 1);
		for (let i = 1; i < cols.length + 1; i++) {
			matrix[i][0] = cols[i - 1];
		}
		//matrix[0][1].unshift("");
		for (let i = 1; i < symbols.length; i++) {
			for (let j = 1; j < iterations + 1; j++) {
				// matrix[j][i] = relations[relIndex].substring(0, 1);
                matrix[j][i] = this.props.currentLevel === 0 ?  "-" :
                                    symbols[symbols.length - 1].length === 1 ? "before" : "equals"
				relIndex = relIndex + 1;
			}
			iterations = iterations + 1;
		}
		this.state.matrix = matrix;
	};

	draw = () => {
        this.DrawMatrix();
		return this.state.matrix.map((line, i) => (
			<tr key={i}>
				{line.map((num, j) => (
					<td key={j}>{String(num)}</td>
				))}
			</tr>
		));
	};

	render() {
		return (
			<Modal
				{...this.props}
				size='lg'
				aria-labelledby='contained-modal-title-vcenter'
				centered
			>
				<Modal.Header className={'bg-hugobot'} closeButton>
					<Card.Text className={'text-hugobot text-hugoob-advanced'}>Relations</Card.Text>
				</Modal.Header>
				<Modal.Body>
					<table
						style={{
							borderWidth: '2px',
							borderColor: '#aaaaaa',
							borderStyle: 'solid',
						}}
					>
						{this.draw()}
					</table>
				</Modal.Body>
			</Modal>
		);
	}
}

export default NTirpMatrix;
