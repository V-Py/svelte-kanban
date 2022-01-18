<script lang="ts">
    import {onMount, createEventDispatcher} from 'svelte';
    import Fa from 'svelte-fa'
    import {faPlus } from '@fortawesome/free-solid-svg-icons';

    const dispatch = createEventDispatcher();
</script>

<div style="position:relative;">
    <button id="add-column" class="add-column" on:click={() => {dispatch('addColumn', {});}}>
        <Fa icon={faPlus}/>
    </button>
</div>

<style type="text/scss">
	@import './src/lib/styles/colors';

    .add-column{
        position:absolute;
        left:0.75rem;
        top:2rem;
        border:1px;
        display:block;
        background-color:rgba(255,255,255,0.5);
        border-color: rgb(107, 114, 128);
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