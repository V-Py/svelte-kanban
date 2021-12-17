<script lang="ts">
	import { onMount } from "svelte";
	import { element } from "svelte/internal";
	import {fade} from "svelte/transition";
	import NewCard from "./components/NewCard.svelte";
    import Card from './components/Card.svelte';
	import Column from './components/Column/Column.svelte';
	import AddColumnBtn from './components/AddColumnBtn.svelte';
	import {card_height, card_width, number_of_slots, main_width, main_height} from "../stores/store";

	// Properties of the Kanban
	export let props_list;
	export let cols_list;

	let elem_dragged;
	let cOffX_new = 0;
	let cOffY_new = 0;
	let cOffX     = 0;
	let cOffY     = 0;
	let rect_new_card;
	let rect_card;
	let columns = [];

	cols_list.forEach(function(column, index){
		columns[index] = {
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

		const columns_temp = document.getElementsByClassName('column');
		
		for(let i=0; i<columns.length;i++){
			if((x_test >= columns[i].rect.left) && (x_test <= columns[i].rect.right) && (y_test >= columns[i].rect.top) && (y_test <= columns[i].rect.bottom)){

				columns_temp[i].classList.add('dragover');
				columns_temp[i].classList.remove('enlightened');

				if(columns[i].slot_added != true){
					// const slots_temp = columns[i].slots;
					// slots_temp.unshift({empty:true});
					// columns[i].slots = [...slots_temp];
					columns[i].slot_added = true;
				}
			}else{
				columns_temp[i].classList.add('enlightened');
				columns_temp[i].classList.remove('dragover');

				if(columns[i].slot_added == true){
					// const slots_temp = columns[i].slots;
					// if(slots_temp[0].empty == true){
					// 	slots_temp.shift();
					// 	columns[i].slots = [...slots_temp];
					// }
					columns[i].slot_added = false;
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

		const columns_temp = document.getElementsByClassName('column');

		for(let i=0; i<columns.length;i++){
			columns_temp[i].classList.remove('enlightened', 'dragover');

			if((x_end >= columns[i].rect.left) && (x_end <= columns[i].rect.right) && (y_end >= columns[i].rect.top) && (y_end <= columns[i].rect.bottom)){
				const card_temp = {empty:false, title:"New card"};
				const slots_temp = columns[i].slots;
				// slots_temp.shift();
				columns[i].slot_added = false;
				slots_temp.unshift(card_temp)
				columns[i].slots = [...slots_temp];
			}
		}
	};

	function cardDragStart(event){
		console.log(event.detail)
		let e = event.detail.event;
		let elem = event.detail.elem;
		console.log('CARD DRAG START', e);

		e = e || window.event;
		e.preventDefault();
		elem_dragged = elem;

		cOffX = e.clientX - elem.offsetLeft;
		cOffY = e.clientY - elem.offsetTop;
		rect_card = elem.getBoundingClientRect();

		document.addEventListener('mousemove', cardDragMove);
		document.addEventListener('mouseup', cardDragEnd);
	}

	function cardDragMove(e) {
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

		const card_index = array_temp_bis[0];
		const col_index = array_temp_bis[1];

		const columns_temp = document.getElementsByClassName('column');

		for(let i=0; i<columns.length;i++){
			if((x_test >= columns[i].rect.left) && (x_test <= columns[i].rect.right) && (y_test >= columns[i].rect.top) && (y_test <= columns[i].rect.bottom)){
				columns_temp[i].classList.add('dragover');
				columns_temp[i].classList.remove('enlightened');

				if(columns[i].slot_added != true && col_index != i){
					// const slots_temp = columns[i].slots;
					// slots_temp.unshift({empty:true});
					// columns[i].slots = [...slots_temp];
					columns[i].slot_added = true;
				}
			}else{
				columns_temp[i].classList.add('enlightened');
				columns_temp[i].classList.remove('dragover');
				
				if(columns[i].slot_added == true){
					// const slots_temp = columns[i].slots;
					// slots_temp.pop();
					// columns[i].slots = [...slots_temp];
					columns[i].slot_added = false;
				}
			}
		}
	};

	function cardDragEnd(e){
		console.log('DRAG END');

		e = e || window.event;
		e.preventDefault();
		
		const x_end = rect_card.left + (e.clientX - cOffX);
		const y_end = rect_card.top + (e.clientY - cOffY);

		document.removeEventListener('mousemove', cardDragMove);
		document.removeEventListener('mouseup', cardDragEnd);

		const array_temp = elem_dragged.id.split('card-');
		const array_temp_bis = array_temp[1].split('-col-');

		const card_index = array_temp_bis[0];
		const col_index = array_temp_bis[1];
		// console.log('COL', col_index, 'CARD', card_index);
		// console.log('XY', x_end, ',', y_end);

		const columns_temp = document.getElementsByClassName('column');

		for(let i=0; i<columns.length;i++){
			columns_temp[i].classList.remove('enlightened', 'dragover');

			if((x_end >= columns[i].rect.left) && (x_end <= columns[i].rect.right) && (y_end >= columns[i].rect.top) && (y_end <= columns[i].rect.bottom)){
				console.log('DANS COLONNE');
				const card_temp = {empty:false, title:"New card"};
				const columns_work = [... columns];
				columns_work[col_index].slots.splice(card_index, 1);
				columns_work[col_index].slots.push({empty:true});
				columns_work[i].slots.pop();
				columns_work[i].slots.unshift(card_temp);

				columns = [... columns_work];

				console.log(columns);
			}
		}

		elem_dragged.style.removeProperty('top');
		elem_dragged.style.removeProperty('left');
	}

	function removeColumn(event){
		console.log('REMOVE COLUMN :', event.detail.index_col);

		const columns_temp = [... columns];
		columns_temp.splice(event.detail.index_col, 1);
		columns = [... columns_temp];
	}

	function addColumn(){
		const col_temp = {
			title:'New column',
			coordinates: {x_start:0, x_end:0, y_start:0, y_end:0},
			rect:{},
			cards:[],
			slots:[]
		}

		columns = [... columns, col_temp];

		setTimeout(function(){
			const col_index = columns.length - 1 ;
			columns[col_index].rect = document.getElementsByClassName('column')[col_index].getBoundingClientRect();
			for(let i=0; i<$number_of_slots; i++){
				columns[col_index].slots = {empty:true};
			}
		}, 200)
	}

	function removeCard(event){
		console.log('CARD', event.detail.card);
		console.log('COL', event.detail.col);
		const column_temp = columns[event.detail.col];

		// console.log(column_temp);
		column_temp.cards.splice(event.detail.card,1);
		columns[event.detail.col].cards = [... column_temp.cards];
	}

	function addSlot(){
		console.log('TEST');

		const slots_temp = columns[1].slots;
		slots_temp.unshift({empty:true, animate:true});
		columns[1].slots = [... slots_temp];
		// columns[1].slots.unshift({empty:true});
	}

	onMount(() => {
		const columns_temp = document.getElementsByClassName('column');
		const columns_content = document.getElementsByClassName('content');

		let width_card
		for(let i=0; i<columns_temp.length; i++){
			const rect_col  =  columns_content[i].getBoundingClientRect();
			columns[i].rect = rect_col;
			const width = rect_col.width;

			columns[i].number_of_slots = Math.floor(rect_col.height/$card_height);

			if(i==0){
				number_of_slots.set(Math.floor(rect_col.height/$card_height));
			}

			for(let j=0; j<$number_of_slots; j++){
				columns[i].slots[j] = {empty:true};
			}
		}

		window.addEventListener('resize', function(){
			console.log('RESIZED');
			card_width.set(document.getElementsByClassName('column')[0].clientWidth -10);
			card_height.set((document.getElementsByClassName('column')[0].clientHeight-10)/2);
		})

		console.log('MOUNTED', columns);
	})
</script>

<main style='width:{$main_width ? $main_width : "100%"};height:{$main_height ? $main_height : "100%"}' class="text-center p-4">
	<div class="layout flex w-full h-full flex-col border-dashed border-2 border-gray-500">
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
		<div class="kanban-container flex-1 w-full flex justify-start">
			{#each columns as column, index_col}
				<Column
					cards={column.cards}
					slots={column.slots}
					title={column.title}
					number_slots={column.number_of_slots}
					{index_col}
					show_fake_slot={column.slot_added}

					on:cardMouseDown={cardDragStart}
					on:removeColumn={removeColumn}
					on:removeCard={removeCard}
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