import React from 'react';
import { render} from 'react-dom';
import Editor from '../../src/index';
const App = () => (
    <Editor defaultValue="aaaa"/>
);
render(<App />, document.getElementById("root"));
