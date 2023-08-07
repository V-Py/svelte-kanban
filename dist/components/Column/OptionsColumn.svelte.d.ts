import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        index_col: any;
        bool_show_options: any;
        fontPrimary: any;
    };
    events: {
        saveColumn: CustomEvent<any>;
        removeColumn: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type OptionsColumnProps = typeof __propDef.props;
export type OptionsColumnEvents = typeof __propDef.events;
export type OptionsColumnSlots = typeof __propDef.slots;
export default class OptionsColumn extends SvelteComponentTyped<OptionsColumnProps, OptionsColumnEvents, OptionsColumnSlots> {
}
export {};
