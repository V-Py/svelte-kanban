<script lang="ts">
    import Test from '$lib/Test.svelte';
    import Kanban from '$lib/Kanban.svelte';
    
    let props_list = [
        {
            label:"first",
            color:"purple"
        },{   
            label:"second",
            color:"green"
        },{
            label:"third",
            color:"red"
        }
    ]

    let cols_list = [
        {
            label:"First",
            value:"first"
        },{
            label:"Second",
            value:"second"
        }
    ]
</script>




<Kanban 
    dragNew = {false}
    {props_list}
    {cols_list}
/>

