import { writable } from 'svelte/store';
import { Lang } from '../class/Lang.js';

export const number_of_slots = writable(0);
export const main_width = writable('');
export const main_height = writable('');
export const columns = writable([]);
export const globalLang = writable(new Lang());
export const unique_id = writable(0);