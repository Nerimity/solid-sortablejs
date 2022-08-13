import {For, JSX, onMount} from 'solid-js';
import SortableJs from 'sortablejs';



export interface SortableOnEndEvent<T> {
  newList: T[];
  oldIndex: number;
  newIndex: number;
  movedItem: T
}

interface SortableProps<T> {
  items: T[]
  children: (item: T) => JSX.Element;
  onEnd: (event: SortableOnEndEvent<T>) => void; 
}

export default function Sortable<T>(props: SortableProps<T>) {

  let listContainerEl: HTMLDivElement | undefined = undefined;

  onMount(() => {
    const sortable = new SortableJs(listContainerEl!, {
      animation: 150,
      onEnd: (event) => {
        const oldIndex = event.oldIndex!;
        const newIndex = event.newIndex!;

        sortable.sort(props.items.map((_i, index) => index.toString()));

        const items = [...props.items];
        const element = items.splice(oldIndex, 1)[0];
        items.splice(newIndex, 0, element);
        props.onEnd({
          newList: items,
          oldIndex,
          newIndex,
          movedItem: element
        });
      }
    });
  })


  return (
    <div class='sortable-container' ref={listContainerEl}>
      <For each={props.items}>
        {(item, index) => <div data-id={index()} >{props.children(item)}</div>}
      </For>
    </div>
  )
}
