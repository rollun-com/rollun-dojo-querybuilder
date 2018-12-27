# rollun-rql-query-builder

Graphical RQL query editor made using [Dojo](https://dojo.io/)

## Installation
preferred way to install this library is via npm. Run
```
npm install rollun-ts-rql-query-builder
```
or add
```
"rollun-ts-rql-query-builder": "*",
```
to the dependencies section of your package.json

## Basic usage
### Render query editor
```typescript
import renderer from '@dojo/framework/widget-core/vdom';
import { w } from '@dojo/framework/widget-core/d';

// array of allowed field names
const fieldNames = [
	{id: 1, name: 'Bob', age: 21},
	{id: 2, name: 'Alex', age: 25},
	{id: 3, name: 'Veronica', age: 20},
];

// query that will be edited
const query = new Query({
    query: new And([
        new Le('age', 25),
        new Ge('age', 18),
    ])
});


const r = renderer(() => w(QueryEditor, {query, fieldNames}),);
r.mount();
```

## Note
Editor will mutate provided query according to GUI interactions
