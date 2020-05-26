![Bg](static/bg.svg)

## About
Minimalistic, modular code editor for the web.

## Installing:
```
npm i granit
```

## Usage:
```jsx
import Editor, { keysMap, lifeCycleMap } from "granit";

export default class Home extends React.Component {
    onSave(text) {
        post("http://destination.com", text);
    }
    render() {
        return (
          <div>
            <Editor
              width={750}
              height={500}
              defaultValue="Hello there"
              keysMap={keysMap}
              lifeCycleMap={lifeCycleMap}
              onSave={this.onSave}
            />
          </div>
        );
    }
}
```

## Props
  
* `keyMap`: {},
* `lifeCycleMap`: {},
* `width`: 500,
* `height`: 300,
* `fontSize`: 16,
* `background`: "#f2f3f4",
* `initialValue`: "",
* `fontFamily`: "Fira code,Fira Mono,Consolas,Menlo,Courier,monospace",
* `onSave`: () => { },
* `renderHighlight`: (a) => a,
* `renderErrors`: (a) => a,
* `editable`: true 

## Build you own map of keys
```jsx
import Editor from "granit";

const enterKeyPressed = (record, event) => {
    const newRecord = {...record};
    const stringUntilSelectionStart = newRecord.value.substring(0, newRecord.selectionStart);
    const stringAfterSelectionStart = newRecord.value.substring(newRecord.selectionStart, newRecord.value.length);
    newRecord.value = stringUntilSelectionStart + "\n" + stringAfterSelectionStart;
    newRecord.selectionStart += 1;
    newRecord.selectionEnd += 1;
    return newRecord;
}

const keysMap = {
    "mac+13": enterKeyPressed
};

const lifeCycleMap = {
    "mac+cmd+90": "undo"
}

const highlightString = (text) => {
    const rows = text.split("\n");
    const newRows = rows.map(item => {
        const string = /^[A-Za-z0-9_-]+\s=\s".*"$/;
        const stringMatch = item.match(string);
        if(stringMatch) {
            const splitted = stringMatch[0].split(" = ");
            return `<span class="string">${splitted[0]}</span> = <span class="string">${splitted[1]}</span>`;
        }
        return item;
    });
    return newRows.join('\n');
}

export default class Home extends React.Component {
    onSave(text) {
        post("http://destination.com", text);
    }
    render() {
        return (
          <div>
            <Editor
              width={750}
              height={500}
              defaultValue="Hello there"
              keysMap={keysMap}
              lifeCycleMap={lifeCycleMap}
              renderHighlight={highlightString}
              onSave={this.onSave}
            />
          </div>
        );
    }
}
```
