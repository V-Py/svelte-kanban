export class Lang {
    constructor(lang?: string);
    lang: string;
    getStr(str: any): any;
}
export namespace Lang {
    namespace en {
        export let Yes: string;
        export let No: string;
        export let Done: string;
        export let Todo: string;
        export let Card: string;
        export let Cards: string;
        export let AddACard: string;
        export let NewCard: string;
        export let NewColumn: string;
        let _new: string;
        export { _new as new };
        export let task: string;
        export let personal: string;
        export let work: string;
        export let important: string;
    }
    namespace fr {
        let Yes_1: string;
        export { Yes_1 as Yes };
        let No_1: string;
        export { No_1 as No };
        let Done_1: string;
        export { Done_1 as Done };
        let Todo_1: string;
        export { Todo_1 as Todo };
        let Card_1: string;
        export { Card_1 as Card };
        let Cards_1: string;
        export { Cards_1 as Cards };
        let AddACard_1: string;
        export { AddACard_1 as AddACard };
        let NewCard_1: string;
        export { NewCard_1 as NewCard };
        let NewColumn_1: string;
        export { NewColumn_1 as NewColumn };
        let _new_1: string;
        export { _new_1 as new };
        let task_1: string;
        export { task_1 as task };
        let personal_1: string;
        export { personal_1 as personal };
        let work_1: string;
        export { work_1 as work };
        let important_1: string;
        export { important_1 as important };
    }
}
