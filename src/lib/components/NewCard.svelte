<script>
    import {onMount, getContext} from 'svelte';
    import {card_height, card_width} from '../../stores/store.js';
	//#endregion
    export let color;
    export let title;

    function modifyCard(){

    }
    onMount(()=> {});
    
</script>

<div id="new-card" class="new-card draggable w-48 h-28 p-2.5 rounded border-1 my-1 flex flex-col bg-white absolute z-2" draggable=true on:mousedown>
    <div class="flex flex-1 w-full items-center justify-evenly">
        <div class="illustration h-7 w-7 rounded-full block bg-gray-400 ml-2.5 hover:bg-gray-200 hover:cursor-pointer"></div>
        <button class="bg-transparent border-transparent ml-24 hover:cursor-pointer hover:brightness-150" on:click="{modifyCard}">
            <!-- <i class="fas fa-pen"></i> -->
            /
        </button>
    </div>
    <div class="flex flex-1 w-full items-center justify-center">
        <div class="text-sm font-bold tracking-wider">{title} 
    </div>
    </div>
    <div class="flex flex-1 w-full items-center justify-evenly">
        <div class="text-gray float-left" style="font-size:10px;">09/12/2021</div>
        <div class="status block ml-7 rounded-full px-0.25 py-0.5 text-white text-xs w-12 h-5 hover:cursor-pointer hover:brightness-75" style="background:{color}">statut</div>
    </div>
</div>

<style type="text/scss">
	@import './src/styles/colors';
	.new-card{
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border-color: rgba(0,0,0,0.125);
	}

	.draggable{
		cursor:grab;
	}
</style>
