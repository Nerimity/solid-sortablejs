import { createContext, For, JSX, JSXElement, onCleanup, onMount, Setter } from "solid-js";
import SortableJs from "sortablejs";

interface SortableProps<T> {
  delay?: number;
  delayOnTouchOnly?: boolean;
  group?: string;
  class?: string;
  style?: JSX.CSSProperties;
  items: T[];
  idField: keyof T;
  setItems: Setter<T[]>;
  children: (item: T) => JSXElement;
  onEnd?: (event: SortableJs.SortableEvent) => void;
  onStart?: (event: SortableJs.SortableEvent) => void;
}

const dragging = {
  item: undefined as any,
};
export default function Sortable<T>(props: SortableProps<T>) {
  let sortableContainerRef: HTMLDivElement | undefined;

  onMount(() => {
    const sortable = SortableJs.create(sortableContainerRef!, {
      delay: props.delay,
      delayOnTouchOnly: props.delayOnTouchOnly,
      group: props.group,
      animation: 150,
      onStart(event) {
        dragging.item = props.items[parseInt(event.item.dataset.index!)];
        props.onStart?.(event);
      },
      onAdd(evt) {
        const children = [...evt.to?.children!] as HTMLSpanElement[];
        const newItems = children.map(
          (v) =>
            props.items.find(
              (item) => (item[props.idField] as string).toString() === v.dataset.id!,
            ) || dragging.item,
        );
        // from: where it came from
        // to:   added to
        children.splice(evt.newIndex!, 1);
        evt.to?.replaceChildren(...children);

        props.setItems(newItems as T[]);
      },
      onRemove(evt) {
        // from: where it removed from
        // to: where it added to
        const children = [...evt.from?.children!] as HTMLSpanElement[];
        const newItems = children.map((v) =>
          props.items.find((item) => (item[props.idField] as string).toString() === v.dataset.id!),
        );

        children.splice(evt.oldIndex!, 0, evt.item);
        evt.from.replaceChildren(...children);
        props.setItems(newItems as T[]);
      },
      onEnd(evt) {
        const children = [...sortableContainerRef?.children!] as HTMLSpanElement[];
        const newItems = children.map((v) =>
          props.items.find((item) => (item[props.idField] as string).toString() === v.dataset.id!),
        );
        children.sort((a, b) => parseInt(a.dataset.index!) - parseInt(b.dataset.index!));
        sortableContainerRef?.replaceChildren(...children);
        props.setItems(newItems as T[]);
        dragging.item = undefined;
        props.onEnd?.(evt);
      },
    });

    onCleanup(() => {
      sortable.destroy();
    });
  });

  return (
    <div style={props.style} ref={sortableContainerRef} class={"sortablejs" + props.class ? ` ${props.class}` : ''}>
      <For each={props.items}>
        {(item, i) => (
          <div data-id={item[props.idField]} data-index={i()}>
            {props.children(item)}
          </div>
        )}
      </For>
    </div>
  );
}
