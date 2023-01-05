import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import NTIRPsTable from './NTIRPsTable';

class NegativeTirps extends Component {
	render() {
		return (
			<Container fluid>
				<NTIRPsTable table={JSON.parse(localStorage.rootElement)} discriminative={false} />
			</Container>
		);
	}
}

export default NegativeTirps;
