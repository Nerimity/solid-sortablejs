<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-sortablejs&background=tiles&project=%20" alt="solid-sortablejs">
</p>

# Solid SortableJS

Easily sort your list. solid-sortablejs is using the SortableJS library to sort your list.  
This library is in WIP


## Quick start

Install it:

```bash
npm add solid-sortablejs
```

Use it:

```tsx
import {createStore} from 'solid-js/store'
import Sortable from 'solid-sortablejs'

const App = () => {

  const itemStyles = {background: 'green', padding: "10px", minWidth: "100px", margin: "5px", "border-radius": "4px", color: "white"};
  const containerStyles = {display: "inline-block", background: 'gray', padding: "10px", "border-radius": "4px"};

  const [items, setItems] = createStore([
    { id: 0, name: 0 },
    { id: 1, name: 1 },
    { id: 2, name: 2 },
    { id: 3, name: 3 },
  ])

  const onEnd = (event: SortableOnEndEvent<typeof items[0]>) => {
    // event.movedItem -> the item that was moved
    // event.newList -> the new list of items
    // event.oldIndex -> the index of the item that was moved
    // event.newIndex -> the index of the item that was moved to

    setItems(event.newList);
  }

  return (
    <div style={containerStyles}>
      <Sortable items={items} onEnd={onEnd}>
        {item => <div style={itemStyles}>{item.name} {Math.random()}</div>}
      </Sortable>
    </div>
  );

};
```
