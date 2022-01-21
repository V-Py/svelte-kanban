<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<div style="position:relative;">
    <button id="add-column" class="add-column" on:click={() => {dispatch('addColumn', {});}}>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mdi-light" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M5 13v-1h6V6h1v6h6v1h-6v6h-1v-6H5z" fill="currentColor"></path></svg>
    </button>
</div>

<style type="text/scss">
	@import './src/lib/styles/colors';

    .add-column{
        position:absolute;
        left:0.75rem;
        top:2rem;
        display:block;
        background-color:rgba(255,255,255,0.5);
        // border-color: rgb(107, 114, 128);
        border:1px solid darkgray;

        width:3rem;
        height:3rem;
        border-radius: 50%;
        display:flex;
        justify-content: center;
        align-items: center;
        cursor:pointer;
    }

    .add-column:hover{
        filter:brightness(0.75);
    }

    .add-column:active{
        filter:brightness(0.5);
    }
</style>