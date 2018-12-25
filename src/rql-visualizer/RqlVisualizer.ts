import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Query from 'rollun-ts-rql/dist/Query';
import { v } from '@dojo/framework/widget-core/d';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import Select from 'rollun-ts-rql/dist/nodes/Select';
import Sort from 'rollun-ts-rql/dist/nodes/Sort';
import Limit from 'rollun-ts-rql/dist/nodes/Limit';
import AbstractQueryNode from 'rollun-ts-rql/dist/nodes/AbstractQueryNode';
import AbstractArrayNode from 'rollun-ts-rql/dist/nodes/arrayNodes/AbstractArrayNode';
import AbstractLogicalNode from 'rollun-ts-rql/dist/nodes/logicalNodes/AbstractLogicalNode';
import AbstractScalarNode from 'rollun-ts-rql/dist/nodes/scalarNodes/AbstractScalarNode';

export interface VisualizerProps {
	query: Query;
}

export default class RqlVisualizer extends WidgetBase<VisualizerProps> {
	protected render() {
		const {selectNode, sortNode, limitNode, queryNode} = this.properties.query;
		return v('div', {}, [
			this.renderSelectNode(selectNode),
			this.renderSortNode(sortNode),
			this.renderLimitNode(limitNode),
			this.renderQueryQuery(queryNode)
		]);
	}

	private renderSelectNode(node: Select): VNode {
		const selectedFields: VNode[] = [];
		node.fields.forEach((field) => {
			selectedFields.push(v('li', {}, [field]));
		});
		return v('div', {},
			[
				v('span', {}, ['Select fields ']),
				v('ul', {}, selectedFields)
			]
		);
	}

	private renderSortNode(node: Sort): VNode {
		const sortOptions: VNode[] = [];
		Object.entries(node.sortOptions).forEach((entry) => {
			const [fieldName, sortOp] = entry;
			const parsedSortOp = sortOp === 1 ? 'asc' : 'desc';
			sortOptions.push(v('li', {}, [`${fieldName}: ${parsedSortOp}`]));
		});
		return v('div', {},
			[
				v('span', {}, ['Sort fields ']),
				v('ul', {}, sortOptions)
			]
		);
	}

	private renderLimitNode(node: Limit): VNode {
		return v('div', {}, [
			`Limit: ${node.limit} Offset: ${node.offset}`
		]);
	}

	private renderQueryQuery(node: AbstractQueryNode) {
		return v('div', {}, [
			v('div', {}, ['Query']),
			v('div', {}, [this.renderQueryNode(node)])
		]);
	}

	private renderQueryNode(node: AbstractQueryNode): VNode {
		if (node instanceof AbstractLogicalNode) {
			const childrenNodes: VNode[] = [];
			node.subNodes.forEach((node: AbstractQueryNode) => {
				childrenNodes.push(this.renderQueryNode(node));
			});
			return v('div', {}, [
				v('div', {}, [node.name]),
				v('div', {}, childrenNodes)
			]);
		} else {
			const castedNode = <AbstractScalarNode | AbstractArrayNode> node;
			const field = castedNode.field;
			const operator = castedNode.name;
			// @ts-ignore TODO: remove tsignore
			const value = castedNode.value ? String(castedNode.value) : castedNode.values.join();
			return v('div', {}, [
				v('span', {}, [field + ' ']),
				v('span', {}, [operator + ' ']),
				v('span', {}, [value + ' '])
			]);
		}
	}
}
