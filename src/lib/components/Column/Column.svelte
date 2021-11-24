<script lang="ts">
    import {onMount, getContext, createEventDispatcher} from 'svelte';
    import {number_of_slots} from '../../../stores/store.js';
    import {fly} from 'svelte/transition';
    import Card from '../Card.svelte';
    import OptionsColumn from'./OptionsColumn.svelte';

    let bool_show_options = true;

    export let title;
    export let cards;
    export let index_col;
    export let number_slots;
    export let slots;
    export let show_fake_slot;

    const dispatch = createEventDispatcher();

    function handleMouseDown(e){
        dispatch('cardMouseDown', {event:e, elem:this});  
    };

    function modifyColumnHandler(){
        bool_show_options = false;
    }

    function saveColumn(){
        bool_show_options = true;
        // console.log('SAVE COLUMN');
        // const id_options    = this.id.replace('save', 'options');
        // const id_container  = this.id.replace('save', 'container');
        // const id_title      = this.id.replace('save', 'title');

        // console.log('ID', id_options, id_container, id_title);
        // document.getElementById(id_container).style.display = 'none';
        // document.getElementById(id_options).style.display = '';
        // document.getElementById(id_title).style.display = '';
    }

</script>

<div class="column" in:fly="{{y:-200, duration:500}}" out:fly="{{y:200, duration:500}}">
    <div class="title">
        {#if bool_show_options}
        <span id="title-column{index_col}">{title.toUpperCase()}</span>
        {:else}
        <div id="container-column{index_col}">
            <input type="text" id="input-colum{index_col}" class="column-title" value={title} />
            <button id="save-column{index_col} "class="save-column" on:click={saveColumn}>
                <!-- <i class="fas fa-save"></i> -->
                save
            </button>
        </div>
        {/if}
        <OptionsColumn
            on:removeColumn
            on:modifyColumn={modifyColumnHandler}
            {index_col}
            {bool_show_options}
        />
    </div>
    <div class="content">
        {#if show_fake_slot}
            <div class="slot animate" style="background:transparent;"></div>
        {/if}
        {#each slots as slot, index}
            <div class="slot {slot.animate == true ? 'animate' : ''}" transition:fly="{{y:-200, duration:500}}">
                {#if slot.empty == false}
                    <Card
                        id={index}
                        id_col={index_col}
                        on:mousedown="{handleMouseDown}"
                        title={slot.title}
                        description="desc"
                        color="orange"
                        on:removeCard
                    />
                {/if}
            </div>
        {/each}
    </div>
</div>

<style type="text/scss">
    @import './src/styles/colors';

    .column-title{
        text-align:center;
        padding:5px;
        width:50%;
    }

    .save-column{
        background:transparent;
        border:transparent;
        color:darkslategray;
        height:30px;
        width:30px;
        border-radius:50%;
        position:absolute;
        top:0px;
        left:180px;
    }

    .save-column:hover{
        cursor:pointer;
        background:rgba(0,0,0,0.1);
    }

    .column{
		width:210px;
		min-width:210px;
		max-width:210px;
		height:100%;
		border: 2px solid transparent;
		background-color:#F4F4F4;
		margin: 5px 10px;
		display:flex;
		flex-direction:column;
        border-radius:0.25rem;
	}

	.column > .title{
		// flex:1;
        height:85px;
        min-height:85px;
        max-height:85px;
		color:$COLUMN_TITLE_COLOR;
		letter-spacing:1px;
		font-weight:bold;
		font-size:16px;
		display:flex;
		justify-content: center;
		align-items: center;
        position:relative;
	}

	.column > .content{
		height:100%;
		display:flex;
		flex-direction:column;
		justify-content: start;
		align-items:center;
	}

	// .column > .content > .slot:not(.hide){
	.column > .content > .slot{
		margin:5px;
		display:flex;
        background:transparent;
        z-index:1;
		position:relative;
		width:100%;
		height:120px;
	}

    .slot.animate{
        animation: growingSlot .3s ease-out forwards;
    }

    @keyframes growingSlot{
        from{
            height:0px;
        }
        to{
            height:120px;
        }
    }
</style>
