import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        theme: any;
        fontPrimary: any;
        secondary: any;
    };
    events: {
        addColumn: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type AddColumnBtnProps = typeof __propDef.props;
export type AddColumnBtnEvents = typeof __propDef.events;
export type AddColumnBtnSlots = typeof __propDef.slots;
export default class AddColumnBtn extends SvelteComponent<AddColumnBtnProps, AddColumnBtnEvents, AddColumnBtnSlots> {
}
export {};
