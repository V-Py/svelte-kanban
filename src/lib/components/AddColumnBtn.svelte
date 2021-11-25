<script lang="ts">
    import {onMount, createEventDispatcher} from 'svelte';
    import Fa from 'svelte-fa'
    import {faPlus } from '@fortawesome/free-solid-svg-icons';

    const dispatch = createEventDispatcher();
    function addColumn(){
        dispatch('addColumn', {});  
    }

</script>

<div style="position:relative">
    <button id="add-column" class="absolute left-3 top-8 border-1 border-gray-500 block bg-white bg-opacity-50 w-12 h-12 rounded-full flex justify-center items-center hover:brightness-75 active:brightness-50 cursor-pointer" on:click={addColumn}>
        <Fa icon={faPlus}/>
    </button>
</div>

<style type="text/scss">
	@import './src/styles/colors';
</style>