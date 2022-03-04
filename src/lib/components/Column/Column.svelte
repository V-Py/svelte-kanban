<script lang="ts">
    import {onMount, getContext, createEventDispatcher} from 'svelte';
    import {columns} from '$lib/stores/store';
    import {fly} from 'svelte/transition';
    import Card from '../Card.svelte';
    import OptionsColumn from'./OptionsColumn.svelte';
    import {globalLang} from '$lib/stores/store';

    let bool_show_options = true;

    export let title;
    export let index_col;
    export let slots;
    export let show_fake_slot;
    export let categories_list;
    export let theme;

    const dispatch = createEventDispatcher();

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
        $columns[index_col].title = new_title;
        bool_show_options = true;

        dispatch('columnSaveTitle', {title:new_title})
    }

</script>

<div class="column {theme}" in:fly="{{y:-200, duration:500}}" out:fly="{{y:200, duration:500}}">
    <div class="title">
        {#if bool_show_options}
        <button class="button-title" id="title-column{index_col}" on:click={modifyColumnHandler}>{title}</button>
        {:else}
        <div id="container-column{index_col}" class="title-container" style="">
            <input type="text" id="input-colum{index_col}" class="title-input" value={title} />
            <button id="save-column{index_col} "class="save-column" on:click={saveColumn}>
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mdi" width="15" height="15" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M15 9H5V5h10m-3 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3a3 3 0 0 1-3 3m5-16H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4z" fill="currentColor"></path></svg>
            </button>
        </div>
        {/if}
        <OptionsColumn
            on:removeColumn
            on:modifyColumn={modifyColumnHandler}
            {index_col}
            {bool_show_options}
        />
    </div>

    <div class="cards-count">
        {slots.length} Card{slots.length>1 ? "s" : ""}
    </div>

    <div class="content"> 
        {#if slots.length > 0}
            {#each slots as slot, index}
                <div class="{slot.animate == true ? 'animate' : ''} not-empty animate">
                    {#if slot.empty == false}
                        <Card
                            id={index}
                            id_col={index_col}
                            {categories_list}
                            on:mousedown="{(e) => {handleMouseDown(e, index)}}"

                            title={slot.title}
                            description={slot.description}
                            category={slot.category}
                            date={slot.date}

                            on:cardPropModify
                            on:cardPropSaved
                            on:cardRemove
                            on:moveCardUp
                            on:moveCardDown
                        />
                    {:else}
                        <div class="animate empty-slot"></div>
                    {/if}
                </div>
            {/each}
        {/if}
    </div>
    <button class="add-card" on:click={() => {dispatch('addCard', {index:index_col});  }}>
        <span>{$globalLang.getStr('AddACard')} </span>
        <svg style="display:inline-block" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mdi-light" width="22" height="22" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M5 13v-1h6V6h1v6h6v1h-6v6h-1v-6H5z" fill="currentColor"></path></svg>
    </button>
</div>

<style type="text/scss">
    @import './src/lib/styles/colors';

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
        justify-content: flex-start;
        align-items: center;
        position:relative;
        letter-spacing:0.05em;
        font-size:1rem;
    }

    .button-title{
        background-color: transparent;
        padding: 0.5rem 0.75rem;
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

    .button-title:hover{
        background-color: rgb(229, 231, 235);
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
    }

    .add-card:hover{
        background-color: rgb(229, 231, 235);
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
