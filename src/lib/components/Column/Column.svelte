<script lang="ts">
    import {onMount, getContext, createEventDispatcher} from 'svelte';
    import {number_of_slots} from '../../../stores/store.js';
    import {fly} from 'svelte/transition';
    import Card from '../Card.svelte';
    import OptionsColumn from'./OptionsColumn.svelte';
    import Fa from 'svelte-fa'
    import { faSave } from '@fortawesome/free-solid-svg-icons';

    let bool_show_options = true;

    export let title;
    export let cards;
    export let index_col;
    export let number_slots;
    export let slots;
    export let show_fake_slot;

    const dispatch = createEventDispatcher();

    function handleMouseDown(e){
        dispatch('cardMouseDown', {event:e, elem:this});  
    };

    function modifyColumnHandler(){
        bool_show_options = false;
    }

    function saveColumn(){
        bool_show_options = true;
    }

</script>

<div class="column w-52 min-w-52 max-w-52 h-full bg-gray-50 flex flex-col rounded mx-1.5 my-3 border-transparent" in:fly="{{y:-200, duration:500}}" out:fly="{{y:200, duration:500}}">
    <div class="title h-20 max-h-20 min-h-20 tracking-wider font-bold text-base flex justify-center items-center relative">
        {#if bool_show_options}
        <span id="title-column{index_col}">{title.toUpperCase()}</span>
        {:else}
        <div id="container-column{index_col}">
            <input type="text" id="input-colum{index_col}" class="text-center padding-1 w-6/12" value={title} />
            <button id="save-column{index_col} "class="save-column bg-transparent border-transparent text-gray-700 w-8 h-8 rounded-full absolute top-0 left-44 hover:cursor-pointer hover:bg-black hover:bg-opacity-10" on:click={saveColumn}>
                <Fa icon={faSave} />
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
    <div class="content h-full flex flex-col justify-start items-center">
        {#if show_fake_slot}
            <div class="animate flex bg-transparent z-1 relative w-full h-7 m-1.5" style="background:transparent;"></div>
        {/if}
        {#each slots as slot, index}
            <div class="{slot.animate == true ? 'animate' : ''} animate flex bg-transparent z-1 relative w-full h-7 m-1.5" transition:fly="{{y:-200, duration:500}}">
                {#if slot.empty == false}
                    <Card
                        id={index}
                        id_col={index_col}
                        on:mousedown="{handleMouseDown}"
                        title={slot.title}
                        description="desc"
                        color="orange"
                        on:removeCard
                    />
                {/if}
            </div>
        {/each}
    </div>
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
