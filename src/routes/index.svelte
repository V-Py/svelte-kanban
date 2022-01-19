<script lang="ts">
    import Kanban from '$lib/Kanban.svelte';
</script>


<Kanban 
    dragNew = {false}
    on:columnRemove={(e) => {console.log('columnRemove', e)}}
    on:columnAdd={(e) => {console.log('columnAdd', e)}}

    on:cardDragStart={(e) => {console.log('cardDragStart', e)}}
    on:cardDragMove={(e) => {console.log('cardDragMove', e)}}
    on:cardDragEnd={(e) => {console.log('cardDragEnd', e)}}
    on:cardDragSuccess={(e) => {console.log('cardDragSuccess', e)}}
    on:cardDragFailed={(e) => {console.log('cardDragFailed', e)}}
    on:cardAdd={(e) => {console.log('cardAdd', e)}}
    on:cardPropSaved={(e) => {console.log('cardPropSaved', e)}}
    on:cardPropModify={(e) => {console.log('cardPropModify', e)}}

    on:moveCardUp={(e) => {console.log('moveCardUp', e)}}
    on:moveCardDown={(e) => {console.log('moveCardDown', e)}}
/>

