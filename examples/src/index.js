import React from "react";
import { render } from "react-dom";
import Editor, { keyMap, lifeCycleMap, renderEmergence, renderErrors } from "../../src/index";

const def = `func not a -> b {
	b = ~a;
}

func main TetR -> RFP {
	let a = not(TetR);
	RFP = not(a);
}`;
const App = () => (
	<div style={{
		height: "100vh",
		maxHeight: "100vh",
	}}>
		<div style={{
			minHeight: "100px"
		}} />
		<div style={{
			height: "calc(100vh - 200px)",
		}}>
			<div style={{
				display: "inline-block",
				width: "50%",
			}}>
				<Editor
					initialValue={def}
					keyMap={keyMap}
					padding={15}
					lifeCycleMap={lifeCycleMap}
					renderHighlight={renderEmergence}
					editable={true}
				/>
			</div>
			<div style={{
				display: "inline-block",
				width: "50%",
			}}>
				asdasda
			</div>
		</div>
		<div style={{
			minHeight: "100px"
		}} />
	</div >
);

render(<App />, document.getElementById("root"));
