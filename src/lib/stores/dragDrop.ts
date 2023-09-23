import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

// The Svelte compiler scans for assignment rather than 'delete.'
// For example, 'delete dragDrop.to' is not reactive. Instead use:
// dragDrop.to.col = -1

type CardCoordinates = {
	col: number;
	card: number;
};

type DragDrop = {
	from: CardCoordinates;
	to: CardCoordinates;
};

export function getDragDrop() : Writable<DragDrop> {
	let obj: Writable<DragDrop> = getContext('dnd');
	if (obj) return obj;
	obj = writable({from: {col: -1, card: 0}, to: {col: -1, card: 0}});
	setContext('dnd', obj);
	return obj;
}
