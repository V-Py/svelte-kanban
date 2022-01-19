<script lang="ts">
    import {onMount, createEventDispatcher} from 'svelte';
    import Fa from 'svelte-fa'
    import {faPlus } from '@fortawesome/free-solid-svg-icons';

    const dispatch = createEventDispatcher();
</script>

<div style="position:relative;">
    <button id="add-column" class="add-column" on:click={() => {dispatch('addColumn', {});}}>
        <Fa icon={faPlus} class="test" size="lg"/>
    </button>
</div>

<style type="text/scss">
	@import './src/lib/styles/colors';

    .add-column{
        position:absolute;
        left:0.75rem;
        top:2rem;
        display:block;
        width:3rem;
        height:3rem;
        border-radius: 50%;
        display:flex;
        justify-content: center;
        align-items: center;
        cursor:pointer;
        border:3px solid black;
        background-color: #f92a71;
        opacity: 0.9;
        // background: repeating-linear-gradient( 45deg, #0d0f31, #0d0f31 3.5px, #f92a71 3.5px, #f92a71 17.5px );
    }

    .add-column:hover{
        filter:brightness(0.75);
    }

    .add-column:active{
        filter:brightness(0.5);
    }
</style>