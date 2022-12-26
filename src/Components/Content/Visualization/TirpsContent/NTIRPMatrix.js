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
		let symbols = this.props.currentLevel > 0 ? currTirp.elements : [[]];
        const elements = [].concat(...symbols);
		// let relations = currTirp._TIRP__rel;
		let matrix = new Array(elements.length);
		let iterations = 1;
		// let relIndex = 0;
		// let num = 1;

		for (let i = 0; i < matrix.length; i++) {
			matrix[i] = [];
			// num = num + 1 ;
		}

		for(let i = 0; i < matrix.length; i++){
			for(let j=0; j < matrix.length; j++){
				matrix[i][j] = ""
			}
		}

		matrix[0] = elements.slice(1, elements.length + 1);
		matrix[0].unshift('');
		let cols = elements.slice(0, elements.length - 1);
		for (let i = 1; i < cols.length + 1; i++) {
			matrix[i][0] = cols[i - 1];
		}
		//matrix[0][1].unshift("");
		for (let i = 1; i < elements.length;  i++) {
            let relIndex = 0;
			for (let j = 1; j < iterations + 1 ; j++) {
                matrix[j][i] = symbols[relIndex].length === 1 ? "before" : "equals"
                relIndex = (relIndex + j) % (symbols.length)
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
