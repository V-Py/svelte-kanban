<script>
    import {fade, fly} from 'svelte/transition';
    import {onMount, getContext, createEventDispatcher} from 'svelte';
    import Fa from 'svelte-fa'
    import { faEllipsisH, faSave} from '@fortawesome/free-solid-svg-icons';

    const dispatch = createEventDispatcher();

    onMount(() => {
        const id_card = "card-"+id+"-col-"+id_col;
        document.getElementById(id_card).addEventListener('touchstart', function(e){
            // TODO
        })
    })

    function removeCard(e){
        const array_temp = this.id.split('remove-');
        const array_bis = array_temp[1].split("-col-");
        const index_card = array_bis[0];
        const index_col = array_bis[1];
        dispatch('removeCard', {card:index_card, col:index_col});  
    }

    function modifyDate(){
        const modify_date = `modify-date-${id}-col-${id_col}`;
        const input_date = `input-date-${id}-col-${id_col}`;
        console.log(modify_date);
        console.log(input_date);

        document.getElementById(modify_date).style.display = 'none';
        document.getElementById(input_date).style.display = '';
        document.getElementById(input_date).focus();
    }

    export let id;
    export let id_col;

    export let title = 'New Card';
    export let color = 'gray';
    export let description = 'empty';
    export let category = 'default';
    export let date = '01/01/2021';
</script>


<div id="card-{id}-col-{id_col}"  style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;" class="card bg-white flex flex-col w-48 h-24 absolute p-2 ml-1.5 mt-1.5 border-1 border-black border-opacity-10 rounded z-2 draggable" draggable=true on:mousedown>
    <div class="flex-1 w-full">
        <div class="text-xs px-2 py-2 block cursor-pointer text-white rounded-full float-left" style="background:{color}; opacity:0.3;">{category}</div>
        <button id="remove-{id}-col-{id_col}" class="remove bg-transparent border-transparent float-right hover:cursor-pointer hover:brightness-75" on:click="{removeCard}">
            <Fa icon={faEllipsisH}/>
        </button>
    </div>
    <div class="flex-1 w-full justify-center">
        <div class="text-lg font-bold tracking-wider text-">{title}</div>
    </div>
    <div class="flex-1 w-full relative">
        <button class="bg-transparent text-xs text-gray-500 float-left hover:bg-gray-200 px-3 rounded-md" id="modify-date-{id}-col-{id_col}" on:click={modifyDate}>{date}</button>
        <input id="input-date-{id}-col-{id_col}" value={date} type="text" style="display:none;" class="text-xs shadow appearance-none border rounded py-1 px-2 w-20 float-left text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <button class="right-12 top-0 absolute bg-transparent w-6 h-6 block rounded-full hover:bg-black hover:bg-opacity-20"><Fa icon={faSave} /> </button>
    </div>
</div>

<style type="text/scss">
	@import './src/styles/colors';
    .draggable{
		cursor:grab;
	}

</style>
