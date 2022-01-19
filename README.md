<h1 align="center">
  <img src="/src/kanbanicon.png" alt="Svelte Kanban" height=60>
  <br>&ensp;Svelte Kanban
</h1>

<h4 align="center">
[![NPM version](https://img.shields.io/npm/v/svelte-kanban?color=blue&logo=NPM)](https://npmjs.com/package/svelte-kanban)
</h4>

<div class="hide-in-docs">

**[Live demo](https://www.google.com)**.

</div>

**Svelte Kanban made in pure CSS with FontAwesome icons**

<slot />

## Key Features
- **ToDo:**
<!-- - **Single / multiple select:** pass `maxSelect={1}` prop to only allow one selection
- **Dropdowns:** scrollable lists for large numbers of options
- **Searchable:** start typing to filter options
- **Tagging:** selected options are recorded as tags within the text input
- **Server-side rendering:** no reliance on browser objects like `window` or `document`
- **Configurable:** see [props](#props)
- **No dependencies:** needs only Svelte as dev dependency
- **Keyboard friendly** for mouse-less form completion -->

## Installation

```sh
npm i svelte-kanban
```

## Usage

```svelte
<script>
    import Kanban from 'svelte-kanban';
</script>

<div style="width:100%; height:100%;">
    <Kanban/>
</div>
```

## Props

Full list of props/bindable variables for this component:

<div class="table">

<!-- prettier-ignore -->
| name             | default                                                    | description                                                                                                                                                                                    |
| :--------------- | :--------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lang`        | 'en'                                              | String to specify the language of the kanban, only french and english supported atm (`en`/`fr`). |
| `colsList`   | `['Todo','Done']`                                                     | Array of string to define the default columns.|
| `catsList`      | `[{'new',color:'white', bgColor:"#0A99FF"},{label:'important',color:'white',bgColor:"#EA0B38"},{label:'task',color:'black',bgColor:"#00F5DC"},{label:'personal',color:'white',bgColor:"#629387"},{label:'work',color:'black',bgColor:"#13F644"}]` | Array of objects `(label:string, color:string, bgColor:string)`defining the categories available for the cards.|
| `maxColumns`   | `5` | Max number of columns the user can display on the kanban.|

</div>

## Events

`Kanban.svelte` dispatches the following events:

| name        | detail                                                                              | description                                                                                                                         |
| ----------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `columnRemove`       | `{ position:number, name:string }`                                                                | Triggers when a column is removed.                                                                                            |
| `columnAdd`    | `{ position: number }`                                                                | Triggers when a column is added.                                                     |
| `cardDragStart` | `{card:number, col:number, event:Event}`                                                                 | Triggers when a card start being dragged. `col` = position of the column, `card` = position of the card in the column, `event`: mousedown event props |
| `cardDragMove`    | `{card:number, col:number, event:Event}` | Triggers every time the card is moving (ie on every mousemove)                                              |
| `cardDragEnd`      |`{card:number, col:number, event:Event}`| Triggers when the dragging of the card ended.|
| `cardDragSuccess`      |`{old_col:number, old_pos:number, new_col:number, new_pos:number}`| Triggers when the drop of the card is a success (ie : the card has been moved to another column).|
| `cardDragFailed`      |`{col:number, card:number}`| Triggers when the drop of the card is a fail (ie : the card has not been moved and stayed in the origin column).|
| `cardAdd`      |`{col:number}`| Triggers when a card is added to a column.|
| `cardPropModify`      |`{ card:number, col:number, prop:string, value:string}`| Triggers when a prop of a card is in edit mode.|
| `cardPropSaved`      |`{ card:number, col:number, prop:string, value:string}`| Triggers when a prop of a card is saved.|
| `moveCardUp`      |`{col:number, old_pos:number, new_pos:number}`| Triggers when a card is moved down inside a column.|
| `moveCardDown`      |`{col:number, old_pos:number, new_pos:number}`| Triggers when a card is moved up inside a column.|
### Examples

<!-- prettier-ignore -->
- `on:columnAdd={(e) => console.log('columnAdd', e)}`
- `on:cardAdd={(e) => console.log('cardAdd', e}`.
- `on:moveCardUp={yourFunctionHere}`

```svelte
<Kanban
  on:columnAdd={(e) => alert(`You ${e.detail.type}ed '${e.detail.option.label}'`)}
  on:cardDragStart={(e) => alert(`You are moving the card at the '${e.detail.option.label}' position on the column n° ${}`)}
/>
```

## Styling

Coming soon (...)
<!-- There are 3 ways to style this component.

### With CSS variables

The first, if you only want to make small adjustments, allows you to pass the following CSS variables directly to the component as props.

- `border: var(--sms-border, 1pt solid lightgray)`: Border around top-level `div.multiselect`. Change this to e.g. to `1px solid red` to indicate this form field is in an invalid state.
- `border-radius: var(--sms-border-radius, 5pt)`: `div.multiselect` border radius.

For example, to change the background color of the options dropdown: -->

```svelte
<Kanban --sms-options-bg="white" />
```

## Dev Mode

```sh
git clone https://github.com/V-Py/svelte-kanban
cd svelte-kanban
npm install
npm run dev
```