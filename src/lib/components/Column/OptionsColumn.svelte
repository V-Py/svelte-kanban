<script lang="ts">
    import {onMount, getContext, createEventDispatcher} from 'svelte';
    import {fly} from 'svelte/transition';
    import Fa from 'svelte-fa'
    import {faTimes, faEllipsisV, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

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

<div class="options-column brigh">
    {#if bool_show_options}
        <button id="options-column{index_col}" class="button-options" on:click="{removeColumn}">
            <Fa icon={faTrashAlt}/>
        </button>
    {/if}
</div>

<style type="text/scss">
    @import './src/lib/styles/colors';
    .modal-options:not(.show-options){
        display:none;
    }

    .options-column{
        position:absolute;
        left:11rem;
        margin-left:0.5rem;
        top:0.375rem;
    }

    .button-options{
        background:transparent;
        border:transparent;
        color:rgb(55, 65, 81);
        width:1rem;
        height:1rem;
    }

    .button-options:hover{
        cursor:pointer;
        filter:brightness(.9);
    }

</style>