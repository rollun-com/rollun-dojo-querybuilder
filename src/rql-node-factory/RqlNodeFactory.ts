import In from 'rollun-ts-rql/dist/nodes/arrayNodes/In';
import Out from 'rollun-ts-rql/dist/nodes/arrayNodes/Out';
import And from 'rollun-ts-rql/dist/nodes/logicalNodes/And';
import Or from 'rollun-ts-rql/dist/nodes/logicalNodes/Or';
import Not from 'rollun-ts-rql/dist/nodes/logicalNodes/Not';
import Alike from 'rollun-ts-rql/dist/nodes/scalarNodes/Alike';
import Like from 'rollun-ts-rql/dist/nodes/scalarNodes/Like';
import Eq from 'rollun-ts-rql/dist/nodes/scalarNodes/Eq';
import Ge from 'rollun-ts-rql/dist/nodes/scalarNodes/Ge';
import Gt from 'rollun-ts-rql/dist/nodes/scalarNodes/Gt';
import Le from 'rollun-ts-rql/dist/nodes/scalarNodes/Le';
import Lt from 'rollun-ts-rql/dist/nodes/scalarNodes/Lt';
import Ne from 'rollun-ts-rql/dist/nodes/scalarNodes/Ne';
import AbstractQueryNode from 'rollun-ts-rql/dist/nodes/AbstractQueryNode';

export interface RqlNodeFactoryParams {
	field?: string;
	value?: any;
	values?: any[];
	subNodes?: AbstractQueryNode[];
}

export default class RqlNodeFactory {
	createNode(name: string, params: RqlNodeFactoryParams): AbstractQueryNode {
		const parsedParams = Object.assign({
			field: '',
			value: '',
			values: [],
			subNodes: []
		}, params);
		let newNode: AbstractQueryNode;
		switch (name) {
			case 'in': {
				newNode = new In(parsedParams.field, parsedParams.values);
				break;
			}
			case 'out': {
				newNode = new Out(parsedParams.field, parsedParams.values);
				break;
			}
			case 'and': {
				newNode = new And(parsedParams.subNodes);
				break;
			}
			case 'or': {
				newNode = new Or(parsedParams.subNodes);
				break;
			}
			case 'not': {
				newNode = new Not(parsedParams.subNodes);
				break;
			}
			case 'like': {
				newNode = new Like(parsedParams.field, parsedParams.value);
				break;
			}
			case 'alike': {
				newNode = new Alike(parsedParams.field, parsedParams.value);
				break;
			}
			case 'eq': {
				newNode = new Eq(parsedParams.field, parsedParams.value);
				break;
			}
			case 'ge': {
				newNode = new Ge(parsedParams.field, parsedParams.value);
				break;
			}
			case 'gt': {
				newNode = new Gt(parsedParams.field, parsedParams.value);
				break;
			}
			case 'le': {
				newNode = new Le(parsedParams.field, parsedParams.value);
				break;
			}
			case 'lt': {
				newNode = new Lt(parsedParams.field, parsedParams.value);
				break;
			}
			case 'ne': {
				newNode = new Ne(parsedParams.field, parsedParams.value);
				break;
			}
			default:
				throw new Error(`Unknown node ${name}`);
		}
		return newNode;
	}
}
