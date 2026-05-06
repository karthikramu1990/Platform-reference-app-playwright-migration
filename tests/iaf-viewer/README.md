# IafViewerDBM

IafViewerDBM is a wrapper component currently used in Digital Twin to simplify the process of retrieving model files and data. By just passing in Invicara model json object, it takes care of loading graphic files, ID mapping and even 2D views (if exists) within Invicara Platform. It's the most commonly used viewer component and users usually don't need to use IafViewer directly. 

## How to use IafViewerDBM

1. In the React application that needs to use IafViewerDBM, add a npm package copy-webpack-plugin and then put the following in plugins section (an arry of plugins) in the webpack.config.js, 

```js
new CopyWebpackPlugin([
      {from: 'node_modules/@dtplatform/iaf-viewer/dist/lib/', to: 'lib/', toType: 'dir'}
    ])
```

2. Add a line similiar to the following in the index.html or your index html file. 
```html
<script src="/your_app/lib/web_viewer.js"></script>
```

3. Create a component that renders IafViewerDBM within. Here's an example of a functional component:

```js
const EnhancedIafViewerDBM = ({model, sliceElementIds, colorGroups) => {
  const viewerRef = useRef()

  return (
    <div>
      <IafViewerDBM ref={viewerRef} model={model}
                    serverUri={endPointConfig.graphicsServiceOrigin}
                    sliceElementIds={sliceElementIds}
                    colorGroups={colorGroups}
                    selection={[]}/>
    </div>
  )
}
```

## Properties

Here are the properties of IafViewerDBM that we can utilize to initial the model, set selected elements or hidden elements 
  1. model: model NamedCompositeItem containing _id. _name and _namespaces
  2. ref: (optional) the ref created and passed into IafViewerDBM, so that we can use the ref to call viewer commands directly in the React app. You can use useRef() to create one.
  Example:

  ```js
    const viewerRef = useRef()
    let commands = _.get(viewerRef, "current.iafviewerRef.current.commands")
    if (commands && commands.getSelectedEntities) {
        let pkgIds = await commands.getSelectedEntities()
    }
  ```

  3. sliceElementIds: if some sliceElementIds is passed in, the model will be default to render in the glass mode.
  4. selection: selected elements
  5. hiddenElementIds: hidden elements
  6. serverUri: Item Service & also will be used as Graphics Service location by switch protocal to wss, sample: 'https://api.invicara.com'
  7. settings:
  saveSettings: callback to save settings. Parameter: settings
  viewerResizeCanvas: a flag to tell the viewer it needs to resize the canvas when the size of container of the viewer is changed
  8. colorGroups: color group is an array of colors that User can define for certain elements. Here's an example of what colorGroups json looks like: 
  ```js
    colorGroup = [{
    "groupName": "Temperature",
    "colors": [
        {
        "color": "#C71784",
        "opacity": 0.9,
        "title": "normal",
        "colorName": "red",
        "elementIds": elementIds
        }]
    }]
  ```
