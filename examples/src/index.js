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
		warnings={[{
			pos: [0, 10]
		}]}
		lifeCycleMap={lifeCycleMap}
		renderHighlight={renderEmergence}
		renderErrors={renderErrors}
		editable={true}
	/>
);

render(<App />, document.getElementById("root"));
