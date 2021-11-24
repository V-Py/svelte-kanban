<script lang="ts">
    import {onMount, createEventDispatcher} from 'svelte';
    // import { library } from '@fortawesome/fontawesome-svg-core';
    // import { faSmileWink as fasSmileWink } from '@fortawesome/free-solid-svg-icons';
    // import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from 'fontawesome-svelte';
    // library.add(faSmileWink);

    const dispatch = createEventDispatcher();
    function addColumn(){
        dispatch('addColumn', {});  
    }

</script>

<div style="position:relative">
    <button id="add-column" on:click={addColumn}>
        +
        <!-- <i class="fas fa-plus"></i> -->
        <!-- <FontAwesomeIcon icon={['fas', 'smile-wink']} /> -->
    </button>
</div>

<style type="text/scss">
	@import './src/styles/colors';
    
    #add-column{
        position:absolute;
        left:10px; 
        top:30px;
        border:1px solid gray;
        background:rgba(255,255,255,0.5);
        display:block;
        min-width:50px;
        min-height:50px;
        border-radius:50%;
    }

    #add-column:hover{
        cursor:pointer;
        filter:brightness(0.8);
    }

    #add-column:active{
        cursor:pointer;
        filter:brightness(0.5);
    }
</style>