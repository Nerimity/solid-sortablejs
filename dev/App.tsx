import Sortable, { SortableOnEndEvent } from "../src";
import {createStore} from 'solid-js/store'

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

export default App;
