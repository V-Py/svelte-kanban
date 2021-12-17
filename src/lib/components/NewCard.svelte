<script>
    import {onMount, getContext} from 'svelte';
    import {card_height, card_width} from '../../stores/store.js';
    import Fa from 'svelte-fa'
    import {faPen, faSave } from '@fortawesome/free-solid-svg-icons';

    export let props_list;


    function modifyCard(){

    }
    
    // TODO 
    // Titre
    // Date
    // Prop
    // Picture
    let title = 'Titre';
    let prop_chosen = 0;
    let show_props_list = false;
    let show_title = true;
    
    onMount(()=> {});
</script>

<div id="new-card" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;" class="draggable w-48 h-28 p-2.5 rounded border-1 my-1 flex flex-col bg-white absolute z-2 border-1 border-black border-opacity-10" draggable=true on:mousedown>
    <div class="flex flex-1 w-full items-center justify-evenly">
        <div class="illustration h-7 w-7 rounded-full block bg-gray-400 ml-2.5 hover:bg-gray-200 hover:cursor-pointer"></div>
    </div>
    <div class="flex flex-1 w-full items-center justify-center">
        {#if show_title}
            <div on:click={() => {show_title = false}} class="text-sm font-bold tracking-wider hover:cursor-pointer hover:bg-black hover:bg-opacity-20 p-1">{title}</div>
        {:else}
            <input class="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
            <button><Fa icon={faSave}/></button>
        {/if}
        
    </div>
    <div class="flex flex-1 w-full items-center justify-evenly relative">
        <div class="text-gray float-left hover:cursor-pointer hover:bg-black hover:bg-opacity-20 p-1" style="font-size:10px;">09/12/2021</div>
        <div on:click={() => {show_props_list = !show_props_list}} class="status block ml-7 rounded-full px-0.25 py-0.5 text-white text-xs w-12 h-5 hover:cursor-pointer hover:brightness-75" style="background:{props_list[prop_chosen].color}">{props_list[prop_chosen].label}</div>
        {#if show_props_list}
        <div class="block absolute bg-white w-24 top-8 left-28 z-10 rounded-md" style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;">
            {#each props_list as prop_temp, index}
                <li on:click={() => {prop_chosen = index; show_props_list = false;}} class="list-none p-1 hover:cursor-pointer hover:bg-black hover:bg-opacity-10 {index == prop_chosen ? 'font-bold' : ''}">{prop_temp.label} </li>
            {/each}
        </div>
        {/if}
    </div>
</div>

<style type="text/scss">
	@import './src/styles/colors';
	.draggable{
		cursor:grab;
	}
</style>
