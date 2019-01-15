import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import AbstractQueryNode from 'rollun-ts-rql/dist/nodes/AbstractQueryNode';
import Select from 'rollun-ts-rql/dist/nodes/Select';
import Sort, { SortOptions } from 'rollun-ts-rql/dist/nodes/Sort';
import Limit from 'rollun-ts-rql/dist/nodes/Limit';
import SelectNodeEditor from './widgets/Select/SelectNodeEditor';
import SortNodeEditor from './widgets/Sort/SortNodeEditor';
import LimitNodeEditor from './widgets/LimitNodeEditor';
import Query from 'rollun-ts-rql/dist/Query';
import * as css from '../styles/queryEditor.m.css';
import DropToRemoveNodeField from './widgets/DropToRemoveNodeField';
import PossibleNodeFields from './widgets/PossibleNodeFields';
import { VNode, DNode } from '@dojo/framework/widget-core/interfaces';
import AbstractLogicalNode from 'rollun-ts-rql/dist/nodes/logicalNodes/AbstractLogicalNode';
import Dialog from '@dojo/widgets/dialog';
import theme from '@dojo/themes/dojo';
import ChildNodeCreationForm from './widgets/ChildNodeCreationForm';
import RqlNodeFactory, { RqlNodeFactoryParams } from '../rql-node-factory/RqlNodeFactory';
import LogicalNodeEditor from './widgets/Logical/LogicalNodeEditor';
import ScalarNodeEditor from './widgets/ScalarNodeEditor';
import AbstractScalarNode from 'rollun-ts-rql/dist/nodes/scalarNodes/AbstractScalarNode';
import AbstractArrayNode from 'rollun-ts-rql/dist/nodes/arrayNodes/AbstractArrayNode';
import ArrayNodeEditor from './widgets/ArrayNodeEditor';

export interface QueryQueryEditorProps {
	query: Query;
	fieldNames: string[];
	renderLimitNode?: boolean;
}

export default class QueryEditor extends WidgetBase<QueryQueryEditorProps> {
	private openQueryCreationDialog = false;
	// private openQueryNodeCreationDialog = false;
	private rqlNodeFactory = new RqlNodeFactory();

	protected render(): VNode {
		const nonQueryEditors: DNode[] = [
			v('div', {classes: 'col-md-4 p-0'}, [
				w(PossibleNodeFields, {fieldNames: this.properties.fieldNames})
			]),
			v('div', {classes: 'col-md-3 p-0'}, [
				this.renderSelectNode(this.properties.query.selectNode)
			]),
			v('div', {classes: 'col-md-3 p-0'}, [
				this.renderSortNode(this.properties.query.sortNode)
			]),
			v('div', {classes: 'col-md-2 p-0'}, [
				w(DropToRemoveNodeField, {
					onNodeFieldRemove: (fieldName: string, nodeType: string) => {
						this.removeFieldFromNode(fieldName, nodeType);
					}
				})
			])
		];
		if (this.properties.renderLimitNode) {
			nonQueryEditors.push(v('div', {}, [this.renderLimitNode(this.properties.query.limitNode)]));
		}
		return v('div', {classes: css.root}, [
			v('div', {
					classes: css.nonQueryEditorsContainer
				},
				[
					v('div', {classes: 'mb-2 row m-0 w-100'}, nonQueryEditors)
				]
			),
			v('div', {
				classes: css.queryEditorContainer
			}, [
				this.renderQueryNode(this.properties.query.queryNode)
			])
		]);
	}

	private renderSelectNode(node: (Select | undefined)) {
		if (node) {
			const onRemove = () => {
				this.removeNode('select');
			};
			const onSelectNodeChange = (fields: string[]) => {
				this.properties.query.selectNode = new Select(fields);
				this.invalidate();
			};
			return w(SelectNodeEditor, {
				node, onRemove, fieldNames: this.properties.fieldNames, onSelectNodeChange
			});
		}
		else {
			return v('button', {
				classes: 'btn btn-lg btn-light',
				onclick: () => {
					this.properties.query.selectNode = new Select(['id']);
					this.invalidate();
				}
			}, ['Add select node']);
		}
	}

	private renderSortNode(node: Sort) {
		if (node) {
			const onSortNodeChange = (sortOptions: SortOptions) => {
				this.properties.query.sortNode = new Sort(sortOptions);
				this.invalidate();
			};
			const onRemove = () => {
				this.removeNode('sort');
			};
			return w(SortNodeEditor, {node, onRemove, onSortNodeChange});
		}
		else {
			return v('button', {
				classes: 'btn btn-lg btn-light',
				onclick: () => {
					this.properties.query.sortNode = new Sort({id: 1});
					this.invalidate();
				}
			}, ['Add sort node']);
		}
	}

	private renderLimitNode(node: Limit) {
		if (node) {
			const onRemove = () => {
				this.removeNode('limit');
			};
			return w(LimitNodeEditor, {node, onRemove});
		}
		else {
			return v('button', {
				classes: 'btn btn-lg btn-light',
				onclick: () => {
					this.properties.query.limitNode = new Limit(20, 0);
					this.invalidate();
				}
			}, ['Add limit node']);
		}
	}

	private renderQueryNode(node: AbstractQueryNode) {
		if (node) {
			switch (true) {
				case node instanceof AbstractLogicalNode:
					const logicalNode = <AbstractLogicalNode> node;
					return w(LogicalNodeEditor, {
						id: 1,
						onRemove: () => {
							this.removeNode('query');
						},
						fieldNames: this.properties.fieldNames,
						node: logicalNode
					});
				case node instanceof AbstractScalarNode:
					const scalarNode = <AbstractScalarNode> node;
					return w(ScalarNodeEditor, {
						id: 1,
						node: scalarNode,
						fieldNames: this.properties.fieldNames,
						onRemove: () => {
							this.removeNode('query');
						}
					});
				case node instanceof AbstractArrayNode:
					const arrayNode = <AbstractArrayNode> node;
					return w(ArrayNodeEditor, {
						id: 1,
						node: arrayNode,
						fieldNames: this.properties.fieldNames,
						onRemove: () => {
							this.removeNode('query');
						}
					});
			}

		}
		else {
			return v('div', {}, [
				v('button', {
					classes: 'btn btn-lg btn-light',
					onclick: () => {
						this.openQueryCreationDialog = true;
						this.invalidate();
					}
				}, ['Add query node']),
				w(Dialog, {
					theme,
					title: 'Create new node',
					modal: true,
					open: this.openQueryCreationDialog,
					onRequestClose: () => {
						this.openQueryCreationDialog = false;
						this.invalidate();
					}
				}, [v('div', {},
					[
						w(ChildNodeCreationForm, {
							onChildNodeCreate: (nodeName: string, params: RqlNodeFactoryParams) => {
								this.properties.query.queryNode = this.rqlNodeFactory.createNode(nodeName, params);
								this.openQueryCreationDialog = false;
								this.invalidate();
							},
							fieldNames: this.properties.fieldNames
						})
					])
				])
			]);
		}
	}

	private removeNode(queryNodeName: ('select' | 'sort' | 'limit' | 'query')) {
		switch (true) {
			case queryNodeName === 'select': {
				this.properties.query.selectNode = undefined;
				break;
			}
			case queryNodeName === 'sort': {
				this.properties.query.sortNode = undefined;
				break;
			}
			case queryNodeName === 'limit': {
				this.properties.query.limitNode = undefined;
				break;
			}
			case queryNodeName === 'query': {
				this.properties.query.queryNode = undefined;
				break;
			}
		}
		this.invalidate();
	}

	private removeFieldFromNode(fieldName: string, nodeType: string) {
		switch (nodeType) {
			case 'selectnode':
				const fieldNameIndex = this.properties.query.selectNode.fields.indexOf(fieldName);
				if (fieldNameIndex !== -1) {
					this.properties.query.selectNode.fields.splice(fieldNameIndex, 1);
					const newFields = [...this.properties.query.selectNode.fields];
					this.properties.query.selectNode = new Select(newFields);
				}
				break;
			case 'sortnode':
				if (this.properties.query.sortNode.sortOptions.hasOwnProperty(fieldName)) {
					delete this.properties.query.sortNode.sortOptions[fieldName];
					const newSortOptions = Object.assign({}, this.properties.query.sortNode.sortOptions);
					this.properties.query.sortNode = new Sort(newSortOptions);
				}
				break;
		}
		this.invalidate();
	}
}
