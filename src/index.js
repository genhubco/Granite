import React from 'react';
import sha256 from "hash.js/lib/hash/sha/256";
import { keysMap, lifeCycleMap, highlightToml } from "./utils";

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

        const defaultHash = sha256().update("").digest("hex");
        this.state = {
            contentHash: defaultHash,
            savedHash: defaultHash,
            value: ""
        };

        this.stack = [];
        this.archiveStack = [];

        this.redo = this.redo.bind(this);
        this.undo = this.undo.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.updateInput = this.updateInput.bind(this);
    }

    componentDidMount() {
        if (!this.props.defaultValue) {
            return;
        }
        this.updateStack({
            value: this.props.defaultValue,
            selectionStart: this.props.defaultValue.length,
            selectionEnd: this.props.defaultValue.length
        });
        this.setState({
            savedHash: sha256().update(this.props.defaultValue).digest("hex"),
        });
        this.props.onSave(this.props.defaultValue);
    }

    updateInput() {
        const input = this.input;

        if (!input) return;

        let record = this.stack[this.stack.length - 1];
        if (!record) {
            record = {
                value: "",
                selectionStart: 0,
                selectionEnd: 0
            };
        }
        input.value = record.value;
        input.selectionStart = record.selectionStart;
        input.selectionEnd = record.selectionEnd;

        this.setState({
            value: record.value,
            contentHash: sha256().update(record.value).digest("hex"),
        });
    }

    updateStack(record) {
        this.stack.push(record);
        this.archiveStack = [];
        this.updateInput();
    }

    undo() {
        const record = this.stack.pop();
        if (!record) {
            return;
        }
        this.archiveStack.push(record);
        this.updateInput();
    }

    redo() {
        const record = this.archiveStack.pop();
        if (!record) {
            return;
        }
        this.stack.push(record);
        this.updateInput();
    }

    save() {
        if (this.state.savedHash === this.state.contentHash) {
            return;
        }
        this.setState({
            savedHash: sha256().update(this.state.value).digest("hex"),
        });
        this.props.onSave(this.state.value);
    }

    handleKeyDown(e) {
        const { value, selectionStart, selectionEnd } = e.target;
        e.preventDefault();
        let record = { value, selectionStart, selectionEnd };
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
        record = keysMatch(e, record);
        this.updateStack(record);
    }

    render() {
        const highlighted = highlightToml(this.state.value);
        return (
            <div className="granit-editor-container">
                <style jsx global>{`
                    .granit-editor-container {
                        position: relative;
                        width: 500px;
                        height: 300px;
                        overflow: hidden;
                    }

                    .granit-editor {
                        position: absolute;
                        width: 500px;
                        height: 300px;
                        font-size: 16px;
                        box-sizing: border-box;
                        color: transparent;
                        white-space: pre-wrap;
                        word-break: break-all;
                        resize: none;
                        padding: 0;
                        overflow: hidden;
                        caret-color: black;
                        font-family: 'Source Code Pro', monospace;
                    }

                    .granit-editor:focus {
                        outline: none;
                    }

                    .granit-editor-highlight {
                        font-size: 16px;
                        margin: 0;
                        white-space: pre-wrap;
                        word-break: break-all;
                        font-family: 'Source Code Pro', monospace;
                        position: absolute;
                        pointer-events: none;
                    }

                    .granit-editor-unsaved-indicator {
                        height: 10px;
                        width: 10px;
                        border-radius: 50%;
                        position: absolute;
                        top: 5px;
                        right: 5px;
                    }
                `}</style>
                <textarea
                  ref={c => (this.input = c)}
                  className="granit-editor"
                  onKeyDown={this.handleKeyDown.bind(this)}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  data-gramm={false}
                />
                <pre
                    aria-hidden="true"
                    className="granit-editor-highlight"
                    {...(typeof highlighted === 'string'
                        ? { dangerouslySetInnerHTML: { __html: highlighted + '<br />' } }
                        : { children: highlighted })}
                />
                {this.state.contentHash !== this.state.savedHash && <div className="granit-editor-unsaved-indicator" />}
            </div>
        );
    }
};
