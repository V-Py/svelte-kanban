<script lang="ts">
    import Kanban from '$lib/Kanban.svelte';
</script>


<Kanban 
    on:columnRemove
    on:columnAdd
    on:cardDragStart
    on:cardDragMove
    on:cardDragEnd
    on:cardDragSuccesss
    on:cardDragFailed
    on:cardAdd
    on:cardPropSaved
    on:cardPropModify
    on:moveCardUp
    on:moveCardDown
/>

