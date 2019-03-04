import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import AbstractLogicalNode from 'rollun-ts-rql/dist/nodes/logicalNodes/AbstractLogicalNode';
import AbstractQueryNode from 'rollun-ts-rql/dist/nodes/AbstractQueryNode';
import ScalarNodeEditor from '../scalarNodeEditor/ScalarNodeEditor';
import AbstractScalarNode from 'rollun-ts-rql/dist/nodes/scalarNodes/AbstractScalarNode';
import ArrayNodeEditor from '../arrayNodeEditor/ArrayNodeEditor';
import AbstractArrayNode from 'rollun-ts-rql/dist/nodes/arrayNodes/AbstractArrayNode';
import Dialog from 'rollun-common-widgets/dist/all/Dialog';
import { WNode, DNode } from '@dojo/framework/widget-core/interfaces';
import RqlNodeFactory, { RqlNodeFactoryParams } from '../../../rqlNodeFactory/RqlNodeFactory';
import ChildNodeCreationForm from './ChildNodeCreationForm';
import * as bs from 'rollun-common/dist/css/bootstrap.m.css';
import * as fa from 'rollun-common/dist/css/fontawesome.m.css';
import * as faSolid from 'rollun-common/dist/css/solid.m.css';
import * as css from './logicalNode.m.css';

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
		return v('div', {classes: `${bs.dFlex} ${bs.flexColumn} ${css.root}`}, [
				v('div', {classes: `${bs.dFlex} ${bs.flexRow} ${bs.bgInfo} ${bs.textWhite} ${bs.p1} ${css.controls}`},
					[
					v('div', {classes: `${bs.dFlex} ${bs.justifyContentStart} ${css.titleContainer}`}, [
						v('div', {classes: `${bs.m1} ${css.title}`},
							[this.getNodeName()]
						)
					]),
					v('div', {classes: `${bs.dFlex} ${bs.justifyContentEnd} ${css.controlsButtonsContainer}`}, [
						v('div', {classes: css.controlsButtons}, [
							v('button',
								{
									classes: `${bs.btn} ${bs.btnLight} ${bs.btnSm} ${bs.mx2}`,
									onclick: () => {
										this.addChildNode();
									}
								},
								[
									v('i', {classes: `${faSolid.fas} ${fa.faPlus}`})
								]),
							v('button',
								{
									classes: `${bs.btn} ${bs.btnDanger} ${bs.btnSm}`,
									onclick: () => {
										this.properties.onRemove(this.properties.id);
									}
								},
								[
									v('i', {classes: `${faSolid.fas} ${fa.faTimes}`})
								])
						])
					])
				]),
				v('div',
					{classes: `${bs.dFlex} ${bs.flexColumn} ${bs.p2} ${css.childNodesContainer}`},
					this.properties.node.subNodes.map(
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
					title: 'Create new node',
					isOpen: this.openDialog,
					onClose: () => {
						this.openDialog = false;
						this.invalidate();
					},
					options: {
						centered: true
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
