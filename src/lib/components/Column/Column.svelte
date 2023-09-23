<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import {fly}                   from 'svelte/transition';
    import {getBoard, getLang, getDragDrop}  from '$stores';
    import Card                    from '../Card.svelte';
    import OptionsColumn           from './OptionsColumn.svelte';

    let bool_show_options = true;

    export let index_col: number;
    export let catsList;
    export let theme;
    export let secondary;
    export let fontPrimary;
    export let fontSecondary;

    const dispatch = createEventDispatcher();

    const board = getBoard();
    const globalLang = getLang();
    const dragDrop = getDragDrop();

	let column;
	$: column = $board.columns[index_col] || {};

    let cards;
    $: cards = column.cards || [];

    let numCards = 0;
    $: numCards = cards.length + (dropHere && $dragDrop.from.col === index_col ? 0 : Number(dropHere));

	let title;
	$: title = column.title;

    let dropHere = false;
    $: dropHere = $dragDrop.to.col === index_col;

    function handleMouseDown(e, index_card:number){
        if(e.target instanceof HTMLButtonElement) return;
        dispatch('cardMouseDown', {event:e, col:index_col, card:index_card});  
    };

    function modifyColumnHandler(){
        bool_show_options = false;
        const input_id = 'input-colum'+index_col;

        setTimeout(function(){
            document.getElementById(input_id).focus();
            document.getElementById(input_id).addEventListener('keyup', function(e){
                if(e.key == 'Enter'){
                    saveColumn();
                }
            })
        }, 100);

    }

    function saveColumn(){
        const input_id = 'input-colum'+index_col;
        const new_title = document.getElementById(input_id).value;
        $board.columns[index_col].title = new_title;
        bool_show_options = true;
        dispatch('columnSaveTitle', {title:new_title})
    }

</script>

<div class="column {theme}" style:background="{secondary}" in:fly|local="{{y:-200, duration:500}}" out:fly|local="{{y:200, duration:500}}">
    <div class="title" >
        {#if bool_show_options}
            <button style:color="{fontPrimary}" class="button-title" id="title-column{index_col}" on:click={modifyColumnHandler}>{title}</button>
        {:else}
            <input style:color="{fontPrimary}" type="text" id="input-colum{index_col}" class="title-input" value={title} />
        {/if}

        <OptionsColumn
            on:removeColumn
            on:modifyColumn={modifyColumnHandler}
            on:saveColumn={saveColumn}
            {index_col}
            {bool_show_options}
            {fontPrimary}
        />
        <button class="column-arrows left" on:click={() => {dispatch('moveColumn', {direction:'left', index:index_col})}} style:color="{fontPrimary}">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z"></path></svg>
        </button>
        <button class="column-arrows right" on:click={() => {dispatch('moveColumn', {direction:'right', index:index_col})}} style:color="{fontPrimary}">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M10 6L8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
        </button>
    </div>

    <div class="cards-count" style:color="{fontSecondary}">
        {numCards} {$globalLang.getStr(numCards === 1 ? 'Card':'Cards')}
    </div>

    <div class="content"> 
        {#each cards as cardObj, card}
            {#if dropHere && $dragDrop.to.card === card}
                <div class="animate empty-slot"/>
            {/if}
            <div class="animate not-empty">
                <Card
                    id={card}
                    id_col={index_col}
                    {catsList}
                    on:mousedown="{(e) => {handleMouseDown(e, card)}}"
                    title={cardObj.title}
                    category={cardObj.category}
                    date={cardObj.date}
                    on:cardPropModify
                    on:cardPropSaved
                    on:cardRemove
                    on:moveCardUp
                    on:moveCardDown
                />
            </div>
        {/each}
        {#if dropHere && $dragDrop.to.card >= cards.length}
            <div class="animate empty-slot"/>
        {/if}

    </div>
    <button class="add-card" on:click={() => {dispatch('addCard', {index:index_col});  }} style:color="{fontSecondary}">
        <span>{$globalLang.getStr('AddACard')} </span>
        <svg style="display:inline-block" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mdi-light" width="22" height="22" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M5 13v-1h6V6h1v6h6v1h-6v6h-1v-6H5z" fill="currentColor"></path></svg>
    </button>
</div>

<style lang="scss">
    @import '../../styles/colors';
    // @import '../../../app.css';

    .column{
        width:13rem;
        min-width:13rem;
        max-width:13rem;
        display:flex;
        flex-direction: column;
        border-radius:0.375rem;
        margin: 0.75rem 0.375rem;
        border-color: transparent;
    }

    .column.light{
        background-color: var(--light-column-bg);
    }

    .column.dark{
        background-color: var(--dark-column-bg);
    }

    .column .title{
        font-style:bold;
        display:flex;
        justify-content: center;
        align-items: center;
        position:relative;
        letter-spacing:0.05em;
        font-size:1rem;
        margin-top:3px;
    }

    .button-title{
        background-color: transparent;
        padding: 0.375rem 0.375rem;
        border-radius:0.375rem;
        border:none;
        cursor:pointer;
    }

    .light .button-title{
        color:inherit;
    }

    .dark .button-title{
        color:white;
    }


    .add-card{
        background-color:transparent;
        color:var(--light-gray-font);
        font-weight:400;
        margin-left:auto;
        margin-right:auto;
        padding-left: 0.75rem;
        padding-right:0.75rem;
        border-radius:0.375rem;
        display:flex;
        align-items: center;
        border:none;
        cursor:pointer;
        margin-bottom:5px;
    }

    .add-card:hover, .button-title:hover{
        background-color: rgba(0,0,0,0.1)
    }

    .empty-slot{
        display:flex;
        background-color: rgba(0,0,0,0.1);
        z-index:1;
        position:relative;
        width:100%;
        height:1.5rem;
        margin:0.375rem;
        padding:0.25rem;
        border-radius: 0.375rem;
    }

    .not-empty{
        display:flex;
        background:transparent;
        position:relative;
        width:100%;
        height:1.75rem;
    }

    .content{
        display:flex;
        flex-direction:column;
        justify-content: flex-start;
        align-items: center;
    }

    .cards-count{
        display:flex;
        justify-content: flex-start;
        align-items: center;
        margin-left:0.75rem;
        margin-bottom:0.25rem;
        color:rgb(107, 114, 128);
        font-size:0.875rem;
        line-height:1.25rem;
    }

    .title-input{
        text-align: center;
        padding:0.125rem 0.25rem;
        width:50%;
        border:none;
        margin-top:5px;
        background:transparent;
        border-bottom:1px solid;
    }

    .light .title-input{
        color:inherit;
        border-color:black;
    }

    .dark .title-input{
        color:#fff;
        border-color:white;
    }

    .title-input:focus{
        outline:none;
    }

    .title-container{
        display:flex;
        justify-content: center;
    }

    .title:hover .column-arrows{
        display:flex !important;
    }

    .column-arrows{
        position:absolute;
        background:transparent;
        width:1.625rem;
        height:1.625rem;
        display:none;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        border:none;
        cursor:pointer;
    }

    .column-arrows.left{
        left:2.5rem
    }

    .column-arrows.right{
        right:2.5rem;
    }

    .column-arrows:hover{
        background:rgba(0,0,0,0.1);
        cursor:pointer;
    }

    .save-column{
        text-align:center;
        background:transparent;
        border:transparent;
        color:rgb(55, 65, 81);
        width:2rem;
        height:2rem;
        border-radius:0.375rem;
        position:absolute;
        top:0px;
        left:10.5rem;
        display:flex;
        justify-content: center;
        align-items: center;
        cursor:pointer;
    }

    .save-column:hover{
        background:rgba(0,0,0,0.1);
    }

    .animate{
        animation: growingSlot .3s ease-out forwards;
    }

    @keyframes growingSlot{
        from{
            height:0px;
        }
        to{
            height:120px;
        }
    }
</style>
