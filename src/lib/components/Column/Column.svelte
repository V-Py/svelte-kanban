<script lang="ts">
    import {onMount, getContext, createEventDispatcher} from 'svelte';
    import {columns} from '../../../stores/store.js';
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
    export let slots;
    export let show_fake_slot;
    export let categories_list;

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

    }

</script>

<div class="column w-52 min-w-52 max-w-52 bg-gray-100 flex flex-col rounded mx-1.5 my-3 border-transparent" in:fly="{{y:-200, duration:500}}" out:fly="{{y:200, duration:500}}">
    <div class="title tracking-wider font-bold text-base flex justify-start items-center relative">
        {#if bool_show_options}
        <button class="bg-transparent hover:bg-gray-200 py-2 px-3 rounded-md" id="title-column{index_col}" on:click={modifyColumnHandler}>{title}</button>
        {:else}
        <div id="container-column{index_col}" class="block">
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
    <div class="flex justify-start items-center ml-3 mb-1 text-gray-500 text-sm">
        {slots.length} Card{slots.length>1 ? "s" : ""}
    </div>
    <div class="content flex flex-col justify-start items-center"> 
        <!-- {#if show_fake_slot}
            <div class="animate empty-slot flex bg-transparent z-1 relative w-full h-7 m-1.5" style="background:transparent;"></div>
        {/if} -->

        {#if slots.length > 0}
            {#each slots as slot, index}
                <!-- <div class="{slot.animate == true ? 'animate' : ''} not-empty animate flex bg-transparent z-1 relative w-full h-7 m-1.5" in:fly="{{y:-200, duration:500}}"> -->
                <div class="{slot.animate == true ? 'animate' : ''} not-empty animate flex bg-transparent z-1 relative w-full h-7">
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
                        />
                    {:else}
                        <div class="animate empty-slot flex bg-black bg-opacity-10 z-1 relative w-full h-6 m-1.5 p-1"></div>
                    {/if}
                </div>
            {/each}
        {/if}
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
