import React, { Component } from 'react';
import { Card, Table } from 'react-bootstrap';

class SelectedNTirpsTable extends Component {
	state = {
        currentLevel: this.props.args[0], 
		selectedPath: this.props.args[1],
    };

	renderNTirpTable = (iter) => {
		// console.log(this.state.currentLevel)
        // console.log("iter")
        // console.log(iter)
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
						<td>{this.state.currentLevel}</td>
					</tr>
					<tr>
						<th style={{ textAlign: 'left' }}>Vertical support</th>
						<td>
                            {iter.length > 0 && ((iter['support'] / iter.length) * 100).toFixed(1)} %
						</td>
					</tr>
					<tr>
						<th>Mean horizontal_support</th>
						<td>{iter.length > 0 && iter['mean horizontal support'].toFixed(2)}</td>
					</tr>
					<tr>
						<th style={{ textAlign: 'left' }}>Mean mean duration</th>
						<td>{iter.length > 0 && iter['mean mean duration'].toFixed(2)}</td>
					</tr>
					<tr>
						<th style={{ textAlign: 'left' }}>Entities</th>
						<td> Need to think</td>
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
							{this.renderNTirpTable(this.state.selectedPath)}
						</Table>
					</div>
				</Card.Body>
			</Card>
		);
	}

}

export default SelectedNTirpsTable;
