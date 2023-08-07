<script>import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
export let theme;
export let fontPrimary;
export let secondary;
</script>

<div style="position:relative;">
    <button id="add-column" class="add-column {theme}" on:click={() => {dispatch('addColumn', {});}} style:color="{fontPrimary}" style:background-color="{secondary}">
        <span class="button_top">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mdi-light" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M5 13v-1h6V6h1v6h6v1h-6v6h-1v-6H5z" fill="currentColor"></path></svg>
        </span>
    </button>
</div>

<style>
	@import '../styles/colors.scss';
    /* @import '../../app.css'; */

    .add-column{
        position:absolute;
        left:0.75rem;
        top:2rem;
        display:block;
        display:flex;
        justify-content: center;
        align-items: center;
        cursor:pointer;
    }

    .add-column.light{
        background-color:rgba(255,255,255,0.5);
        border:1px solid darkgray;
        width:3rem;
        height:3rem;
        border-radius: 50%;
    }

    .add-column.cuphead{
        /* Variables */
        --button_radius: 0.75em;
        --button_color: #e8e8e8;
        --button_outline_color: #000000;
        font-size: 17px;
        font-weight: bold;
        border: none;
        border-radius: var(--button_radius);
        background: var(--button_outline_color);
    }

    .cuphead .button_top{
        display: block;
        box-sizing: border-box;
        border: 2px solid var(--button_outline_color);
        border-radius: var(--button_radius);
        padding: 0.75em 1.5em;
        background: var(--button_color);
        color: var(--button_outline_color);
        transform: translateY(-0.2em);
        transition: transform 0.1s ease;
    }

    .cuphead:hover .button_top{
        transform: translateY(-0.33em);
    }

    .cuphead:active .button_top{
        transform: translateY(0);
    }

    .add-column.light:hover{
        filter:brightness(0.75);
    }

    .add-column.light:active{
        filter:brightness(0.5);
    }

</style>