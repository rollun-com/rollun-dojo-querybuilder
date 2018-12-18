import renderer from '@dojo/framework/widget-core/vdom';
import {v, w} from '@dojo/framework/widget-core/d';
import Select from 'rollun-ts-rql/dist/nodes/Select';
import Query from 'rollun-ts-rql/dist/Query';
import Sort from 'rollun-ts-rql/dist/nodes/Sort';
import Limit from 'rollun-ts-rql/dist/nodes/Limit';
import And from 'rollun-ts-rql/dist/nodes/logicalNodes/And';
import Or from 'rollun-ts-rql/dist/nodes/logicalNodes/Or';
import Eq from 'rollun-ts-rql/dist/nodes/scalarNodes/Eq';
import Le from 'rollun-ts-rql/dist/nodes/scalarNodes/Le';
import Ge from 'rollun-ts-rql/dist/nodes/scalarNodes/Ge';
import QueryEditor from './widgets/QueryEditor';

const query = new Query(
    {
        select: new Select(['id', 'name', 'age']),
        sort: new Sort({
            age: -1,
            id: 1
        }),
        limit: new Limit(10, 20),
        query: new And([
            new Or([
                new Eq('city', 'Kyiv'),
                new Eq('city', 'Lviv'),
            ]),
            new Le('age', 45),
            new Ge('age', 18)
        ]),
    });
const fieldNames = ['id', 'name', 'age', 'city'];

const r = renderer(() => v('div', {}, [
    w(QueryEditor, {query, fieldNames}),
]));
r.mount();
