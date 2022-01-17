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


<div id="card-{id}-col-{id_col}"  style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;" class="card bg-white flex flex-col w-48 h-24 absolute p-2 ml-2 mt-1 border-1 border-black border-opacity-10 rounded z-2 draggable" draggable=true on:mousedown>
    <div class="flex-1 w-full relative">
        <button class="text-xs px-2 py-1 block cursor-pointer rounded-md float-left" style="background:{category.bgColor}; color:{category.color}" on:click={()=>{bool_show_cats_list = !bool_show_cats_list}}>{category.label}</button>
        {#if bool_show_cats_list}
            <div class="absolute top-7 left-0 flex flex-col rounded-md z-10 overflow-hidden bg-white shadow-lg">
                {#each categories_list as cat_temp, cat_index}
                    <button class="flex justify-start items-center text-xs p-2 bg-transparent text-gray-500 hover:bg-black hover:bg-opacity-10" on:click={()=>{changeCategory(cat_index)}}>
                        <div class="inline-block w-3 h-3 rounded-full mr-1" style="background-color:{cat_temp.bgColor}"></div>
                        {cat_temp.label}
                    </button>
                {/each}
            </div>
        {/if}
        <button on:click={removeCard} id="remove-{id}-col-{id_col}" class="remove bg-transparent border-transparent float-right hover:cursor-pointer hover:bg-gray-200 w-6 h-6 rounded-md flex justify-center items-center" on:click="{removeCard}">
            <Fa icon={faTimes}/>
        </button>
    </div>
    <div class="flex-1 w-full justify-center relative">
        <button on:click={()=>{modifyProp('title')}} id="modify-title-{id}-col-{id_col}" class="bg-transparent text-lg font-bold tracking-wider hover:bg-gray-200 rounded-md px-3">{title}</button>
        <input id="input-title-{id}-col-{id_col}" value={title} type="text" style="display:none;" class="text-center shadow appearance-none border rounded py-1 px-2 w-20 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <button on:click={()=>{saveProp('title')}} id="save-title-{id}-col-{id_col}" style="display:none;" class="text-xs right-4 top-1 absolute bg-transparent w-6 h-6 rounded-full hover:bg-black hover:bg-opacity-20 flex justify-center items-center"><Fa icon={faSave} /> </button>
    </div>
    <div class="flex-1 w-full relative">
        <button on:click={()=>{modifyProp('date')}} class="bg-transparent text-xs text-gray-500 float-left hover:bg-gray-200 px-3 rounded-md" id="modify-date-{id}-col-{id_col}">{date}</button>
        <input id="input-date-{id}-col-{id_col}" value={date} type="text" style="display:none;" class="text-xs shadow appearance-none border rounded py-1 px-2 w-20 float-left text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <button on:click={()=>{saveProp('date')}} id="save-date-{id}-col-{id_col}" style="display:none;" class="text-xs right-16 top-0 absolute bg-transparent w-6 h-6 flex justify-center items-center rounded-full hover:bg-black hover:bg-opacity-20 "><Fa icon={faSave} /> </button>
    </div>

    <button style="display:none" class="card-arrows absolute -top-1 left-20 bg-transparent hover:bg-black hover:bg-opacity-10 hover:cursor-pointer w-5 h-5 rounded flex justify-center items-center" on:click={() => {dispatch('moveCardUp', {col:id_col, card:id})}}>
        <Fa icon={faChevronUp} /> 
    </button>

    <button style="display:none" class="card-arrows absolute top-20 left-20 bg-transparent hover:bg-black hover:bg-opacity-10 hover:cursor-pointer w-5 h-5 rounded flex justify-center items-center" on:click={() => {dispatch('moveCardDown', {col:id_col, card:id})}}>
        <Fa icon={faChevronDown} /> 
    </button>
</div>

<style type="text/scss">
	@import './src/lib/styles/colors';
    .draggable{
		cursor:grab;
	}

    .card:hover .card-arrows, .card:active .card-arrows{
        display:flex !important;
    }

</style>
