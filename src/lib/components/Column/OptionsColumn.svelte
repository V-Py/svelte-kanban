<script lang="ts">
    import {onMount, getContext, createEventDispatcher} from 'svelte';
    import {fly} from 'svelte/transition';

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
        console.log('THIS', );
    }

    function modifyColumn(){
        console.log('MODIFY COLUMN');
        bool_show_modal = !bool_show_modal;
        this.parentNode.classList.remove('show-options');
        dispatch('modifyColumn', {});

        // const id_options    = this.id.replace('modify', 'options');
        // const id_container  = this.id.replace('modify', 'container');
        // const id_title      = this.id.replace('modify', 'title');

        // console.log('ID', id_options, id_container);
        // document.getElementById(id_options).style.display = 'none';
        // document.getElementById(id_title).style.display = 'none';
        // document.getElementById(id_container).style.display = '';

    }

    function removeColumn(){
        bool_show_modal = !bool_show_modal;
        this.parentNode.classList.remove('show-options');
        dispatch('removeColumn', {index_col:index_col});
    }
</script>

<div class="options-container">
    {#if bool_show_options}
        <button id="options-column{index_col}" class="options" on:click="{showOptionsColumn}">
            <!-- <i class="fas fa-ellipsis-v"> -->
            |
        </button>
        <div class="modal-options">
            <button id="modify-column{index_col}" class="action modify" on:click={modifyColumn}><i class="fas fa-pen custom-fa"></i>Modifier</button>
            <button id="delete-column{index_col}" class="action remove" on:click={removeColumn}><i class="fas fa-trash-alt custom-fa"></i>Supprimer</button>
        </div>
    {/if}
</div>

<style type="text/scss">
    @import './src/styles/colors';
    
    .options-container{
        position:absolute;
        left:185px;
        top:5px;
    }

    .modal-options{
        position:absolute;
        width:120px;
        max-width:120px;
        height:80px;
        max-height:80px;
        background-color:white;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border-radius:5px;
        top:20px;
        z-index:4;
        display:flex;
        flex-direction:column;
        font-weight:400;
        font-size:14px;
        justify-content:space-around;
    }

    .modal-options:not(.show-options){
        display:none;
    }
    
    .modal-options > .action{
        line-height:32px;
        height:32px;
        display:flex;
        justify-content: start;
        align-items: center;
        color:darkslategray;
        // border-radius:5px;
        letter-spacing: 0px;
        background:transparent;
        border:transparent;
    }

    .modal-options > .action:hover{
        cursor:pointer;
        background-color: rgba(0,0,0,0.1);
    }

    .options{
        background:transparent;
        color:#444;
        border-color:transparent;
        width:15px;
        height:15px;
    }

    .options:hover{
        cursor:pointer;
        filter:brightness(0.9);
    }


</style>