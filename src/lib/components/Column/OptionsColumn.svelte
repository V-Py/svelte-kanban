<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    export let index_col;
    export let bool_show_options;
    export let fontPrimary;
    let bool_show_modal = false;

    function removeColumn(){
        bool_show_modal = !bool_show_modal;
        this.parentNode.classList.remove('show-options');
        dispatch('removeColumn', {index_col:index_col});
    }

</script>

<div class="options-column">
    {#if bool_show_options}
        <button id="options-column{index_col}" class="button-options" on:click="{removeColumn}" style:color="{fontPrimary}">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ion" width="20" height="20" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path d="M296 64h-80a7.91 7.91 0 0 0-8 8v24h96V72a7.91 7.91 0 0 0-8-8z" fill="none"></path><path d="M432 96h-96V72a40 40 0 0 0-40-40h-80a40 40 0 0 0-40 40v24H80a16 16 0 0 0 0 32h17l19 304.92c1.42 26.85 22 47.08 48 47.08h184c26.13 0 46.3-19.78 48-47l19-305h17a16 16 0 0 0 0-32zM192.57 416H192a16 16 0 0 1-16-15.43l-8-224a16 16 0 1 1 32-1.14l8 224A16 16 0 0 1 192.57 416zM272 400a16 16 0 0 1-32 0V176a16 16 0 0 1 32 0zm32-304h-96V72a7.91 7.91 0 0 1 8-8h80a7.91 7.91 0 0 1 8 8zm32 304.57A16 16 0 0 1 320 416h-.58A16 16 0 0 1 304 399.43l8-224a16 16 0 1 1 32 1.14z" fill="currentColor"></path></svg>
        </button>
    {:else}
        <button id="save-column{index_col} "class="button-options" on:click={()=>{dispatch('saveColumn', {index_col:index_col})}} style:color="{fontPrimary}">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mdi" width="20" height="20" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M15 9H5V5h10m-3 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3a3 3 0 0 1-3 3m5-16H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4z" fill="currentColor"></path></svg>
        </button>
    {/if}
</div>

<style lang="scss">
    @import '../../styles/colors';

    .button-options{
        background:transparent;
        border:transparent;
        color:rgb(55, 65, 81);
        width:1rem;
        height:1rem;
        transform:rotate(0deg);
        cursor:pointer;
        position:absolute;
        top:0.375rem;
        right:1rem;
    }

    .button-options:hover{
        cursor:pointer;
        filter:brightness(.9);
        transform:rotate(-15deg);
    }

</style>