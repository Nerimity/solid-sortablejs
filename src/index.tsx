import { createContext, For, JSX, JSXElement, onCleanup, onMount, Setter } from "solid-js";
import SortableJs from "sortablejs";

export type SortableEvent = SortableJs.SortableEvent
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
  onRemove?: (event: SortableJs.SortableEvent) => void;
  onAdd?: (event: SortableJs.SortableEvent) => void;
  id?: string;
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
      onAdd(event) {
        const children = [...event.to?.children!] as HTMLSpanElement[];
        const newItems = children.map(
          (v) =>
            props.items.find(
              (item) => (item[props.idField] as string).toString() === v.dataset.id!,
            ) || dragging.item,
        );
        // from: where it came from
        // to:   added to
        children.splice(event.newIndex!, 1);
        event.to?.replaceChildren(...children);

        props.onAdd?.(event)
        props.setItems(newItems as T[]);
      },
      onRemove(event) {
        // from: where it removed from
        // to: where it added to
        const children = [...event.from?.children!] as HTMLSpanElement[];
        const newItems = children.map((v) =>
        props.items.find((item) => (item[props.idField] as string).toString() === v.dataset.id!),
        );
        
        children.splice(event.oldIndex!, 0, event.item);
        event.from.replaceChildren(...children);
        props.onRemove?.(event);
        props.setItems(newItems as T[]);
      },
      onEnd(event) {
        const children = [...sortableContainerRef?.children!] as HTMLSpanElement[];
        const newItems = children.map((v) =>
          props.items.find((item) => (item[props.idField] as string).toString() === v.dataset.id!),
        );
        children.sort((a, b) => parseInt(a.dataset.index!) - parseInt(b.dataset.index!));
        sortableContainerRef?.replaceChildren(...children);
        props.setItems(newItems as T[]);
        dragging.item = undefined;
        props.onEnd?.(event);
      },
    });

    onCleanup(() => {
      sortable.destroy();
    });
  });

  return (
    <div {...(props.id ? { id: props.id } : undefined)} style={props.style} ref={sortableContainerRef} class={"sortablejs" + (props.class ? ` ${props.class}` : '')}>
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
