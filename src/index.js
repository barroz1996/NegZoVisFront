import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

// import '../node_modules/react-dropzone-component/styles/filepicker.css';
import '../node_modules/dropzone/dist/basic.css';
// import '../node_modules/dropzone/dist/dropzone.css';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
