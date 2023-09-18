import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

import { Lang } from '$lib/lang';
import type { LangCode } from '$lib/lang';

export function getLang(lang: LangCode = 'en'): Writable<Lang> {
	let obj: Writable<Lang> = getContext('lang');
	if (obj) return obj;
	obj = writable(new Lang(lang));
	setContext('lang', obj);
	return obj;
}
