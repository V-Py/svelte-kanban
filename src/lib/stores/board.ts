// https://dev.to/jdgamble555/the-correct-way-to-use-stores-in-sveltekit-3h6i

// ======================================	
// When using CRDT comment out this block
// /*
export const useCrdt = false;
import { writable } from 'svelte/store';
// */

// ====================================
// When using CRDT uncomment this block
// and add the following dependencies:
// "@syncedstore/core": "0.6.0-alpha.0",
// "@syncedstore/svelte": "0.6.0-alpha.0",
// "y-webrtc": "^10.2.5"
/*
export const useCrdt = true;
import { syncedStore, getYjsDoc } from '@syncedstore/core';
import { svelteSyncedStore } from '@syncedstore/svelte';
import { WebrtcProvider } from 'y-webrtc';
*/

import { getContext, setContext } from 'svelte';
import type { Writable } from 'svelte/store';

type Board = {
	columns: object[];
};

export function getBoard(): Writable<Board> {
	let obj: Writable<Board> = getContext('board');
	if (obj) return obj;

	// ======================================
	// When using CRDT comment out this block
	// /*
	if (useCrdt) throw new Error('useCrdt should be false');
	obj = writable({ columns: [] });
	// */

	// ====================================================================
	// When using CRDT uncomment this block
	// To enable the webrtc provider, run: PORT=4444 npx y-webrtc server.js
	/*
	if (!useCrdt) throw new Error('useCrdt should be true');
	const store = syncedStore({ columns: [] });
	obj = svelteSyncedStore(store) as unknown as Writable<Board>;
	const rtc = new WebrtcProvider('svelte-kanban', getYjsDoc(store), {
		signaling: ['ws://localhost:4444']
	});
	rtc.connect();
	setContext('web-rtc', rtc);
	*/

	setContext('board', obj);
	return obj;
}
