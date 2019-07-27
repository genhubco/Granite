import React from 'react';
import sha256 from "hash.js/lib/hash/sha/256";

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
        this.stack = [{
            selectionStart: props.initialValue.length,
            selectionEnd: props.initialValue.length,
            value: props.initialValue
        }];
        this.archiveStack = [];

        const defaultHash = sha256().update(props.initialValue).digest("hex");
        this.state = { contentHash: defaultHash, savedHash: defaultHash };

        this.redo = this.redo.bind(this);
        this.undo = this.undo.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.onRef = this.onRef.bind(this);
    }

    update(newRecord) {
        this.stack.push(newRecord);
        this.archiveStack = [];

        const record = this.stack[this.stack.length - 1];
        this.setState({ contentHash: sha256().update(record.value).digest("hex") });
    }

    undo() {
        if (this.stack.length === 1) {
            return;
        }
        const removedRecord = this.stack.pop();
        this.archiveStack.push(removedRecord);

        const record = this.stack[this.stack.length - 1];
        this.setState({ contentHash: sha256().update(record.value).digest("hex") });
    }

    redo() {
        const retrievedRecord = this.archiveStack.pop();
        if (!retrievedRecord) {
            return;
        }
        this.stack.push(retrievedRecord);

        const record = this.stack[this.stack.length - 1];
        this.setState({ contentHash: sha256().update(record.value).digest("hex") });
    }

    save() {
        if (this.state.savedHash === this.state.contentHash) {
            return;
        }
        const record = this.stack[this.stack.length - 1];
        this.setState({ savedHash: sha256().update(record.value).digest("hex") });
        this.props.onSave(record.value);
    }

    handleKeyDown(e) {
        const { value, selectionStart, selectionEnd } = e.target;
        const { keysMap, lifeCycleMap, editable } = this.props;
        if (!editable) {
            return;
        }
        e.preventDefault();
        const record = { value, selectionStart, selectionEnd };
        const keysPressed = [platform(), e.metaKey, e.ctrlKey, e.shiftKey, e.altKey, e.keyCode, selectionStart !== selectionEnd];
        const lifeCycleMatch = lifeCycleMap[String(keysPressed)];
        if (lifeCycleMatch) {
            this[lifeCycleMatch]();
            return;
        }
        const keysMatch = keysMap[String(keysPressed)];
        if (!keysMatch) {
            return;
        }
        const res = keysMatch(e, record);
        if (res.then) {
            res.then(newRecord => this.update(newRecord));
        } else {
            this.update(res);
        }
    }

    onRef(ref) {
        this.input = ref;
        const record = this.stack[0];
        this.input.value = record.value;
        this.input.selectionStart = record.selectionStart;
        this.input.selectionEnd = record.selectionEnd;
    }

    render() {
        const { highlight, editable } = this.props;

        const record = this.stack[this.stack.length - 1];
        if (this.input) {
            this.input.value = record.value;
            this.input.selectionStart = record.selectionStart;
            this.input.selectionEnd = record.selectionEnd;
        }

        let highlighted = highlight(record.value);

        const containerStyles = {
            position: "relative",
            width: `${this.props.width}px`,
            height: `${this.props.height}px`,
            overflow: "hidden",
            background: "#f2f3f4"
        };

        const editorStyles = {
            position: "absolute",
            width: `${this.props.width}px`,
            height: `${this.props.height}px`,
            fontSize: `${this.props.fontSize}px`,
            boxSizing: "border-box",
            color: "transparent",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            resize: "none",
            margin: 0,
            padding: `${this.props.padding}px`,
            overflow: "hidden",
            caretColor: "black",
            background: "transparent",
            border: "none",
            fontFamily: `${this.props.fontFamily}, monospace`,
        }

        const highlightStyles = {
            fontSize: `${this.props.fontSize}px`,
            padding: `${this.props.padding}px`,
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            fontFamily: `${this.props.fontFamily}, monospace`,
            position: "absolute",
            pointerEvents: "none",
        }

        const indicatorStyles = {
            height: "10px",
            width: "10px",
            borderRadius: "50%",
            position: "absolute",
            top: "5px",
            right: "5px",
        }

        return (
            <div className="granit-editor-container" style={containerStyles}>
                <pre
                    aria-hidden="true"
                    className="granit-editor-highlight"
                    style={highlightStyles}
                    dangerouslySetInnerHTML={{ __html: highlighted + '<br />' }}
                />
                <textarea
                    ref={this.onRef}
                    className="granit-editor"
                    style={editorStyles}
                    onKeyDown={this.handleKeyDown}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    data-gramm={false}
                    readOnly={!editable}
                />
                {this.state.contentHash !== this.state.savedHash && <div className="granit-editor-unsaved-indicator" style={indicatorStyles} />}
            </div>
        );
    }
};

Editor.defaultProps = {
    keysMap: {},
    lifeCycleMap: {},
    width: 500,
    height: 300,
    fontSize: 16,
    padding: 0,
    initialValue: "",
    fontFamily: "Source Code Pro",
    onSave: () => {},
    highlight: (a) => a,
    editable: true
}
