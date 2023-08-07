import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        id: number;
        id_col: number;
        title?: any;
        description?: string | undefined;
        category?: {
            label: string;
            bgColor: string;
            color: string;
        } | undefined;
        date?: string | undefined;
        categories_list: any;
    };
    events: {
        mousedown: MouseEvent;
        moveCardUp: CustomEvent<any>;
        moveCardDown: CustomEvent<any>;
        cardRemove: CustomEvent<any>;
        cardPropModify: CustomEvent<any>;
        cardPropSaved: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type CardProps = typeof __propDef.props;
export type CardEvents = typeof __propDef.events;
export type CardSlots = typeof __propDef.slots;
export default class Card extends SvelteComponentTyped<CardProps, CardEvents, CardSlots> {
}
export {};
