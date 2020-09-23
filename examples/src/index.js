import React from "react";
import { render } from "react-dom";
import Editor, { keyMap, lifeCycleMap, renderEmergence, renderErrors } from "../../src/index";

const def = `func not a -> b {
	b = ~a;
}

func nor(a, b) -> c {
	c = a ~| b;
}

func main(in1, in2, in3) -> out {
	let ntl = nor(in1, in2);
	let nl = not(in2);
	let nla = nor(nl, in3);
	out = nor(nla, ntl);
}

test main (TetR, LacI, AraC) -> RFP {
	@100
	TetR = true;
	@200
	TetR = false;
	LacI = true;
    @300
    AraC = true;
    TetR = true;
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
