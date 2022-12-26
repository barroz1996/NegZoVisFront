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

		const mapping = symbols.reduce((acc, innerArray, arrayIndex) => {
			return acc.concat(innerArray.map((value, valueIndex) => ({
			  value,
			  arrayIndex,
			  valueIndex: acc.length + valueIndex + 1,
			})));
		  }, []);
	
		// let relations = currTirp._TIRP__rel;
		const matrix = [];
		let mElements = elements.slice(1, elements.length + 1);
		mElements = [""].concat(mElements)

		// Add the first row with the elements in their order
		matrix.push(mElements);

		// Nested loop to compare every two values
		for (let i = 0; i < elements.length - 1; i++) {
		  matrix[i + 1] = [elements[i]];
		}
		for (let i = 1; i < elements.length; i++) {
		  for (let j = 1; j < elements.length; j++) {
			let row_element;
			mapping.forEach(element => {
				if (element.valueIndex === j) {
					row_element = element.arrayIndex
				}
			});
			let col_element;
			mapping.forEach(element => {
				if (element.valueIndex - 1 === i) {
					col_element = element.arrayIndex
				}
			});
			if(row_element === col_element) {
				matrix[j][i] = "equals"
			}
			if(row_element < col_element) { 
				matrix[j][i] = "before"
			}
			if(row_element > col_element) { 
				matrix[j][i] = ""
			}
			if(j > i) {
				matrix[j][i] = ""
			}
		  }
		}

		this.state.matrix = matrix
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
