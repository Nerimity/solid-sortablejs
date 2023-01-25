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
  const [items2, setItems2] = createStore([
    { id: 4, name: 4 },
    { id: 5, name: 5 },
    { id: 6, name: 6 },
    { id: 7, name: 7 },
  ])

  return (
    <div style={containerStyles}>
      <Sortable idField="id" style={{ background: "darkgray"}} items={items} setItems={setItems} >
        {item => <div style={itemStyles}>{item.name} {Math.random()}</div>}
      </Sortable>
      <Sortable idField="id" style={{ background: "darkgray", "margin-top": "102px"}} items={items2} setItems={setItems2} >
        {item => <div style={itemStyles}>{item.name} {Math.random()}</div>}
      </Sortable>
    </div>
  );

};

export default App;
