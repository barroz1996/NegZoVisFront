import React, { Component } from 'react';
import OutputAlgoritm from "./OutputAlgoritm.json"

class ProccessNegativeRender extends Component {

    check() {
        const symbols = OutputAlgoritm.map((symbol) => symbol["elements"][0])

        return symbols
    };

    render(){
        return <h1> kfir </h1>
    }

}

export default ProccessNegativeRender;
