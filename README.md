<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-sortablejs&background=tiles&project=%20" alt="solid-sortablejs">
</p>

# Solid SortableJS

Easily sort your list. solid-sortablejs is using the SortableJS library to sort your list.  
This library is in WIP


## Quick start

Install it:

```bash
npm install solid-sortablejs
```

Use it:

```tsx
import Sortable from "../src";
import {createStore} from 'solid-js/store'
import { JSX } from "solid-js";

const App = () => {

  const itemStyles: JSX.CSSProperties = {"user-select": "none", background: 'green', padding: "10px", "min-width": "100px", margin: "5px", "border-radius": "4px", color: "white"};
  const containerStyles = {display: "inline-block", background: 'gray', padding: "10px", "border-radius": "4px"};

  const [items, setItems] = createStore([
    { id: 0, name: 0 },
    { id: 1, name: 1 },
    { id: 2, name: 2 },
    { id: 3, name: 3 },
  ])

  return (
    <div style={containerStyles}>
      <Sortable idField="id" items={items} setItems={setItems} >
        {item => <div style={itemStyles}>{item.name} {Math.random()}</div>}
      </Sortable>
    </div>
  );

};

export default App;
};
```
