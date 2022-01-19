<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<div style="position:relative;">
    <button id="add-column" class="add-column" on:click={() => {dispatch('addColumn', {});}}>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mdi-light" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M5 13v-1h6V6h1v6h6v1h-6v6h-1v-6H5z" fill="currentColor"></path></svg>
        <!-- <svg style="display:inline-block"xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ion" width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path d="M417.4 224H288V94.6c0-16.9-14.3-30.6-32-30.6s-32 13.7-32 30.6V224H94.6C77.7 224 64 238.3 64 256s13.7 32 30.6 32H224v129.4c0 16.9 14.3 30.6 32 30.6s32-13.7 32-30.6V288h129.4c16.9 0 30.6-14.3 30.6-32s-13.7-32-30.6-32z" fill="currentColor"></path></svg> -->
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