import React from "react";

function platform() {
	const isWindows = "navigator" in global && /Win/i.test(navigator.platform);
	const isMacLike = "navigator" in global && /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
	if (isMacLike) {
		return "mac";
	} else if (isWindows) {
		return "win";
	} else {
		return "other";
	}
}

export default class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.inputRef = null;
		this.highlightRef = null;
		this.errorsRef = null;
		this.linesRef = null;

		this.stack = [{
			selectionStart: props.initialValue.length,
			selectionEnd: props.initialValue.length,
			value: props.initialValue
		}];
		this.state = { current: 0 };

		this.redo = this.redo.bind(this);
		this.undo = this.undo.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onRef = this.onRef.bind(this);
		this.onHighlightRef = this.onHighlightRef.bind(this);
		this.onErrorsRef = this.onErrorsRef.bind(this);
		this.onLinesRef = this.onLinesRef.bind(this);
		this.onScroll = this.onScroll.bind(this);
	}

	update(newRecord) {
		this.stack = this.stack.slice(0, this.state.current + 1);
		this.stack.push(newRecord);

		this.setState({ current: this.state.current + 1 });
	}

	undo() {
		if (this.state.current <= 0) {
			return;
		}
		this.setState({ current: this.state.current - 1 });
	}

	redo() {
		if (this.state.current >= this.stack.length - 1) {
			return;
		}
		this.setState({ current: this.state.current + 1 });
	}

	save() {
		const record = this.stack[this.state.current];
		this.props.onSave(record.value);
	}

	genKey(platform, cmd, ctrl, shift, alt, charCode) {
		let arr = [];
		if (platform) {
			arr.push(platform);
		}
		if (cmd) {
			arr.push("cmd");
		}

		if (ctrl) {
			arr.push("ctrl");
		}

		if (shift) {
			arr.push("shift");
		}

		if (alt) {
			arr.push("alt");
		}

		if (charCode) {
			arr.push(charCode);
		}

		return arr.join("+");
	}

	handleKeyDown(e) {
		const { value, selectionStart, selectionEnd } = e.target;
		const { keyMap, lifeCycleMap } = this.props;
		const keysPressed = this.genKey(platform(), e.metaKey, e.ctrlKey, e.shiftKey, e.altKey, e.keyCode);
		if (!lifeCycleMap[keysPressed] && !keyMap[keysPressed]) {
			return;
		}
		e.preventDefault();
		const lifeCycleMatch = lifeCycleMap[keysPressed];
		if (lifeCycleMatch) {
			this[lifeCycleMatch]();
			return;
		}
		const keysMatch = keyMap[keysPressed];
		if (!keysMatch) {
			return;
		}
		const record = { value, selectionStart, selectionEnd };
		const res = keysMatch(record, e);
		if (!res.then) {
			this.update(res);
			return;
		}
		res.then(newRecord => this.update(newRecord));
	}

	handleChange(e) {
		const { value, selectionStart, selectionEnd } = e.target;
		const record = { value, selectionStart, selectionEnd };
		this.update(record);
	}

	onRef(ref) {
		this.inputRef = ref;
		const record = this.stack[this.state.current];
		if (this.inputRef) {
			this.inputRef.value = record.value;
			this.inputRef.selectionStart = record.selectionStart;
			this.inputRef.selectionEnd = record.selectionEnd;
		}
	}

	onHighlightRef(ref) {
		this.highlightRef = ref;
	}

	onErrorsRef(ref) {
		this.errorsRef = ref;
	}

	onLinesRef(ref) {
		this.linesRef = ref;
	}

	onScroll(e) {
		console.log(this.highlightRef, this.errorsRef, this.linesRef);
		if (!this.highlightRef) {
			return;
		}

		this.highlightRef.scrollTop = e.target.scrollTop;
		this.highlightRef.scrollLeft = e.target.scrollLeft;

		if (!this.errorsRef) {
			return;
		}

		this.errorsRef.scrollTop = e.target.scrollTop;
		this.errorsRef.scrollLeft = e.target.scrollLeft;

		if (!this.linesRef) {
			return;
		}

		this.linesRef.scrollTop = e.target.scrollTop;
		this.linesRef.scrollLeft = e.target.scrollLeft;
	}

	render() {
		const {
			renderHighlight,
			renderErrors,
			editable,
			width,
			height,
			fontFamily,
			fontSize,
			background,
			errors,
			warnings
		} = this.props;

		const record = this.stack[this.state.current];
		if (this.inputRef) {
			this.inputRef.value = record.value;
			this.inputRef.selectionStart = record.selectionStart;
			this.inputRef.selectionEnd = record.selectionEnd;
		}

		let highlighted = renderHighlight(record.value);
		let errorsHighlight = renderErrors(record.value, errors, warnings);
		let lines = record.value.split("\n");

		const editorStyles = {
			fontSize: `${fontSize}px`,
			height: "100%",
			width: "100%",
			overflow: "hidden",
			whiteSpace: "pre",
			wordBreak: "normal",
			margin: 0,
			padding: 0,
			tabSize: 4,
			fontFamily: fontFamily,
			position: "absolute",
			outline: "none"
		};

		return (
			<div className="granit-editor" style={{
				height: `${height}px`,
				width: `${width}px`,
				display: "flex",
			}}>
				<div ref={this.onLinesRef} className="granit-editor-lines" style={{
					padding: "0 10px",
					color: "#929ba3",
					background,
					fontSize: `${fontSize}px`,
					fontFamily: fontFamily,
					overflow: "hidden",
					textAlign: "right"
				}}>
					{lines.map((_, i) => (
						<span key={`line-${i}`} style={{
							display: "block",
						}}>{i}</span>
					))}
				</div>
				<div className="granit-editor-container" style={{
					position: "relative",
					height: "100%",
					width: "100%",
					background,
					display: "inline-block"
				}}>
					{
						(errors.length || warnings.length) ?
							<div
								className="granit-editor-errors"
								style={{
									...editorStyles,
									color: "transparent",
									pointerEvents: "none",
								}}
								ref={this.onErrorsRef}
								dangerouslySetInnerHTML={{ __html: errorsHighlight + '<br />' }}
							/> : null
					}
					<div
						className="granit-editor-highlight"
						style={{ ...editorStyles, pointerEvents: "none", }}
						ref={this.onHighlightRef}
						dangerouslySetInnerHTML={{ __html: highlighted + '<br />' }}
					/>
					<textarea
						ref={this.onRef}
						className="granit-editor-textarea"
						onScroll={this.onScroll}
						style={{
							...editorStyles,
							color: "transparent",
							resize: "none",
							caretColor: "black",
							background: "transparent",
							border: "none",
							overflow: "scroll"
						}}
						onChange={this.handleChange}
						onKeyDown={this.handleKeyDown}
						autoCapitalize="off"
						autoComplete="off"
						autoCorrect="off"
						spellCheck={false}
						data-gramm={false}
						readOnly={!editable}
					/>
				</div>
			</div>
		);
	}
};

Editor.defaultProps = {
	keyMap: {},
	lifeCycleMap: {},
	width: 730,
	height: 400,
	fontSize: 16,
	errors: [],
	warnings: [],
	background: "#f2f3f4",
	initialValue: "",
	fontFamily: "Fira code,Fira Mono,Consolas,Menlo,Courier,monospace",
	onSave: () => { },
	renderHighlight: (a) => a,
	renderErrors: (a) => a,
	editable: true
}
