import React from "react";
import { render } from "react-dom";
import Editor, { keyMap, lifeCycleMap, renderEmergence, renderErrors } from "../../src/index";

const def = `fn not a -> b {
	b = ~a;
}

gene main TetR -> RFP {
	RFP = not(TetR);
}`;
const App = () => (
	<Editor
		initialValue={def}
		keyMap={keyMap}
		padding={15}
		lifeCycleMap={lifeCycleMap}
		renderHighlight={renderEmergence}
		renderErrors={(text) => renderErrors(text, [], [{
			pos: [5, 10]
		}])}
		editable={true}
	/>
);

render(<App />, document.getElementById("root"));
