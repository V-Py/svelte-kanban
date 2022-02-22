<script lang="ts">
    import Kanban from '$lib/Kanban.svelte';

    function testFunction(e){
        console.log('TEST',e);
    }
</script>


<Kanban 
    on:columnSaveTitle={testFunction}
    on:columnRemove
    on:columnAdd
    on:cardDragStart
    on:cardDragMove
    on:cardDragEnd
    on:cardDragSuccess
    on:cardDragFailed
    on:cardAdd
    on:cardPropSaved
    on:cardPropModify
    on:moveCardUp
    on:moveCardDown
/>

