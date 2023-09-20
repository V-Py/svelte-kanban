<script lang="ts">
    import {createEventDispatcher, onMount} from 'svelte';
    import {getBoard, getLang, useCrdt} from '$stores';

    let bool_show_cats_list = false;
    const dispatch = createEventDispatcher();

    const board = getBoard();
    const globalLang = getLang();

    function removeCard(e){
        $board.columns[id_col].cards.splice(id, 1);
        if (!useCrdt) $board = $board;
        dispatch('cardRemove', {col:id_col, card:id});  
    }

    function modifyProp(prop:string){
        const modify = `modify-${prop}-${id}-col-${id_col}`;
        const save = modify.replace('modify', 'save');
        const input = modify.replace('modify', 'input');
        document.getElementById(modify).style.display = 'none';
        document.getElementById(input).style.display = '';
        document.getElementById(input).focus();
        document.getElementById(save).style.display = '';
        dispatch('cardPropModify', {prop, col:id_col, card:id, value:(<HTMLInputElement>document.getElementById(input)).value});  
    }

    function saveProp(prop:string){
        const modify = `modify-${prop}-${id}-col-${id_col}`;
        const save = modify.replace('modify', 'save');
        const input = modify.replace('modify', 'input');
        document.getElementById(modify).style.display = '';
        document.getElementById(input).style.display = 'none';
        document.getElementById(save).style.display = 'none';
        $board.columns[id_col].cards[id][prop] = (<HTMLInputElement>document.getElementById(input)).value;
        dispatch('cardPropSaved', {prop, col:id_col, card:id, value:(<HTMLInputElement>document.getElementById(input)).value});  
    }
 
    function changeCategory(cat_index:number){
        const oldValue = $board.columns[id_col].cards[id].category;
        $board.columns[id_col].cards.category = catsList[cat_index];
        bool_show_cats_list = false;
        dispatch('cardPropSaved', {prop:'category', col:id_col, card:id, oldValue, newValue:catsList[cat_index]}); 
    }

    export let id:number;
    export let id_col:number;
    export let title = $globalLang.getStr('NewCard');
    // export let description = 'empty';
    export let category = {label:'default', bgColor:'gray', color:'white'};
    export let date = '01/01/2021';
    export let catsList;

    function handleKeyUp(event, source:string){
        if(event.keyCode === 13) saveProp(source);
    }

    onMount(()=>{
        document.addEventListener('click', function(e){
            const target = e.target as HTMLElement;
            if(target.classList.contains('card-category')) return;
            if(target.classList.contains('category-button')) return;
            if(target.classList.contains('categories-list')) return;
            bool_show_cats_list = false;
        })
    })
</script>


<div 
    id="card-{id}-col-{id_col}" 
    style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;" 
    class="card draggable" 
    role="button"
    tabindex="0"
    aria-label="Card" 
    aria-roledescription="Card with infos and actions that can be dragged on the different columns" draggable=true on:mousedown>
    <div class="card-part">
        <div style="flex:1; display:flex;justify-content:flex-start; align-items:center;">
            <button class="card-category" style="background:{category.bgColor}; color:{category.color}" on:click={()=>{bool_show_cats_list = !bool_show_cats_list}}>{category.label}</button>
            {#if bool_show_cats_list}
                <div class="categories-list">
                    {#each catsList as cat_temp, cat_index}
                        <button class="category-button" on:click={()=>{changeCategory(cat_index)}}>
                            <div class="category-circle" style="background-color:{cat_temp.bgColor}"></div>
                            {cat_temp.label}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
        <div style="flex:1; display:flex;justify-content:flex-end; align-items:center;">
            <button on:click={removeCard} id="remove-{id}-col-{id_col}" class="card-remove" on:click="{removeCard}">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--la" width="15" height="15" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path d="M7.219 5.781L5.78 7.22L14.563 16L5.78 24.781L7.22 26.22L16 17.437l8.781 8.782l1.438-1.438L17.437 16l8.782-8.781L24.78 5.78L16 14.563z" fill="currentColor"></path></svg>
            </button>
        </div>
    </div>
    <div class="card-part" style="justify-content:center;">
        <button on:click={()=>{modifyProp('title')}} id="modify-title-{id}-col-{id_col}" class="button-title">{title}</button>
        <input on:keypress={(e)=> {handleKeyUp(e, 'title')}} id="input-title-{id}-col-{id_col}" value={title} type="text" style="display:none;" class="input-title">
        <button on:click={()=>{saveProp('title')}} id="save-title-{id}-col-{id_col}" style="display:none;right:1rem; top:0.25rem;" class="save-button" >
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mdi" width="15" height="15" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M15 9H5V5h10m-3 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3a3 3 0 0 1-3 3m5-16H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4z" fill="currentColor"></path></svg>
        </button>
    </div>
    <div class="card-part">
        <button on:click={()=>{modifyProp('date')}} class="button-date" id="modify-date-{id}-col-{id_col}">{date}</button>
        <input on:keypress={(e)=> {handleKeyUp(e, 'date')}} id="input-date-{id}-col-{id_col}" value={date} type="text" style="display:none;" class="input-date">
        <button on:click={()=>{saveProp('date')}} id="save-date-{id}-col-{id_col}" style="display:none;right:4rem;" class="save-button">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mdi" width="15" height="15" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M15 9H5V5h10m-3 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3a3 3 0 0 1-3 3m5-16H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4z" fill="currentColor"></path></svg>
        </button>
    </div>

    <button style="display:none; top:0rem" class="card-arrows" on:click={() => {dispatch('moveCardUp', {col:id_col, card:id})}}>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mdi-light" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M5.843 15.407L11.5 9.75l5.657 5.657l-.707.707l-4.95-4.95l-4.95 4.95l-.707-.707z" fill="currentColor"></path></svg>
    </button>

    <button style="display:none; top:4.75rem;" class="card-arrows" on:click={() => {dispatch('moveCardDown', {col:id_col, card:id})}}>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mdi-light" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M5.843 9.593L11.5 15.25l5.657-5.657l-.707-.707l-4.95 4.95l-4.95-4.95l-.707.707z" fill="currentColor"></path></svg>
    </button>
</div>

<style lang="scss">
	@import '../styles/colors';

    // @import '../../app.css';

    .card{
        background:white;
        display:flex;
        flex-direction: column;
        /* width:12rem; */
        /* height:6rem; */
        width: 11rem;
        height: 5.5rem;
        position: absolute;
        padding:0.5rem;
        margin-left:0.5rem;
        margin-top:0.25rem;
        border:1px solid rgba(0,0,0,0.1);
        border-radius: 0.25rem;
        z-index:inherit;
        overflow:inherit;
    }

    .card-category{
        font-size: 0.75rem;
        line-height: 1rem;
        padding:0.25rem 0.5rem;
        display:block;
        cursor:pointer;
        border-radius:0.375rem;
        float:left;
        border:none;
        cursor:pointer;
    }

    .categories-list{
        position:absolute;
        top:1.75rem;
        left:0px;
        display:flex;
        flex-direction: column;
        border-radius: 0.375rem;
        z-index: 10;
        overflow:hidden;
        background:white;
        box-shadow:0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    }

    .card-remove{
        background:transparent;
        border:transparent;
        float:right;
        width:1.5rem;
        height:1.5rem;
        border-radius: 0.375rem;
        justify-content: center;
        align-items: center;
        display:flex;
    }

    .card-remove:hover{
        cursor:pointer;
        background:rgb(229, 231, 235);
    }

    .save-button{
        font-size: 0.75rem;
        line-height: 1rem;
        position:absolute;
        background-color: transparent;
        width: 1.5rem;
        height:1.5rem;
        display:flex;
        justify-content:center;
        align-items: center;
        border-radius: 0.375rem;
        border:none;
        cursor:pointer;
        color: rgb(75, 85, 99);
    }

    .save-button:hover{
        background:rgba(0,0,0,0.2);
    }

    .input-date, .input-title{
        font-size: 0.65rem;
        line-height: 1.25rem;
        padding: 0.2rem 0.3rem;
        width: 4rem;
        float:left;
        border-radius:0.25rem;
        border:1px;
        appearance: none;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
        color:rgb(55, 65, 81);
        border:none;
        cursor:pointer;
    }
    .input-date:focus, .input-title:focus{
        outline: none;
    }

    .input-title{
        text-align:center;
    }

    .button-title{
        background:transparent;
        font-weight:bold;
        border-radius: 0.375rem;
        padding-left:0.5rem;
        padding-right:0.5rem;
        font-size: 1.125rem;
        line-height: 1.5rem;
        letter-spacing: 0.05em;
        border:none;
        cursor:pointer;
    }

    .button-title:hover, .button-date:hover{
        background-color:rgb(209, 213, 219);;
    }

    .button-date{
        background:transparent;
        font-size: 0.75rem;
        line-height: 1rem;
        float:left;
        border-radius:0.375rem;
        padding-left:0.75rem;
        padding-right:0.75rem;
        color:rgb(107, 114, 128);
        border:none;
        cursor:pointer;
    }

    .category-circle{
        display:inline-block;
        border-radius: 50%;
        width:0.75rem;
        height:0.75rem;
        margin-right:0.25rem;
    }

    .category-button{
        display:flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 0.75rem;
        line-height: 1rem;
        padding:0.5rem;
        background: transparent;
        color:rgb(107, 114, 128);
        border:none;
        cursor:pointer;
    }

    .category-button:hover{
        background: rgba(0,0,0,0.1);
    }

    .draggable{
		cursor:grab;
	}
    
    .card:hover .card-arrows, .card:active .card-arrows{
        display:flex !important;
    }

    .card-part{
        display:flex;
        width:100%;
        position:relative;
    }

    .card-arrows{
        position:absolute;
        left:5rem;
        background:transparent;
        width:1.75rem;
        height:1.75rem;
        display:flex;
        justify-content: center;
        align-items: center;
        /* border-radius: 0.25rem; */
        border-radius: 50%;
        border:none;
        cursor:pointer;
    }
    
    .card-arrows:hover{
        background:rgba(0,0,0,0.1);
        cursor:pointer;
    }

</style>
