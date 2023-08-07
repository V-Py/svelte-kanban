/// <reference types="svelte" />
export const number_of_slots: import("svelte/store").Writable<number>;
export const main_width: import("svelte/store").Writable<string>;
export const main_height: import("svelte/store").Writable<string>;
export const columns: import("svelte/store").Writable<never[]>;
export const globalLang: import("svelte/store").Writable<Lang>;
import { Lang } from '../class/Lang';
