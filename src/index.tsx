import { createEffect, For, JSX, JSXElement, onCleanup, onMount, Setter, splitProps } from "solid-js";
import SortableJs from "sortablejs";

export type SortableEvent = SortableJs.SortableEvent
interface SortableProps<T> extends SortableJs.Options {
  items: T[];
  setItems: Setter<T[]>;
  idField: keyof T;
  class?: string;
  style?: JSX.CSSProperties;
  id?: string;
  children: (item: T) => JSXElement;
}

const SORTABLE_OPTION_FIELDS = ([
  'animation', 'chosenClass', 'dataIdAttr', 'delay', 'delayOnTouchOnly', 'direction', 'disabled', 'dragClass', 'draggable', 'dragoverBubble', 'dropBubble', 'easing',
  'fallbackClass', 'fallbackOffset', 'fallbackOnBody', 'fallbackTolerance', 'filter', 'forceFallback', 'ghostClass', 'group', 'handle', 'ignore',
  'invertedSwapThreshold', 'invertSwap', 'onAdd', 'onChange', 'onChoose', 'onClone', 'onEnd', 'onFilter',
  'onMove', 'onRemove', 'onSelect', 'onSort', 'onStart', 'onUnchoose', 'onUpdate', 'preventOnFilter', 'removeCloneOnHide', 'setData', 'sort', 'swapThreshold',
] as const) satisfies readonly (keyof SortableJs.Options)[]
// Would love to type-check if all fields are present, but that seems rather challenging - https://stackoverflow.com/questions/58167616/typescript-create-an-exhaustive-tuple-type-from-another-type/58170994#58170994

const OUR_PROPS = (['items', 'setItems', 'idField', 'class', 'style', 'id', 'children'] as const) satisfies readonly (Exclude<keyof SortableProps<any>, keyof SortableJs.Options>)[]


const dragging = {
  item: undefined as any,
};
export default function Sortable<T>(props: SortableProps<T>) {
  let sortableContainerRef: HTMLDivElement | undefined;
  let sortable: SortableJs

  const [options, otherAndOurProps] = splitProps(props, SORTABLE_OPTION_FIELDS)
  const [ourProps, otherProps] = splitProps(otherAndOurProps, OUR_PROPS)

  onMount(() => {
    sortable = SortableJs.create(sortableContainerRef!, {
      ...options,
      animation: 150,
      onStart(event) {
        dragging.item = ourProps.items[parseInt(event.item.dataset.index!)];
        options.onStart?.(event);
      },
      onAdd(event) {
        const children = [...event.to?.children!] as HTMLSpanElement[];
        const newItems = children.map(
          (v) =>
            ourProps.items.find(
              (item) => (item[ourProps.idField] as string).toString() === v.dataset.id!,
            ) || dragging.item,
        );
        // from: where it came from
        // to:   added to
        children.splice(event.newIndex!, 1);
        event.to?.replaceChildren(...children);

        ourProps.setItems(newItems as T[]);
        options.onAdd?.(event)
      },
      onRemove(event) {
        // from: where it removed from
        // to: where it added to
        const children = [...event.from?.children!] as HTMLSpanElement[];
        const newItems = children.map((v) =>
          ourProps.items.find((item) => (item[ourProps.idField] as string).toString() === v.dataset.id!),
        );
        
        children.splice(event.oldIndex!, 0, event.item);
        event.from.replaceChildren(...children);
        ourProps.setItems(newItems as T[]);
        options.onRemove?.(event);
      },
      onEnd(event) {
        const children = [...sortableContainerRef?.children!] as HTMLSpanElement[];
        const newItems = children.map((v) =>
          ourProps.items.find((item) => (item[ourProps.idField] as string).toString() === v.dataset.id!),
        );
        children.sort((a, b) => parseInt(a.dataset.index!) - parseInt(b.dataset.index!));
        sortableContainerRef?.replaceChildren(...children);
        ourProps.setItems(newItems as T[]);
        dragging.item = undefined;
        options.onEnd?.(event);
      },
    });

    onCleanup(() => {
      sortable.destroy();
    });
  });

  createEffect<Pick<SortableProps<T>, ArrayToUnion<typeof SORTABLE_OPTION_FIELDS>> | null>((prev) => {
    const clonedProps = { ...options }
    if (!prev) {
      //console.debug('props init', clonedProps)
    } else {
      const diff = Object.entries(clonedProps).filter(([key, newVal]) => newVal != prev[key as keyof Pick<SortableProps<T>, ArrayToUnion<typeof SORTABLE_OPTION_FIELDS>>])
      //console.debug('props update', diff, { newProps: clonedProps, prev })
      for (const [key, newVal] of diff) {
        if (['onStart', 'onAdd', 'onRemove', 'onEnd'].includes(key))
          console.warn(`Reactive callbacks are not supported yet in solid-sortablejs. Changed:`, key)
        else
          sortable.option(key as keyof Pick<SortableProps<T>, ArrayToUnion<typeof SORTABLE_OPTION_FIELDS>>, newVal)
      }
    }
    return clonedProps
  }, null);

  return (
    <div {...otherProps} ref={sortableContainerRef} class={"sortablejs" + (ourProps.class ? ` ${ourProps.class}` : '')}>
      <For each={ourProps.items}>
        {(item, i) => (
          <div data-id={item[ourProps.idField]} data-index={i()}>
            {ourProps.children(item)}
          </div>
        )}
      </For>
    </div>
  );
}

type ArrayToUnion<T extends readonly string[]> = T[number];

