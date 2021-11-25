<script>
    import {fade, fly} from 'svelte/transition';
    import {onMount, getContext, createEventDispatcher} from 'svelte';
    import Fa from 'svelte-fa'
    import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

    const dispatch = createEventDispatcher();

    onMount(() => {
        const id_card = "card-"+id+"-col-"+id_col;
        document.getElementById(id_card).addEventListener('touchstart', function(e){
            console.log('TOUCH', e);
        })
    })

    function removeCard(e){
        const array_temp = this.id.split('remove-');
        const array_bis = array_temp[1].split("-col-");
        const index_card = array_bis[0];
        const index_col = array_bis[1];

        // console.log('CARD', id_card, 'COL', id_col);
        dispatch('removeCard', {card:index_card, col:index_col});  
    }

    export let title;
    export let color;
    export let description;
    export let id;
    export let id_col;

</script>


<div id="card-{id}-col-{id_col}"  style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;" class="card bg-white flex flex-col w-48 h-24 absolute p-2.5 ml-1.5 mt-1.5 border-1 border-black border-opacity-10 rounded z-2 draggable" draggable=true on:mousedown>
    <div class="flex-1 w-full">
        <div class="text-xs px-1 py-2 block cursor-pointer text-white rounded-full float-left" style="background:{color}">statut</div>
        <button id="remove-{id}-col-{id_col}" class="remove bg-transparent border-transparent float-right hover:cursor-pointer hover:brightness-75" on:click="{removeCard}">
            <Fa icon={faEllipsisH}/>
        </button>
    </div>
    <div class="flex-1 w-full justify-center">
        <div class="text-lg font-bold tracking-wider text-">{title}</div>
    </div>
    <div class="flex-1 w-full">
        <div class="text-xs text-gray-500 flaot-left">09/12/2021</div>
    </div>
</div>

<style type="text/scss">
	@import './src/styles/colors';
    .draggable{
		cursor:grab;
	}

</style>
