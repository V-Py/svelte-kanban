<script lang="ts">
    import {onMount, getContext, createEventDispatcher} from 'svelte';
    import {number_of_slots, columns} from '../../../stores/store.js';
    import {fly} from 'svelte/transition';
    import Card from '../Card.svelte';
    import OptionsColumn from'./OptionsColumn.svelte';
    // import Fa from 'svelte-fa';
    import Icon from 'svelte-awesome';
    import { faSave } from '@fortawesome/free-solid-svg-icons';
    import { plus } from 'svelte-awesome/icons';

    let bool_show_options = true;

    export let title;
    export let cards;
    export let index_col;
    export let number_slots;
    export let slots;
    export let show_fake_slot;

    const dispatch = createEventDispatcher();

    function handleMouseDown(e){
        if(e.target instanceof HTMLButtonElement){
            return;
        }
        dispatch('cardMouseDown', {event:e, elem:this});  
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

    }

</script>

<div class="column w-52 min-w-52 max-w-52 bg-gray-100 flex flex-col rounded mx-1.5 my-3 border-transparent" in:fly="{{y:-200, duration:500}}" out:fly="{{y:200, duration:500}}">
    <div class="title h-20 max-h-20 min-h-20 tracking-wider font-bold text-base flex justify-center items-center relative">
        {#if bool_show_options}
        <button class="bg-transparent hover:bg-gray-200 py-2 px-3 rounded-md" id="title-column{index_col}" on:click={modifyColumnHandler}>{title.toUpperCase()}</button>
        {:else}
        <div id="container-column{index_col}">
            <input type="text" id="input-colum{index_col}" class="text-center padding-1 w-6/12" value={title} />
            <button id="save-column{index_col} "class="save-column text-center bg-transparent border-transparent text-gray-700 w-8 h-8 rounded-full absolute top-0 left-44 hover:bg-black hover:bg-opacity-10 flex justify-center items-center" on:click={saveColumn}>
                <Icon data={faSave}/>
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
    <!-- h-full -->
    <div class="content flex flex-col justify-start items-center"> 
        {#if show_fake_slot}
            <div class="animate empty-slot flex bg-transparent z-1 relative w-full h-7 m-1.5" style="background:transparent;"></div>
        {/if}
        {#each slots as slot, index}
            <div class="{slot.animate == true ? 'animate' : ''} not-empty animate flex bg-transparent z-1 relative w-full h-7 m-1.5" in:fly="{{y:-200, duration:500}}">
                {#if slot.empty == false}
                    <Card
                        id={index}
                        id_col={index_col}
                        on:mousedown="{handleMouseDown}"
                        on:removeCard

                        title={slot.title}
                        description={slot.description}
                        category={slot.category}
                        color={slot.color}
                        date={slot.date}
                    />
                {/if}
            </div>
        {/each}
    </div>
    <button class="bg-transparent text-gray-500 font-normal hover:bg-gray-200 mx-auto px-3 rounded-md" on:click={() => {dispatch('addCard', {index:index_col});  }}>
        Add a card <Icon data={plus} />
    </button>
</div>

<style type="text/scss">
    @import './src/styles/colors';
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
