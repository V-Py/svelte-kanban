import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        title: any;
        index_col: any;
        slots: any;
        show_fake_slot: any;
        categories_list: any;
        theme: any;
        secondary: any;
        fontPrimary: any;
        fontSecondary: any;
    };
    events: {
        removeColumn: CustomEvent<any>;
        cardPropModify: CustomEvent<any>;
        cardPropSaved: CustomEvent<any>;
        cardRemove: CustomEvent<any>;
        moveCardUp: CustomEvent<any>;
        moveCardDown: CustomEvent<any>;
        moveColumn: CustomEvent<any>;
        addCard: CustomEvent<any>;
        cardMouseDown: CustomEvent<any>;
        columnSaveTitle: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type ColumnProps = typeof __propDef.props;
export type ColumnEvents = typeof __propDef.events;
export type ColumnSlots = typeof __propDef.slots;
export default class Column extends SvelteComponentTyped<ColumnProps, ColumnEvents, ColumnSlots> {
}
export {};
