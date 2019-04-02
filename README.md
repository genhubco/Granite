![Bg](static/bg.svg)

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
`width` - width of the editor (textarea and overlay) - default `500px`  
`height` - heigth of the editor (textarea and overlay) - default `300px`  
`padding` - padding of the editor - default `0`  
`fontSize` - fontSize of the content - default `16px`  
`fontFamily` - fontFamily of the content - default `Source Code Pro`  
