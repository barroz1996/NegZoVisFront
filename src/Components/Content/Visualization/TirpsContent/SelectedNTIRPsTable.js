import React, { Component } from 'react';
import { Card, Table } from 'react-bootstrap';

class SelectedNTirpsTable extends Component {
	state = {
        currentLevel: this.props.currentLevel, 
		currentTirp: this.props.currentTirp,
		numOfSymbolInSelctedPath: this.props.numOfSymbolInSelctedPath
    };

	arrayEquals(a, b) {
		return Array.isArray(a) &&
		  Array.isArray(b) &&
		  a.length === b.length &&
		  a.every((val, index) => val === b[index]);
	  }


	renderSelectedTirp = () => {
		this.state.currentLevel = this.props.currentLevel
		this.state.currentTirp = this.props.currentTirp
		this.state.numOfSymbolInSelctedPath = this.props.numOfSymbolInSelctedPath

		return this.renderNTirpTable(this.state.currentLevel, this.state.currentTirp, this.state.numOfSymbolInSelctedPath)
	}

	renderNTirpTable = (level, tirp, entitesSize) => {
		return (
			<>
				<thead>
					<tr>
						<th style={{ textAlign: 'left' }}>Metric</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th style={{ textAlign: 'left' }}>Current level</th>
						<td>{level}</td>
					</tr>
					<tr>
						<th style={{ textAlign: 'left' }}>Vertical support</th>
						<td>
							{!this.arrayEquals(tirp, []) && tirp['support'] }
						</td>
					</tr>
					<tr>
						<th>Mean horizontal_support</th>
						<td>{!this.arrayEquals(tirp, []) && Number(tirp['mean horizontal support']).toFixed(3)}</td>
					</tr>
					<tr>
						<th style={{ textAlign: 'left' }}>Mean mean duration</th>
						<td>{!this.arrayEquals(tirp, []) && Number(tirp['mean mean duration']).toFixed(3)}</td>
					</tr>
					<tr>
						<th style={{ textAlign: 'left' }}>Entities</th>
						<td> {entitesSize} </td>
					</tr>
				</tbody>
			</>
		);
	};

    buttonMatrixDisabled = () => {
		if (this.state.selectedPath.length < 2) {
			return true;
		}
		return false;
	};

    render() {
		let that = this;
		window.addEventListener('ReloadTirpTable', function () {
			that.forceUpdate();
		});
		return (
			<Card>
				<Card.Header className={'bg-hugobot'}>
					<Card.Text className={'text-hugobot text-hugoob-advanced'}>
						Selected TIRP info
					</Card.Text>
				</Card.Header>
				<Card.Body className={'text-hugobot'}>
					<div className='vertical-scroll vertical-scroll-advanced'>
						<Table responsive={true} striped={true} bordered={true}>
							{this.renderSelectedTirp()}
						</Table>
					</div>
				</Card.Body>
			</Card>
		);
	}

}

export default SelectedNTirpsTable;
