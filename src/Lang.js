
export class Lang {
    lang;

    constructor(lang = 'en') {
        this.lang = lang;
    }

    static en = {
        Yes:'Yes',
        No:'No',
        Done:'Done',
        Todo:'Todo',
        Card:'Card',
        Cards:'Cards',
        AddACard:'Add a card',
        NewCard:'New card',
        NewColumn:'New column',
        new:'new',
        task:'task',
        personal:'personal',
        work:'work',
        important:'important'
    }

    static fr = {
        Yes:'Oui',
        No:'Non',
        Done:'Terminé',
        Todo:'À faire',
        Card:'Tâche',
        Cards:'Tâches',
        AddACard:'Nouvelle tâche',
        NewCard:'Nouvelle tâche',
        NewColumn:'Nouvelle colonne',
        new:'nouveau',
        task:'tâche',
        personal:'personnel',
        work:'travail',
        important:'important'
    };


    getStr(str){
        return Lang[this.lang][str];
    }
}

