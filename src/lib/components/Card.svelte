<script>
    import {fade, fly} from 'svelte/transition';
    import {onMount, getContext, createEventDispatcher} from 'svelte';
    // import {card_width, card_height} from '../../stores/store.js';
    
    const dispatch = createEventDispatcher();

    onMount(() => {
        const id_card = "card-"+id+"-col-"+id_col;
        document.getElementById(id_card).addEventListener('touchstart', function(e){
            console.log('TOUCH', e);
        })
    })

    function removeCard(e){
        const array_temp = this.id.split('remove-');
        const array_bis = array_temp[1].split("-col-");
        const index_card = array_bis[0];
        const index_col = array_bis[1];

        // console.log('CARD', id_card, 'COL', id_col);
        dispatch('removeCard', {card:index_card, col:index_col});  
    }

    export let title;
    export let color;
    export let description;
    export let id;
    export let id_col;

</script>
<!-- in:fly="{{ y: -200, duration: 500 }}" -->
    <div id="card-{id}-col-{id_col}"  class="card draggable" draggable=true on:mousedown>
        <div class="top-part">
            <div class="status" style="background:{color}">statut</div>
            <button id="remove-{id}-col-{id_col}" class="remove" on:click="{removeCard}"><i class="fas fa-ellipsis-h"></i></button>
        </div>
        <div class="middle-part">
            <div class="title">{title}</div>
        </div>
        <div class="bot-part">
            <div class="date">09/12/2021</div>
        </div>
    </div>

<style type="text/scss">
	@import './src/styles/colors';

    .card{
        background:white;
        display:flex;
        flex-direction:column;
        max-width:180px;
        width:180px;
        height:100px;
        max-height:100px;
        padding:10px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        position:absolute;
        margin-left:5px;
        margin-top:5px;
        border:1px solid rgba(0,0,0,0.125);
        border-radius:0.25rem;
        z-index:2;
    }

    .draggable{
		cursor:grab;
	}

    .status{
        font-size: 12px;
        padding: 3px 7px;
        display: block;
        cursor: pointer;
        color: white;
        border-radius: 50px;
        float:left;
    }

    .top-part, .middle-part, .bot-part{
        flex:1;
        width:100%;
    }

    .middle-part{
        justify-content: center;
    }

    .title{
        font-size:18px;
        font-weight:bold;
        letter-spacing:1px;
    }

    .date{
        font-size:10px;
        color:gray;
        float:left;
    }

    .remove{
        background:transparent;
        border:transparent;
        float:right;
    }

    .remove:hover{
        cursor:pointer;
        filter:brightness(0.8);
    }
</style>
