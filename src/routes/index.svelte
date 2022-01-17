<script lang="ts">
    import Kanban from '$lib/Kanban.svelte';

    function handleSave(e){
        console.log('SAVE', e);
    }
</script>




<Kanban 
    dragNew = {false}
    on:columnRemove
    on:columnAdd

    on:cardDragStart
    on:cardDragMove
    on:cardDragEnd
    on:cardDragSuccess
    on:cardDragFailed
    on:cardAdd
    on:cardPropSaved={handleSave}
    on:cardPropModify

    on:moveCardUp
    on:moveCardDown
/>

