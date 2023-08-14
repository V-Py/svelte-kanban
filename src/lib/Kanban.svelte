<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";
    import {flip} from 'svelte/animate';
	import Column from './components/Column/Column.svelte';
	import AddColumnBtn from '$lib/components/AddColumnBtn.svelte';
	import {columns, globalLang} from "$lib/stores/store";
	import {Lang} from './class/Lang';

    const dispatch = createEventDispatcher();

	// Props used for setting up card size / dragNdrop
	const HEIGHT_CARD_CONTAINER = 120;
	const STARTING_POINT_TOP = 98;
	const HEIGHT_CARD = 105; // 96
	const REAL_STARTING_POINT_TOP = STARTING_POINT_TOP + HEIGHT_CARD/2; // The first point of reference is the middle of the first card (if there is one)

	// Properties of the Kanban
	export let theme 			= 'light';
	export let primary 			= null;
	export let secondary 		= null;
	export let third 			= null;
	export let fontPrimary 		= null;
	export let fontSecondary 	= null;
	export let lang 			= 'en';
	export let minimalist 		= false;
	export let maxColumns 		= 5;
	const tempLang = new Lang(lang);
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
	export let colsList = [{
			name:tempLang.getStr('Todo'),
			cards:[],
		},{
			name:tempLang.getStr('Done'), 
			cards:[]
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

	colsList.forEach(function(column, index){
		$columns[index] = {
			title:column.name,
			coordinates: {x_start:0, x_end:0, y_start:0, y_end:0},
			rect:{},
			slots:column.cards || [],
		}
	})

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
				// console.log('LAST EMPTY CARD', tracking_last_empty_card);

				if(tracking_last_empty_card.col != -1){ // deleting all the empty cards of the column
					if(tracking_last_empty_card.index == columns_work[tracking_last_empty_card.col].slots.length) tracking_last_empty_card.index--;
					columns_work[tracking_last_empty_card.col].slots.splice(tracking_last_empty_card.index, 1); // if empty card exist, delete it
				} 
				tracking_last_empty_card = {col:-1, index:-1}; // no more empty card to track => reinitialize
				
				// console.log('POSITION ORDER', position_order, 'columns work', columns_work[i].slots.length);

				// if(position_order == 1 && columns_work[i].slots.length == 0) position_order = 0;

				// Adding card to column dragged on at the right position
				
				columns_work[i].slots.splice(position_order, 0, card_temp);
				$columns = [... columns_work];
				newCol = i;
				newPos = position_order;
				bool_drag_success = true;
			}
		}

		const action_dispatch = (bool_drag_success ? 'cardDragSuccess' : 'cardDragFailed');
		let propsDispatch = (bool_drag_success ? {old_col:dragged_card_infos.col, old_pos:dragged_card_infos.index, new_col:newCol, new_pos:newPos, columns:$columns} : {col:dragged_card_infos.col, pos:dragged_card_infos.index});
		dispatch(action_dispatch, propsDispatch);  

		// console.log(`ACTION [${action_dispatch}] OLD COL [${dragged_card_infos.col}] IN POSITION OLD POS [${dragged_card_infos.index}] NEW COL [${newCol}] NEW POS [${newPos}]`);

		elem_dragged.style.removeProperty('top');
		elem_dragged.style.removeProperty('left');
	}

	function addCard(col_index:number){		
		const card_temp = {
 			empty: false,
			animate: false,
			title: $globalLang.getStr('NewCard'),
			description: $globalLang.getStr('new'),
			category: categories_list[0],
			date: new Date().toLocaleString().replace(/,.*/, '')
 		};
		const columns_work = [... $columns];
		// columns_work[col_index].slots.unshift(card_temp);
		columns_work[col_index].slots.push(card_temp);
		$columns = [... columns_work];
        dispatch('cardAdd', {col:col_index, columns:$columns});  
	}

	function removeColumn(event){
		const columns_temp = [... $columns];
		const name = columns_temp[event.detail.index_col];
		columns_temp.splice(event.detail.index_col, 1);
		$columns = [... columns_temp];
        dispatch('columnRemove', {position:event.detail.index_col, name, columns:$columns, columns:$columns});  
	}

	function addColumn(){
		const col_temp = {
			title:$globalLang.getStr('NewColumn'),
			coordinates: {x_start:0, x_end:0, y_start:0, y_end:0},
			rect:{},
			slots:[]
		}

		if($columns.length == maxColumns) return;
		const posAdd = $columns.length;
		$columns = [... $columns, col_temp];

		setTimeout(function(){
			const col_index = $columns.length - 1 ;
			$columns[col_index].rect = document.getElementsByClassName('column')[col_index].getBoundingClientRect();
		}, 200);

        dispatch('columnAdd', {position:posAdd, columns:$columns});  	
	}

	function moveCardUp(event){
		if(event.detail.card == 0 )return;
		const card = $columns[event.detail.col].slots[event.detail.card]
		
		const columns_work = [...$columns];
		columns_work[event.detail.col].slots.splice(event.detail.card, 1);
		columns_work[event.detail.col].slots.splice((event.detail.card-1), 0, card);
		columns.set(columns_work);
        dispatch('moveCardUp', {col:event.detail.col, old_pos:event.detail.card, new_pos:event.detail.card-1, columns:$columns});  	
	}

	function moveCardDown(event){
		const numEvents = ($columns[event.detail.col].slots.length -1);
		if(event.detail.card == numEvents) return;
	
		const card = $columns[event.detail.col].slots[event.detail.card]
		const columns_work = [...$columns];
		columns_work[event.detail.col].slots.splice(event.detail.card, 1);
		columns_work[event.detail.col].slots.splice((event.detail.card+1), 0, card);
		columns.set(columns_work);
        dispatch('moveCardDown', {col:event.detail.col, old_pos:event.detail.card, new_pos:event.detail.card+1, columns:$columns});  	
	}

	function handleResize(entries){
		const columns_temp = document.getElementsByClassName('column');
		for(let i=0; i<columns_temp.length; i++){
			const rect_col  =  columns_temp[i].getBoundingClientRect();
			$columns[i].rect = rect_col;
		}
	}

	function moveColumn(e){
		const direction = e.detail.direction;
		const index = e.detail.index;
		if(direction == 'left' && index == 0) return;
		if(direction == 'right' && index == ($columns.length-1)) return;
		const newIndex = index + (direction == 'right' ? 1 : -1);
		let columns_work = [...$columns];
		const col = columns_work[index];
		columns_work.splice(index,1);
		columns_work.splice(newIndex, 0, col)
		columns.set(columns_work);
		dispatch('columnMoved', {old_pos:index, new_pos:newIndex});
	}

	onMount(() => {
		if(lang) globalLang.set(new Lang(lang)); //
		// we only need to observe the first column since all the columns have the same size atm
		let resizer = new ResizeObserver(handleResize)
		resizer.observe(document.getElementsByClassName('column')[0])
	})
</script>

<div class="kanban {theme}" style:background="{primary}">
	<div class="layout">
		<div class="kanban-container">
			{#each $columns as column, index_col(column)}
				<Column
					{theme}
					{categories_list}
					slots={column.slots}
					title={column.title}
					{index_col}
					{secondary}
					{third}
					{fontPrimary}
					{fontSecondary}
					on:columnSaveTitle={(e)=>{dispatch('columnSaveTitle', {title:e.detail.title, columns:$columns})}}
					on:cardMouseDown={cardDragStart}
					on:removeColumn={removeColumn}
					on:addCard={(e) => {addCard(e.detail.index)}}
					on:cardPropSaved={(e) => {dispatch('cardPropSaved', {prop:e.detail.prop, col:e.detail.col, card:e.detail.card, value:e.detail.value, columns:$columns})}}
					on:cardPropModify
					on:cardRemove={()=>{dispatch('cardRemove', {columns:$columns})}}
					on:moveCardUp={moveCardUp}
					on:moveCardDown={moveCardDown}
					on:moveColumn={moveColumn}	
				/>
			{/each}
			<AddColumnBtn
				{theme}
				{secondary}
				{third}
				{fontPrimary}
				{fontSecondary}
				on:addColumn={addColumn}
			/>

		</div>
		<div class="footer" style:background="{primary}"></div>
	</div>
</div>



<style type="text/scss">
	:root{
		--light-bg:rgb(243, 244, 246);
		--dark-bg:#052C39;
		--light-column-bg:rgb(243, 244, 246);
		--dark-column-bg:#031D26;
		--light-gray-font:rgb(107, 114, 128);
	}
	.kanban {
		height:100%;
		width:100%;
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
		height:150px;
		display:flex;
		justify-content: center;
		width:100%;
	}

	.footer{
		height:75px;
		margin-top:0.625rem;
	}

	.kanban-container{
		display:flex;
		flex:1;
		width:100%;
		justify-content: flex-start;
	}

	.kanban.light, .light .kanban-container, .light .footer, .light .header{
		background:#fff;
	}
	.kanban.dark, .dark .kanban-container, .dark .footer, .dark .header{
		background:var(--dark-bg);
	}
</style>

