import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import AbstractLogicalNode from 'rollun-ts-rql/dist/nodes/logicalNodes/AbstractLogicalNode';
import AbstractQueryNode from 'rollun-ts-rql/dist/nodes/AbstractQueryNode';
import ScalarNodeEditor from '../ScalarNodeEditor';
import AbstractScalarNode from 'rollun-ts-rql/dist/nodes/scalarNodes/AbstractScalarNode';
import ArrayNodeEditor from '../ArrayNodeEditor';
import AbstractArrayNode from 'rollun-ts-rql/dist/nodes/arrayNodes/AbstractArrayNode';
import * as css from '../../../../styles/queryQueryEditor/logical/logicalNode.m.css';
import Dialog from '@dojo/widgets/dialog';
import theme from '@dojo/themes/dojo';
import { WNode, DNode } from '@dojo/framework/widget-core/interfaces';
import RqlNodeFactory, { RqlNodeFactoryParams } from '../../../../rql-node-factory/RqlNodeFactory';
import ChildNodeCreationForm from './ChildNodeCreationForm';

export interface LogicalNodeProps {
	id: number;
	node: AbstractLogicalNode;

	onRemove(id: number): void;

	fieldNames: string[];
}

export default class LogicalNodeEditor extends WidgetBase<LogicalNodeProps> {
	private openDialog = false;

	private nodeFactory: RqlNodeFactory;

	constructor() {
		super();
		this.nodeFactory = new RqlNodeFactory();
	}

	protected render(): DNode {
		const onRemove = (id: number) => this.removeChildNode(id);
		const fieldNames = this.properties.fieldNames;
		return v('div', {classes: css.root}, [
				v('div', {classes: css.controls}, [
					v('div', {classes: css.titleContainer}, [
						v('div', {classes: css.title},
							[this.getNodeName()]
						)
					]),
					v('div', {classes: css.controlsButtonsContainer}, [
						v('div', {classes: css.controlsButtons}, [
							v('button',
								{
									classes: 'btn btn-light btn-sm mx-2',
									onclick: () => {
										this.addChildNode();
									}
								},
								[
									v('i', {classes: 'fas fa-plus'})
								]),
							v('button',
								{
									classes: 'btn btn-danger btn-sm',
									onclick: () => {
										this.properties.onRemove(this.properties.id);
									}
								},
								[
									v('i', {classes: 'fas fa-times'})
								])
						])
					])
				]),
				v('div', {classes: css.childNodesContainer}, this.properties.node.subNodes.map(
					(node: AbstractQueryNode, id: number) => {
						let castedNode;
						switch (true) {
							case (node instanceof AbstractLogicalNode):
								castedNode = <AbstractLogicalNode> node;
								return w(LogicalNodeEditor, {id, node: castedNode, fieldNames, onRemove});

							case (node instanceof AbstractScalarNode):
								castedNode = <AbstractScalarNode> node;
								return w(ScalarNodeEditor, {id, node: castedNode, fieldNames, onRemove});

							case (node instanceof AbstractArrayNode):
								castedNode = <AbstractArrayNode> node;
								return w(ArrayNodeEditor, {id, node: castedNode, fieldNames, onRemove});
						}
					}
				)),
				w(Dialog, {
					theme,
					extraClasses: {
						'main': 'w-50 h-50',
					},
					title: 'Create new node',
					underlay: true,
					open: this.openDialog,
					onRequestClose: () => {
						this.openDialog = false;
						this.invalidate();
					}
				},
					[
						this.getChildNodeCreationMenu()
					]
				)
			]
		);
	}

	protected getNodeName(): DNode {
		return v('div', {}, [this.properties.node.name]);
	}

	private removeChildNode(id: number) {
		this.properties.node.subNodes.splice(id);
		this.invalidate();
	}

	private addChildNode() {
		this.openDialog = true;
		this.invalidate();
	}

	private getChildNodeCreationMenu(): WNode {
		return w(ChildNodeCreationForm, {
			onChildNodeCreate: (nodeName: string, params: RqlNodeFactoryParams) => {
				this.createChildNode(nodeName, params);
			},
			fieldNames: this.properties.fieldNames
		});
	}

	private createChildNode(nodeName: string, params: RqlNodeFactoryParams) {
		this.properties.node.subNodes.push(this.nodeFactory.createNode(nodeName, params));
		this.openDialog = false;
		this.invalidate();
	}

}
