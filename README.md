![Bg](static/bg.svg)

## About
Minimalistic, modular code editor (~200 lines of code) for the web. The core library contains only lifecycle functions like "undo", "redo", "save". All changes are handled inside `handleKeyDown` function, and all other events are turned of. Library should be used with [granit-utils](https://github.com/genhubco/granit-utils) for handling pressed keys, or you can make your own (see `keysMap` and `lifeCycleMap` props).

## Installing:
```
npm i granit
```

## Usage:
```jsx
import Editor from "granit";

export default class Home extends React.Component {
    onSave(text) {
        request("http://destination.com", text);
    }
    render() {
        return (
          <div>
            <Editor
              width={750}
              height={500}
              padding={20}
              defaultValue="Hello there"
              keysMap={{}}
              lifeCycleMap={{}}
              onSave={this.onSave}
            />
          </div>
        );
    }
}
```

## Props
Style related:  
  
`width` - width of the editor - default `500px`  
  
`height` - heigth of the editor - default `300px`  
  
`padding` - padding of the editor - default `0`  
  
`fontSize` - fontSize of the content - default `16px`  
  
`fontFamily` - fontFamily of the content - default `Source Code Pro`  


Other:  
  
`defaultValue` - default value of textarea when component mounts

`onSave` - function called when user user saves the changes - called when "save" lifecycle is called, which is defined in
`lifeCycleMap` object

`highlight` - function that outputs text wrapped in html elements for syntax highlighting
  
`keysMap` - map of keys pressed to edit text:
```js
// handler - function called when keys match
// arg e - event object from `handleKeyDown`
// arg record - { value, selectionStart, selectionEnd } = e.target
// returns newRecord - { value, selectionStart, selectionEnd }
const handler = (e, record) => newRecord;
{
    // platform (which platform are you on?) - "mac", "win" or "other"
    // metaKey (is cmd key pressed) - bool
    // ctrlKey (is ctrl key pressed) - bool
    // shiftKey (is shift key pressed) - bool
    // altKey (is alt key pressed) - bool
    // keyCode - Number (see https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)
    // withSelection (is text selected) - bool
    "[platform],[metaKey],[ctrlKey],[shiftKey],[altKey],[keyCode],[withSelection]": [handler]
}
```
`lifeCycleMap` - map of keys pressed to undo, redo, save the text:
```js
{
    // platform (which platform are you on?) - "mac", "win" or "other"
    // metaKey (is cmd key pressed) - bool
    // ctrlKey (is ctrl key pressed) - bool
    // shiftKey (is shift key pressed) - bool
    // altKey (is alt key pressed) - bool
    // keyCode - Number (see https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)
    // withSelection (is text selected) - bool
    
    // handler - editor lifecycle function - "undo", "redo", "save"
    "[platform],[metaKey],[ctrlKey],[shiftKey],[altKey],[keyCode],[withSelection]": "[handler]"
}
```

## With [granit-utils](https://github.com/genhubco/granit-utils)
```jsx
import Editor from "granit";
import { keysMap, lifeCycleMap, highlightToml } = "granit-utils";

export default class Home extends React.Component {
    onSave(text) {
        request("http://destination.com", text);
    }
    render() {
        return (
          <div>
            <Editor
              width={750}
              height={500}
              padding={20}
              defaultValue="Hello there"
              keysMap={keysMap}
              lifeCycleMap={lifeCycleMap}
              highlight={highlightToml}
              onSave={this.onSave}
            />
          </div>
        );
    }
}
```

## Build you own map of keys
```jsx
import Editor from "granit";

const enterKeyPressed = (e, record) => {
    const newRecord = {...record};
    const stringUntilSelectionStart = newRecord.value.substring(0, newRecord.selectionStart);
    const stringAfterSelectionStart = newRecord.value.substring(newRecord.selectionStart, newRecord.value.length);
    newRecord.value = stringUntilSelectionStart + "\n" + stringAfterSelectionStart;
    newRecord.selectionStart += 1;
    newRecord.selectionEnd += 1;
    return newRecord;
}

const keysMap = {
    [String(["mac", false, false, false, false, 13, false])]: enterKeyPressed
};

const lifeCycleMap = {
    [String(["mac", true, false, false, false, 90, false])]: "undo"
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
        request("http://destination.com", text);
    }
    render() {
        return (
          <div>
            <Editor
              width={750}
              height={500}
              padding={20}
              defaultValue="Hello there"
              keysMap={keysMap}
              lifeCycleMap={lifeCycleMap}
              highlight={highlightString}
              onSave={this.onSave}
            />
          </div>
        );
    }
}
```
