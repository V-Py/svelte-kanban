<script lang="ts">
    import {fade, fly} from 'svelte/transition';
    import {onMount, getContext, createEventDispatcher} from 'svelte';
    import Fa from 'svelte-fa'
    import { faEllipsisH, faSave, faTrashAlt, faTimes, faChevronUp, faChevronDown} from '@fortawesome/free-solid-svg-icons';
    import {columns} from '$lib/stores/store';

    let bool_show_cats_list = false;
    const dispatch = createEventDispatcher();

    onMount(() => {
        const id_card = "card-"+id+"-col-"+id_col;
        document.getElementById(id_card).addEventListener('touchstart', function(e){
            // TODO
        })
    })

    function removeCard(e){
        console.log('REMOVE CARD');
        // debugger;
		const column_temp = $columns[id_col];
		column_temp.slots.splice(id, 1);
		$columns[id_col].slots = [... column_temp.slots];
        dispatch('cardRemove', {});  
    }

    function modifyProp(prop:string){
        const modify = `modify-${prop}-${id}-col-${id_col}`;
        const save = modify.replace('modify', 'save');
        const input = modify.replace('modify', 'input');
        document.getElementById(modify).style.display = 'none';
        document.getElementById(input).style.display = '';
        document.getElementById(input).focus();
        document.getElementById(save).style.display = '';
        dispatch('cardPropModify', {prop, col:id_col, card:id, value:(<HTMLInputElement>document.getElementById(input)).value});  
    }

    function saveProp(prop:string){
        const modify = `modify-${prop}-${id}-col-${id_col}`;
        const save = modify.replace('modify', 'save');
        const input = modify.replace('modify', 'input');
        document.getElementById(modify).style.display = '';
        document.getElementById(input).style.display = 'none';
        document.getElementById(save).style.display = 'none';
        $columns[id_col].slots[id][prop] = (<HTMLInputElement>document.getElementById(input)).value;
        dispatch('cardPropSaved', {prop, col:id_col, card:id, value:(<HTMLInputElement>document.getElementById(input)).value});  
    }
 
    function changeCategory(cat_index:number){
        const oldValue = $columns[id_col].slots[id].category;
        $columns[id_col].slots[id].category = categories_list[cat_index];
        bool_show_cats_list = false;
        dispatch('cardPropSaved', {prop:'category', col:id_col, card:id, oldValue, newValue:categories_list[cat_index]}); 
    }

    export let id:number;
    export let id_col:number;
    export let title = 'New Card';
    export let description = 'empty';
    export let category = {label:'default', bgColor:'gray', color:'white'};
    export let date = '01/01/2021';
    export let categories_list;
</script>


<div id="card-{id}-col-{id_col}" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;" class="card draggable" draggable=true on:mousedown>
    <div class="card-part">
        <div style="flex:1; display:flex;justfiy-content:flex-start; align-items:center;">
            <button class="card-category" style="background:{category.bgColor}; color:{category.color}" on:click={()=>{bool_show_cats_list = !bool_show_cats_list}}>{category.label}</button>
            {#if bool_show_cats_list}
                <div class="categories-list">
                    {#each categories_list as cat_temp, cat_index}
                        <button class="category-button" on:click={()=>{changeCategory(cat_index)}}>
                            <div class="category-circle" style="background-color:{cat_temp.bgColor}"></div>
                            {cat_temp.label}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
        <div style="flex:1; display:flex;justify-content:flex-end; align-items:center;">
            <button on:click={removeCard} id="remove-{id}-col-{id_col}" class="card-remove" on:click="{removeCard}">
                <Fa icon={faTimes}/>
            </button>
        </div>
    </div>
    <div class="card-part" style="justify-content:center;">
        <button on:click={()=>{modifyProp('title')}} id="modify-title-{id}-col-{id_col}" class="button-title">{title}</button>
        <input id="input-title-{id}-col-{id_col}" value={title} type="text" style="display:none;" class="input-title">
        <button on:click={()=>{saveProp('title')}} id="save-title-{id}-col-{id_col}" style="display:none;right:1rem; top:0.25rem;" class="save-button"><Fa icon={faSave} /> </button>
    </div>
    <div class="card-part">
        <button on:click={()=>{modifyProp('date')}} class="button-date" id="modify-date-{id}-col-{id_col}">{date}</button>
        <input id="input-date-{id}-col-{id_col}" value={date} type="text" style="display:none;" class="input-date">
        <button on:click={()=>{saveProp('date')}} id="save-date-{id}-col-{id_col}" style="display:none;right:4rem;" class="save-button"><Fa icon={faSave} /> </button>
    </div>

    <button style="display:none; top:0rem" class="card-arrows" on:click={() => {dispatch('moveCardUp', {col:id_col, card:id})}}>
        <Fa icon={faChevronUp} /> 
    </button>

    <button style="display:none; top:4.75rem;" class="card-arrows" on:click={() => {dispatch('moveCardDown', {col:id_col, card:id})}}>
        <Fa icon={faChevronDown} /> 
    </button>
</div>

<style type="text/scss">
	@import './src/lib/styles/colors';

    .card{
        background:white;
        display:flex;
        flex-direction: column;
        width:12rem;
        height:6rem;
        position: absolute;
        padding:0.5rem;
        margin-left:0.5rem;
        margin-top:0.25rem;
        border:1px solid rgba(0,0,0,0.1);
        border-radius: 0.25rem;
        z-index:inherit;
        overflow:inherit;
    }

    .card-category{
        font-size: 0.75rem;
        line-height: 1rem;
        padding:0.25rem 0.5rem;
        display:block;
        cursor:pointer;
        border-radius:0.375rem;
        float:left;
    }

    .categories-list{
        position:absolute;
        top:1.75rem;
        left:0px;
        display:flex;
        flex-direction: column;
        border-radius: 0.375rem;
        z-index: 10;
        overflow:hidden;
        background:white;
        box-shadow:0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    }

    .card-remove{
        background:transparent;
        border:transparent;
        float:right;
        width:1.5rem;
        height:1.5rem;
        border-radius: 0.375rem;
        justify-content: center;
        align-items: center;
        display:flex;
    }

    .card-remove:hover{
        cursor:pointer;
        background:rgb(229, 231, 235);
    }

    .save-button{
        font-size: 0.75rem;
        line-height: 1rem;
        position:absolute;
        background-color: transparent;
        width: 1.5rem;
        height:1.5rem;
        display:flex;
        justify-content:center;
        align-items: center;
        border-radius: 50%;
    }

    .save-button:hover{
        background:rgba(0,0,0,0.2);
    }

    .input-date, .input-title{
        font-size: 0.75rem;
        line-height: 1.25rem;
        padding:0.25rem 0.5rem;
        width:5rem;
        float:left;
        border-radius:0.25rem;
        border:1px;
        appearance: none;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
        color:rgb(55, 65, 81);
    }
    .input-date:focus{
        outline: none;
    }

    .input-title{
        text-align:center;
    }

    .button-title{
        background:transparent;
        font-weight:bold;
        border-radius: 0.375rem;
        padding-left:0.75rem;
        padding-right:0.75rem;
        font-size: 1.125rem;
        line-height: 1.75rem;
        letter-spacing: 0.05em;
    }
    .button-title:hover, .button-date:hover{
        background-color:rgb(209, 213, 219);;
    }

    .button-date{
        background:transparent;
        font-size: 0.75rem;
        line-height: 1rem;
        float:left;
        border-radius:0.375rem;
        padding-left:0.75rem;
        padding-right:0.75rem;
        color:rgb(107, 114, 128);
    }

    .category-circle{
        display:inline-block;
        border-radius: 50%;
        width:0.75rem;
        height:0.75rem;
        margin-right:0.25rem;
    }

    .category-button{
        display:flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 0.75rem;
        line-height: 1rem;
        padding:0.5rem;
        background: transparent;
        color:rgb(107, 114, 128);
    }

    .category-button:hover{
        background: rgba(0,0,0,0.1);
    }

    .draggable{
		cursor:grab;
	}
    
    .card:hover .card-arrows, .card:active .card-arrows{
        display:flex !important;
    }

    .card-part{
        display:flex;
        width:100%;
        position:relative;
    }

    .card-arrows{
        position:absolute;
        left:5rem;
        background:transparent;
        width:1.25rem;
        height:1.25rem;
        display:flex;
        justify-content: center;
        align-items: center;
        border-radius: 0.25rem;
    }
    .card-arrows:hover{
        background:rgba(0,0,0,0.1);
        cursor:pointer;
    }

</style>
