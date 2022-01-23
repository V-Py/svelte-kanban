<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";
	import Column from './components/Column/Column.svelte';
	import AddColumnBtn from '$lib/components/AddColumnBtn.svelte';
	import {card_height, card_width, main_width, main_height, columns, globalLang} from "$lib/stores/store";
	import {Lang} from '$lib/class/Lang';
	// import {card_height, card_width, main_width, main_height, columns} from "$stores/store";

	const HEIGHT_CARD_CONTAINER = 120;
	const STARTING_POINT_TOP = 98;
	// const HEIGHT_CARD = 96;
	const HEIGHT_CARD = 105;
	const REAL_STARTING_POINT_TOP = STARTING_POINT_TOP + HEIGHT_CARD/2; // Le premier point de référence est le milieu de la première card (s'il y'en a une)

	// Properties of the Kanban
	export let theme 			= 'light';
	export let primary 			= 'empty';
	export let secondary 		= 'empty';
	export let third 			= 'empty';
	export let fontPrimary 		= 'empty';
	export let fontSecondary 	= 'empty';
	export let lang 			= 'en';
	export let minimalist 		= false;
	export let maxColumns 		= 5;
	const tempLang = new Lang(lang);
	export let colsList = [tempLang.getStr('Todo'),tempLang.getStr('Done')];
	export let categories_list = [{
            label:tempLang.getStr('new'),
			color:'white',
            bgColor:"#0A99FF"
        },{   
            label:tempLang.getStr('important'),
			color:'white',
            bgColor:"#EA0B38"
        },{
            label:tempLang.getStr('task'),
			color:'black',
            bgColor:"#00F5DC"
        },{
            label:tempLang.getStr('personal'),
			color:'white',
            bgColor:"#629387"
        },{
            label:tempLang.getStr('work'),
			color:'black',
            bgColor:"#13F644"
	}];

	// Local property (ie used to track dragNdrop of the cards)
	let elem_dragged;
	let cOffX_new = 0;
	let cOffY_new = 0;
	let cOffX     = 0;
	let cOffY     = 0;
	let rect_new_card;
	let rect_card;
	let card_top_coord = {x:0, y:0};

	// Infos of the card being dragged
	let dragged_card_infos = {col:-1, index:-1, infos:{}};
	let tracking_last_empty_card = {col:-1, index:-1};

    const dispatch = createEventDispatcher();

	colsList.forEach(function(column, index){
		$columns[index] = {
			title:column,
			coordinates: {x_start:0, x_end:0, y_start:0, y_end:0},
			rect:{},
			cards:[],
			slots:[],
		}
	})

	function newCardDragStart(e) {
		e = e || window.event;
		e.preventDefault();
		elem_dragged = this;

		cOffX_new = e.clientX - this.offsetLeft;
		cOffY_new = e.clientY - this.offsetTop;
		rect_new_card = this.getBoundingClientRect();

		document.addEventListener('mousemove', newCardDragMove);
		document.addEventListener('mouseup', newCardDragEnd);
	};

	function newCardDragMove(e) {
		e = e || window.event;
		e.preventDefault();

		const x_live = (e.clientX - cOffX_new);
		const y_live = (e.clientY - cOffY_new);
		const x_test = rect_new_card.left + x_live;
		const y_test = rect_new_card.top + y_live;

		elem_dragged.style.top = y_live.toString() + 'px';
		elem_dragged.style.left = x_live.toString() + 'px';

		for(let i=0; i<columns.length;i++){
			if((x_test >= $columns[i].rect.left) && (x_test <= $columns[i].rect.right) && (y_test >= $columns[i].rect.top) && (y_test <= $columns[i].rect.bottom)){
				if($columns[i].slot_added != true){
					$columns[i].slot_added = true;
				}
			}else{
				if($columns[i].slot_added == true){
					$columns[i].slot_added = false;
				}
			}
		}
	};

	function newCardDragEnd(e) {
		e = e || window.event;
		e.preventDefault();
		
		const x_end = rect_new_card.left + (e.clientX - cOffX_new);
		const y_end = rect_new_card.top + (e.clientY - cOffY_new);

		document.removeEventListener('mousemove', newCardDragMove);
		document.removeEventListener('mouseup', newCardDragEnd);

		if(!elem_dragged.classList.contains('card')){
			elem_dragged.style.removeProperty('top');
			elem_dragged.style.removeProperty('left');
		}

		for(let i=0; i<$columns.length;i++){
			if((x_end >= $columns[i].rect.left) && (x_end <= $columns[i].rect.right) && (y_end >= $columns[i].rect.top) && (y_end <= $columns[i].rect.bottom)){
				const card_temp = {empty:false, title:"New card"};
				const slots_temp = $columns[i].slots;
				// slots_temp.shift();
				$columns[i].slot_added = false;
				slots_temp.unshift(card_temp)
				$columns[i].slots = [...slots_temp];
			}
		}
	};

	function cardDragStart(event){	
        dispatch('cardDragStart', {card:event.detail.card, col:event.detail.col, event:event.detail.event});  
		let e = event.detail.event;
		e = e || window.event;
		e.preventDefault();

		// Storing infos of the card dragged (coordinates, rectangle)
		dragged_card_infos.col = event.detail.col;
		dragged_card_infos.index = event.detail.card;
		dragged_card_infos.infos = $columns[dragged_card_infos.col][dragged_card_infos.index];

		elem_dragged = document.getElementById(`card-${dragged_card_infos.index}-col-${dragged_card_infos.col}`);
		cOffX = e.clientX - elem_dragged.offsetLeft;
		cOffY = e.clientY - elem_dragged.offsetTop;
		rect_card = elem_dragged.getBoundingClientRect();



		// Stocker la position du milieu top de la card au départ
		card_top_coord.x = (rect_card.right + rect_card.left)/2;
		card_top_coord.y = rect_card.top;

		// by default the first empty card should take the place of the card dragged
		// const columns_work = [... $columns];
		// columns_work[dragged_card_infos.col].slots.splice(dragged_card_infos.index, 0, {empty:true});
		// tracking_last_empty_card.col = dragged_card_infos.col;
		// tracking_last_empty_card.index = dragged_card_infos.index;

		// $columns = [... columns_work];
		
		document.addEventListener('mousemove', cardDragMove);
		document.addEventListener('mouseup', cardDragEnd);
	}

	function cardDragMove(e) {
        dispatch('cardDragMove', {card:dragged_card_infos.index, col:dragged_card_infos.col, event:e});  
		// 'cardDragStart', {card:event.detail.card, col:event.detail.col, event:event.detail.event});

		e = e || window.event;
		e.preventDefault();

		// Position live par rapport au click de départ
		const x_live = (e.clientX - cOffX); 
		const y_live = (e.clientY - cOffY);
		elem_dragged.style.top = y_live.toString() + 'px';
		elem_dragged.style.left = x_live.toString() + 'px';

		const x_card_top = card_top_coord.x + x_live; // card_top_coord.y (98) + e.clientY (100) - c0ffY (100)
		const y_card_top = card_top_coord.y + y_live;

		for(let i=0; i<$columns.length;i++){

			if((x_card_top >= $columns[i].rect.left) && (x_card_top <= $columns[i].rect.right) && (y_card_top >= $columns[i].rect.top) && (y_card_top <= $columns[i].rect.bottom)){
				let bool_position_order_found = false; // Boolean signaling we found the order position of the card in the column (ie)
				let position_order = 0; // Position order of the card in the column
				let j = 1; // variable to increment to navigate between the cards of the column

				// If at least one card is present in the column
				if($columns[i].slots.length > 0){
					// 1- checking if the point is between the first card
					if(y_card_top < REAL_STARTING_POINT_TOP) bool_position_order_found = true; // Position will stay at 0
					// 2- Searching the position order of the card between the cards of the column
					while(bool_position_order_found == false && j <= $columns[i].slots.length){
						if(y_card_top <= (REAL_STARTING_POINT_TOP + j*HEIGHT_CARD_CONTAINER)){
							bool_position_order_found = true;
							position_order = j;
							break;
						}
						j++;
					}

					// 3- If the boolean still at false => the card will be in last position
					if(!bool_position_order_found) position_order = $columns[i].slots.length;
				}

				// checking if the last empty slot is the same as the one found now (ie, we don't need to do anything) 
				// if((tracking_last_empty_card.col == i && tracking_last_empty_card.index == position_order) || rect_card.) return;
				if(tracking_last_empty_card.col == i && tracking_last_empty_card.index == position_order) return;
				if(i == dragged_card_infos.col) return;

				// Copying columns
				const columns_work = [... $columns];

				// if the last empty is not empty and not the same as the one we are going to add, we need to delete it
				if(tracking_last_empty_card.col != -1) columns_work[tracking_last_empty_card.col].slots.splice(tracking_last_empty_card.index, 1)

				// Adding empty slot to the right column at the right position
				let bool_add_empty = true;
				for(let j=0; j<columns_work[i].slots.length; j++){
					if(columns_work[i].slots[j].empty == true) bool_add_empty = false;
				}

				if(bool_add_empty) columns_work[i].slots.splice(position_order, 0, {empty:true});
				tracking_last_empty_card = {col:i, index:position_order};// updating the last empty
				$columns = [... columns_work];
			}
		}
	};

	function cardDragEnd(e){
        dispatch('cardDragEnd', {card:dragged_card_infos.index, col:dragged_card_infos.col, event:e});  
		let bool_drag_success = false;
		e = e || window.event;
		e.preventDefault();
		// Removing event listeners
		document.removeEventListener('mousemove', cardDragMove);
		document.removeEventListener('mouseup', cardDragEnd);
		const x_card_top 		= card_top_coord.x + (e.clientX - cOffX);
		const y_card_top	 	= card_top_coord.y + (e.clientY - cOffY);
		let newCol;
		let newPos;

		for(let i=0; i<$columns.length;i++){
			if((x_card_top >= $columns[i].rect.left) && (x_card_top <= $columns[i].rect.right) && (y_card_top >= $columns[i].rect.top) && (y_card_top <= $columns[i].rect.bottom)){
				let bool_position_order_found = false; // Boolean signaling we found the order position of the card in the column (ie)
				let position_order = 0; // Position order of the card in the column
				let j = 1; // variable to increment to navigate between the cards of the column

				// If at least one card is present in the column
				if($columns[i].slots.length > 0){
					// 1- checking if the point is between the first card
					if(y_card_top < REAL_STARTING_POINT_TOP) bool_position_order_found = true; // Position will stay at 0
					// 2- Searching the position order of the card between the cards of the column
					while(bool_position_order_found == false && j <= $columns[i].slots.length){
						if(y_card_top <= (REAL_STARTING_POINT_TOP + j*HEIGHT_CARD_CONTAINER)){
							bool_position_order_found = true;
							position_order = j;
							break;
						}
						j++;
					}

					// 3- If the boolean still at false => the card will be in last position
					if(!bool_position_order_found) position_order = $columns[i].slots.length;
				}


				const card_temp = $columns[dragged_card_infos.col].slots[dragged_card_infos.index];

				// Copying columns
				const columns_work = [... $columns];

				// Removing card from column dragged from
				columns_work[dragged_card_infos.col].slots.splice(dragged_card_infos.index, 1);

				if(tracking_last_empty_card.col != -1){ // deleting all the empty cards of the column
					columns_work[tracking_last_empty_card.col].slots.splice(tracking_last_empty_card.index, 1); // if empty card exist, delete it
				} 
				tracking_last_empty_card = {col:-1, index:-1}; // no more empty card to track => reinitialize
		
				// Adding card to column dragged on at the right position
				
				columns_work[i].slots.splice(position_order, 0, card_temp);
				$columns = [... columns_work];
				newCol = i;
				newPos = position_order;
				bool_drag_success = true;
			}
		}

		const action_dispatch = (bool_drag_success ? 'cardDragSuccess' : 'cardDragFailed');
		let propsDispatch = (bool_drag_success ? {old_col:dragged_card_infos.col, old_pos:dragged_card_infos.index, new_col:newCol, new_pos:newPos} : {col:dragged_card_infos.col, pos:dragged_card_infos.index});
		dispatch(action_dispatch, propsDispatch);  

		elem_dragged.style.removeProperty('top');
		elem_dragged.style.removeProperty('left');
	}

	function addCard(col_index:number, card_index:number=0){
		const card_temp = {empty:false, animate:false, title:"New card", description:"test", category:categories_list[0], date:"02/02/2022"};
		const columns_work = [... $columns];
		columns_work[col_index].slots.unshift(card_temp);
		$columns = [... columns_work];
        dispatch('cardAdd', {col:col_index});  
	}

	function removeColumn(event){
		const columns_temp = [... $columns];
		const name = columns_temp[event.detail.index_col];
		columns_temp.splice(event.detail.index_col, 1);
		$columns = [... columns_temp];
        dispatch('columnRemove', {position:event.detail.index_col, name});  
	}

	function addColumn(){
		const col_temp = {
			title:'New column',
			coordinates: {x_start:0, x_end:0, y_start:0, y_end:0},
			rect:{},
			cards:[],
			slots:[]
		}

		const posAdd = $columns.length;
		$columns = [... $columns, col_temp];

		setTimeout(function(){
			const col_index = $columns.length - 1 ;
			$columns[col_index].rect = document.getElementsByClassName('column')[col_index].getBoundingClientRect();
		}, 200);

        dispatch('columnAdd', {position:posAdd});  	
	}

	function moveCardUp(event){
		if(event.detail.card == 0 )return;
		const card = $columns[event.detail.col].slots[event.detail.card]
		
		const columns_work = [...$columns];
		columns_work[event.detail.col].slots.splice(event.detail.card, 1);
		columns_work[event.detail.col].slots.splice((event.detail.card-1), 0, card);
		columns.set(columns_work);
        dispatch('moveCardUp', {col:event.detail.col, old_pos:event.detail.card, new_pos:event.detail.card-1});  	
	}

	function moveCardDown(event){
		const numEvents = ($columns[event.detail.col].slots.length -1);
		if(event.detail.card == numEvents) return;
	
		const card = $columns[event.detail.col].slots[event.detail.card]
		const columns_work = [...$columns];
		columns_work[event.detail.col].slots.splice(event.detail.card, 1);
		columns_work[event.detail.col].slots.splice((event.detail.card+1), 0, card);
		columns.set(columns_work);
        dispatch('moveCardDown', {col:event.detail.col, old_pos:event.detail.card, new_pos:event.detail.card+1});  	
	}

	function handleResize(entries){
		const columns_temp = document.getElementsByClassName('column');
		for(let i=0; i<columns_temp.length; i++){
			const rect_col  =  columns_temp[i].getBoundingClientRect();
			$columns[i].rect = rect_col;
		}
	}


	onMount(() => {
		if(lang) globalLang.set(new Lang(lang)); //
		// we only need to observe the first column since all the columns have the same size atm
		let resizer = new ResizeObserver(handleResize)
		resizer.observe(document.getElementsByClassName('column')[0])
	})
</script>

<main style='width:{$main_width ? $main_width : "100%"};height:{$main_height ? $main_height : "100%"}' class="">
	<div class="layout">
		<div class="kanban-container">
			{#each $columns as column, index_col}
				<Column
					{categories_list}
					cards={column.cards}
					slots={column.slots}
					title={column.title}
					{index_col}

					on:cardMouseDown={cardDragStart}
					on:removeColumn={removeColumn}
					on:addCard={(e) => {addCard(e.detail.index, 0)}}
					on:cardPropSaved
					on:cardPropModify
					on:cardRemove
					on:moveCardUp={moveCardUp}
					on:moveCardDown={moveCardDown}	
				/>
			{/each}

			<AddColumnBtn
				on:addColumn={addColumn}
			/>

			<!-- <div class=circle>
				<div class='horizontal-plus'></div>
				<div class='vertical-plus'></div>
			</div> -->
		</div>
		<div class="footer"></div>
	</div>
</main>



<style type="text/scss">
	@import './src/lib/styles/colors';
	main {
		background:$MAIN_BG;
		text-align:center;
		padding:1rem;
		font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
	}

	.layout{
		display:flex;
		width:100%;
		height:100%;
		flex-direction: column;
		// border: 2px rgb(107, 114, 128) dashed;
	}
	.header{
		background:$HEADER_BG;
		height:150px;
		display:flex;
		justify-content: center;
		width:100%;
	}
	.footer{
		background:$FOOTER_BG;
		height:75px;
		margin-top:0.625rem;
	}
	.kanban-container{
		background:$HEADER_BG;
		display:flex;
		flex:1;
		width:100%;
		justify-content: flex-start;
	}

	.circle {
		border-radius: 50%;
		width: 100px;
		height: 100px;
		background-color: #f92a71;
		opacity: 0.8;
		background-size: 40px 40px;
		background-image: repeating-linear-gradient(45deg, #000000 0, #000000 4px, #f92a71 0, #f92a71 50%);
		margin-left:100px;
		border:2px solid black;
	}

	.horizontal-plus {
		position: relative;
		background-color: #83ec47;
		width: 75%;
		height: 25%;
		left: 12.5%;
		top: 37.5%;
		// border:2px solid black;
	}
	.vertical-plus {
		position: relative;
		background-color: #83ec47;
		width: 25%;
		height: 75%;
		left: 37.5%;
		top: -12.5%;
		// border:2px solid black;
	}
</style>