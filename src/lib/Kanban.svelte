<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";
	import { element } from "svelte/internal";
	import {fade} from "svelte/transition";
	import NewCard from "./components/NewCard.svelte";
    import Card from './components/Card.svelte';
	import Column from './components/Column/Column.svelte';
	import AddColumnBtn from '$lib/components/AddColumnBtn.svelte';
	import {card_height, card_width, main_width, main_height, columns} from "$lib/stores/store";
	// import {card_height, card_width, main_width, main_height, columns} from "$stores/store";

	const HEIGHT_CARD_CONTAINER = 120;
	const STARTING_POINT_TOP = 98;
	const HEIGHT_CARD = 96;
	const REAL_STARTING_POINT_TOP = STARTING_POINT_TOP + HEIGHT_CARD/2; // Le premier point de référence est le milieu de la première card (s'il y'en a une)
	// Properties of the Kanban
	export let cols_list = [{
            label:"Todo",
            value:"todo"
        },{
            label:"Done",
            value:"done"
    }];
	export let categories_list = [{
            label:"new",
			color:'white',
            bgColor:"#0A99FF"
        },{   
            label:"important",
			color:'white',
            bgColor:"#EA0B38"
        },{
            label:"task",
			color:'black',
            bgColor:"#00F5DC"
        },{
            label:"personal",
			color:'white',
            bgColor:"#629387"
        },{
            label:"work",
			color:'black',
            bgColor:"#13F644"
	}];
	export let dragNew;

	// TODO
	export let theme 			= 'light';
	export let primary 			= 'empty';
	export let secondary 		= 'empty';
	export let third 			= 'empty';
	export let fontPrimary 		= 'empty';
	export let fontSecondary 	= 'empty';
	export let lang 			= 'fr';
	export let minimalist 		= false;
	export let maxColumns 		= 5;

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

	cols_list.forEach(function(column, index){
		$columns[index] = {
			title:column.label,
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
		console.log('START', event);
        dispatch('cardDragStart', {});  
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
        dispatch('cardDragMove', {});  

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

				// TODO : case to exclude = same column as starting card
				// checking if the last empty slot is the same as the one found now (ie, we don't need to do anything) 
				// if((tracking_last_empty_card.col == i && tracking_last_empty_card.index == position_order) || rect_card.) return;
				if(tracking_last_empty_card.col == i && tracking_last_empty_card.index == position_order){
					console.log('WE RETURN BECAUSE WE MOVED ON THE SAME COLUMN AT THE SAME POSITION');
					return;
				}
				else if (i == dragged_card_infos.col){
					console.log('WE RETURN BECAUSE WE MOVED ON THE ORIGIN COLUMN OF THE DRAGGED CARD');
					return;
				}

				// Copying columns
				const columns_work = [... $columns];

				// if the last empty is not empty and not the same as the one we are going to add, we need to delete it
				console.log('PARAMETERS', `i [${i}] - col_origin [${dragged_card_infos.col}] - pos_order [${position_order}] - COL [${tracking_last_empty_card.col}] - POS [${tracking_last_empty_card.index}] -`)

				if(tracking_last_empty_card.col != -1){
					console.log(`WE DELETE THE EMPTY CARD AT [${tracking_last_empty_card.col}, ${tracking_last_empty_card.index}]`);
					columns_work[tracking_last_empty_card.col].slots.splice(tracking_last_empty_card.index, 1)
				}

				// Adding empty slot to the right column at the right position
				let bool_add_empty = true;
				console.log('CHECKING IF COL EMPTY TO ADD EMPTY CARD', JSON.stringify(columns_work[i]));
				for(let j=0; j<columns_work[i].slots.length; j++){
					if(columns_work[i].slots[j].empty == true){
						console.log('WE FOUND ONE EMPTY CARD ALREADY EXISTING');
						bool_add_empty = false;
					}
				}


				console.log(`WE ADD EMPTY CARD AT [${i}, ${position_order}]`);
				if(bool_add_empty) columns_work[i].slots.splice(position_order, 0, {empty:true});

				tracking_last_empty_card = {col:i, index:position_order};// updating the last empty

				$columns = [... columns_work];
			}
		}
	};

	function cardDragEnd(e){
        dispatch('cardDragEnd', {});  
		let bool_drag_success = false;
		e = e || window.event;
		e.preventDefault();
		// Removing event listeners
		document.removeEventListener('mousemove', cardDragMove);
		document.removeEventListener('mouseup', cardDragEnd);
		const x_card_top 		= card_top_coord.x + (e.clientX - cOffX);
		const y_card_top	 	= card_top_coord.y + (e.clientY - cOffY);

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
					console.log('WE DELETE EMPTY CARD', `${tracking_last_empty_card.col} - ${tracking_last_empty_card.index-1}`);
					columns_work[tracking_last_empty_card.col].slots.splice(tracking_last_empty_card.index, 1); // if empty card exist, delete it
				} 
				tracking_last_empty_card = {col:-1, index:-1}; // no more empty card to track => reinitialize
		
				// Adding card to column dragged on at the right position
				columns_work[i].slots.splice(position_order, 0, card_temp);
				$columns = [... columns_work];

				bool_drag_success = true;

			}
		}

		const action_dispatch = (bool_drag_success ? 'cardDragSuccess' : 'cardDragFailed');
		dispatch(action_dispatch, {});  

		elem_dragged.style.removeProperty('top');
		elem_dragged.style.removeProperty('left');
	}

	// TODO : Possibilité d'ajouter une card à une position custom (uniquement au début pour l'instant)
	function addCard(col_index:number, card_index:number=0){
		const card_temp = {empty:false, animate:false, title:"New card", description:"test", category:categories_list[0], date:"02/02/2022"};
		const columns_work = [... $columns];
		columns_work[col_index].slots.unshift(card_temp);
		$columns = [... columns_work];
        dispatch('cardAdd', {});  
	}

	function removeColumn(event){
		const columns_temp = [... $columns];
		columns_temp.splice(event.detail.index_col, 1);
		$columns = [... columns_temp];
        dispatch('columnRemove', {});  

	}

	function addColumn(){
		const col_temp = {
			title:'New column',
			coordinates: {x_start:0, x_end:0, y_start:0, y_end:0},
			rect:{},
			cards:[],
			slots:[]
		}

		$columns = [... $columns, col_temp];

		setTimeout(function(){
			const col_index = $columns.length - 1 ;
			$columns[col_index].rect = document.getElementsByClassName('column')[col_index].getBoundingClientRect();
		}, 200);

        dispatch('columnAdd', {});  	
	}


	onMount(() => {
		// document.addEventListener('click', function(e){
		// 	console.log('CLICK', e);
		// })

		const columns_temp = document.getElementsByClassName('column');

		for(let i=0; i<columns_temp.length; i++){
			const rect_col  =  columns_temp[i].getBoundingClientRect();
			$columns[i].rect = rect_col;
		}

		window.addEventListener('resize', function(){
			card_width.set(document.getElementsByClassName('column')[0].clientWidth -10);
			card_height.set((document.getElementsByClassName('column')[0].clientHeight-10)/2);
		})
	})
</script>

<main style='width:{$main_width ? $main_width : "100%"};height:{$main_height ? $main_height : "100%"}' class="text-center p-4">
	<div class="layout flex w-full h-full flex-col border-dashed border-2 border-gray-500">
		<!-- TODO : Drag N Drop New card -->
		{#if dragNew}
			<div style="height:150px;" class="header flex justify-center w-full">
				<div id="container w-full h-full flex items-center justify-center">
					<div class="new-card-slot" style="position:relative;top:0px;left:0px;width:300px;height:100%;margin-top:10px;">
						<NewCard 
							on:mousedown={newCardDragStart}
							{categories_list}
						/>
					</div>
				</div>
			</div>
		{/if}
		<div class="kanban-container flex-1 w-full flex justify-start">
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
					
				/>
			{/each}

			<AddColumnBtn
				on:addColumn={addColumn}
			/>
		</div>

		<!-- <div class="card bg-white flex flex-col w-48 h-24 absolute p-2 right-9 top-8 border-1 border-black border-opacity-10 rounded z-2 draggable">
			{}
		</div> -->
		<div style="height:75px;"class="footer mt-2.5"></div>
	</div>
</main>


<style type="text/scss">
	@import './src/lib/styles/colors';
	main {
		background:$MAIN_BG;
	}
	.header{
		background:$HEADER_BG;
	}
	.footer{
		background:$FOOTER_BG;
	}
	.kanban-container{
		background:$HEADER_BG;
	}
</style>