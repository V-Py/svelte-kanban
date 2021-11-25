<script lang="ts">
    import {onMount, getContext, createEventDispatcher} from 'svelte';
    import {fly} from 'svelte/transition';
    import Fa from 'svelte-fa'
    import {faEllipsisV, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

    const dispatch = createEventDispatcher();
    export let index_col;
    export let bool_show_options;
    let bool_show_modal = false;

    function handleMouseDown(e){
        dispatch('cardMouseDown', {event:e, elem:this});  
    };

    function showOptionsColumn(){
        bool_show_modal = !bool_show_modal
        if(bool_show_modal){
            this.parentNode.children[1].classList.add('show-options');
        }else{
            this.parentNode.children[1].classList.remove('show-options');
        }
    }

    function modifyColumn(){
        bool_show_modal = !bool_show_modal;
        this.parentNode.classList.remove('show-options');
        dispatch('modifyColumn', {});

    }

    function removeColumn(){
        bool_show_modal = !bool_show_modal;
        this.parentNode.classList.remove('show-options');
        dispatch('removeColumn', {index_col:index_col});
    }
</script>

<div class="absolute left-48 top-1.5">
    {#if bool_show_options}
        <button id="options-column{index_col}" class="bg-transparent text-gray-700 border-transparent w-4 h-4 hover:cursor-pointer hover:brightness-90" on:click="{showOptionsColumn}">
            <Fa icon={faEllipsisV}/>
        </button>
        <div style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px; z-index:4;" class="modal-options absolute w-32 max-w-32 h-20 max-h-20 bg-white rounded-md top-3 flex flex-col font-bold font-size text-sm justify-around">
            <button id="modify-column{index_col}" class="action leading-8 h-8 flex justify-start items-center text-gray-700 tracking-normal bg-transparent border-transparent p-2 hover:cursor-pointer hover:bg-black hover:bg-opacity-10" on:click={modifyColumn}>
                <Fa icon={faPen}/> <span class="ml-2">Modifier</span>
            </button>
            <button id="delete-column{index_col}" class="action leading-8 h-8 flex justify-start items-center text-gray-700 tracking-normal bg-transparent border-transparent p-2 hover:bg-black hover:bg-opacity-10" on:click={removeColumn}>
                <Fa icon={faTrashAlt}/> <span class="ml-2">Supprimer</span>
            </button>
        </div>
    {/if}
</div>

<style type="text/scss">
    @import './src/styles/colors';
    .modal-options:not(.show-options){
        display:none;
    }

</style>