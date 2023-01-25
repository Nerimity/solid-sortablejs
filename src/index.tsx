import {createContext, For, JSX, JSXElement, onCleanup, onMount, Setter} from 'solid-js';
import SortableJs from 'sortablejs';




interface SortableProps<T> {
  class?: string;
  style?: JSX.CSSProperties;
  items: T[]
  idField: keyof T;
  setItems: Setter<T[]>
  children: (item: T) => JSXElement
}



const SortableContext = createContext();


export function SortableProvider (props: {children: JSXElement}) {
  const itemMap: Record<string, string> = {};

  const sortable = {
    itemMap,
    add() {
    }
  }

  return (
    <SortableContext.Provider value={{}}>
      {props.children}
    </SortableContext.Provider>
  )
}


const dragging = {
  item: undefined as any
}
export default function Sortable<T>(props: SortableProps<T>) {
  let sortableContainerRef: HTMLDivElement | undefined;

  onMount(() => {
    const sortable = SortableJs.create(sortableContainerRef!, {
      group: "test",
      animation: 150,
      onStart(event) {
        dragging.item = props.items[parseInt(event.item.dataset.index!)];
        
      },
      onAdd(evt) {
        const children = [...evt.to?.children!] as HTMLSpanElement[];
        const newItems = children.map(v => props.items.find(item => item[props.idField].toString() === v.dataset.id!) || dragging.item);


        // from: where it came from
        // to:   added to

        children.splice(evt.newIndex!, 1);
        evt.to?.replaceChildren(...children)
        props.setItems(newItems);

      },
      onEnd(evt) {
        const children = [...sortableContainerRef?.children!] as HTMLSpanElement[];
        const newItems = children.map(v => props.items.find(item => item[props.idField].toString() === v.dataset.id!));
        children.sort((a, b) => parseInt(a.dataset.index!) - parseInt(b.dataset.index!))
        sortableContainerRef?.replaceChildren(...children);
        props.setItems(newItems);
        dragging.item = undefined;
      },
    })

    onCleanup(() => {
      sortable.destroy();
    })
  })

  return (
    <div style={props.style} ref={sortableContainerRef} class="sortablejs">
      <For each={props.items}>
        {(item, i) => <div data-id={item[props.idField]} data-index={i()}>{props.children(item)}</div>}
      </For>
    </div>
  )
}
