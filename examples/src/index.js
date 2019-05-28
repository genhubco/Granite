import React from 'react';
import { render } from 'react-dom';
import Editor from '../../src/index';
import { keysMap, lifeCycleMap } from "granit-utils";
const App = () => (
    <Editor
        defaultValue="aaaa"
        keysMap={keysMap}
        lifeCycleMap={lifeCycleMap}
    />
);
render(<App />, document.getElementById("root"));
