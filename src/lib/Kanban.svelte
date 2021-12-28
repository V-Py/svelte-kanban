<script lang="ts">
	import { onMount, createEventDispatcher } from "svelte";
	import { element } from "svelte/internal";
	import {fade} from "svelte/transition";
	import NewCard from "./components/NewCard.svelte";
    import Card from './components/Card.svelte';
	import Column from './components/Column/Column.svelte';
	import AddColumnBtn from './components/AddColumnBtn.svelte';
	import {card_height, card_width, main_width, main_height, columns} from "../stores/store";

	// Properties of the Kanban
	export let props_list;
	export let cols_list;
	export let dragNew;

	// TODO
	export let theme = 'light';
	export let primary = 'empty';
	export let secondary = 'empty';
	export let third = 'empty';
	export let fontPrimary = 'empty';
	export let fontSecondary = 'empty';
	export let lang = 'fr';
	export let minimalist = false;
	export let maxColumns = 5;



	let elem_dragged;
	let cOffX_new = 0;
	let cOffY_new = 0;
	let cOffX     = 0;
	let cOffY     = 0;
	let rect_new_card;
	let rect_card;
	// let columns = [];
    const dispatch = createEventDispatcher();

	cols_list.forEach(function(column, index){
		$columns[index] = {
			title:column.label,
			coordinates: {x_start:0, x_end:0, y_start:0, y_end:0},
			rect:{},
			cards:[],
			slots:[],
			slot_added:false
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
		console.log('START');
        dispatch('cardDragStart', {});  
		let e = event.detail.event;
		e = e || window.event;
		e.preventDefault();

		// Storing infos of the card dragged (coordinates, rectangle)
		elem_dragged = event.detail.elem;
		cOffX = e.clientX - elem_dragged.offsetLeft;
		cOffY = e.clientY - elem_dragged.offsetTop;
		rect_card = elem_dragged.getBoundingClientRect();

		document.addEventListener('mousemove', cardDragMove);
		document.addEventListener('mouseup', cardDragEnd);
	}

	function cardDragMove(e) {
		console.log('MOVE');
        dispatch('cardDragMove', {});  

		e = e || window.event;
		e.preventDefault();

		const x_live = (e.clientX - cOffX);
		const y_live = (e.clientY - cOffY);
		const x_test = rect_card.left + x_live;
		const y_test = rect_card.top + y_live;
		elem_dragged.style.top = y_live.toString() + 'px';
		elem_dragged.style.left = x_live.toString() + 'px';

		const array_temp = elem_dragged.id.split('card-');
		const array_temp_bis = array_temp[1].split('-col-');
		const col_index = array_temp_bis[1];

		for(let i=0; i<$columns.length;i++){
			if((x_test >= $columns[i].rect.left) && (x_test <= $columns[i].rect.right) && (y_test >= $columns[i].rect.top) && (y_test <= $columns[i].rect.bottom)){
				if($columns[i].slot_added != true && col_index != i){$columns[i].slot_added = true;}
			}else{
				if($columns[i].slot_added == true){$columns[i].slot_added = false;}
			}
		}
	};

	function cardDragEnd(e){
		console.log('END');
		let bool_drag_success = false;
        dispatch('cardDragEnd', {});  

		e = e || window.event;
		e.preventDefault();
		
		// Removing event listeners
		document.removeEventListener('mousemove', cardDragMove);
		document.removeEventListener('mouseup', cardDragEnd);

		const x_end = rect_card.left + (e.clientX - cOffX);
		const y_end = rect_card.top + (e.clientY - cOffY);
		const array_temp = elem_dragged.id.split('card-');
		const array_temp_bis = array_temp[1].split('-col-');

		const card_index = array_temp_bis[0];
		const col_index = array_temp_bis[1];

		for(let i=0; i<$columns.length;i++){
			if((x_end >= $columns[i].rect.left) && (x_end <= $columns[i].rect.right) && (y_end >= $columns[i].rect.top) && (y_end <= $columns[i].rect.bottom)){
				const card_temp = $columns[col_index].slots[card_index];

				// Copying columns
				const columns_work = [... $columns];

				// Removing card from column dragged from
				columns_work[col_index].slots.splice(card_index, 1);
		
				// Adding card to column dragged on
				columns_work[i].slots.unshift(card_temp);
				columns_work[i].slot_added = false;

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
		console.log('ADDCARD');
		const card_temp = {empty:false, animate:false, title:"New card", description:"test", color:"blue", category:"task", date:"02/02/2022"};
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
							{props_list}
						/>
					</div>
				</div>
			</div>
		{/if}
		<div class="kanban-container flex-1 w-full flex justify-start">
			{#each $columns as column, index_col}
				<Column
					cards={column.cards}
					slots={column.slots}
					title={column.title}
					{index_col}
					show_fake_slot={column.slot_added}

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
		<div style="height:75px;"class="footer mt-2.5"></div>
	</div>
</main>


<style type="text/scss">
	@import './src/styles/colors';
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