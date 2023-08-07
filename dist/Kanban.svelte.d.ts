import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        theme?: string | undefined;
        primary?: null | undefined;
        secondary?: null | undefined;
        third?: null | undefined;
        fontPrimary?: null | undefined;
        fontSecondary?: null | undefined;
        lang?: string | undefined;
        minimalist?: boolean | undefined;
        maxColumns?: number | undefined;
        categories_list?: {
            label: any;
            color: string;
            bgColor: string;
        }[] | undefined;
        colsList?: {
            name: any;
            cards: never[];
        }[] | undefined;
    };
    events: {
        cardPropModify: CustomEvent<any>;
        columnSaveTitle: CustomEvent<any>;
        cardPropSaved: CustomEvent<any>;
        cardRemove: CustomEvent<any>;
        cardDragStart: CustomEvent<any>;
        cardDragMove: CustomEvent<any>;
        cardDragEnd: CustomEvent<any>;
        cardAdd: CustomEvent<any>;
        columnRemove: CustomEvent<any>;
        columnAdd: CustomEvent<any>;
        moveCardUp: CustomEvent<any>;
        moveCardDown: CustomEvent<any>;
        columnMoved: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type KanbanProps = typeof __propDef.props;
export type KanbanEvents = typeof __propDef.events;
export type KanbanSlots = typeof __propDef.slots;
export default class Kanban extends SvelteComponentTyped<KanbanProps, KanbanEvents, KanbanSlots> {
}
export {};
