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
            label:"First1",
            value:"first"
        },{
            label:"Second2",
            value:"second"
        },{
            label:"Third3",
            value:"third"
        },{
            label:"Fourth4",
            value:"fourth"
        }
    ]
</script>




<Kanban 
    {props_list}
    {cols_list}
/>

