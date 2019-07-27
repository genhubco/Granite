import React from 'react';
import { render } from 'react-dom';
import Editor from '../../src/index';
import { keysMap, lifeCycleMap } from "granit-utils";
const App = () => (
    <Editor
        initialValue="aaalasnfljkadnfjlsndjknfskja"
        keysMap={keysMap}
        lifeCycleMap={lifeCycleMap}
        editable={false}
    />
);
render(<App />, document.getElementById("root"));
