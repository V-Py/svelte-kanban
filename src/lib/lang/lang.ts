import { en } from './en';
import { fr } from './fr';

const table = { en, fr };
export type LangCode = keyof typeof table;

type Key = keyof typeof table.en;

export class Lang {
	lang: LangCode;

	constructor(lang: LangCode) {
		this.lang = lang;
	}

	getStr(key: Key) {
		return table[this.lang][key];
	}
}
