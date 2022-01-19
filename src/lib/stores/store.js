import { writable } from 'svelte/store';
import {Lang} from '$lib/class/Lang';

export const card_width = writable(200);
export const card_height = writable(120);
export const number_of_slots = writable(0);

export const main_width = writable('');
export const main_height = writable('');
export const columns = writable([]);
export const globalLang = writable(new Lang()); 