import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import * as css from '../../../styles/select/selectNode.m.css';
import Select from 'rollun-ts-rql/dist/nodes/Select';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import NodeFieldName from '../NodeFieldName';

export interface SelectNodeProps {
	node: Select;
	fieldNames: string[];

	onSelectNodeChange(fields: string[]): void;

	onRemove(): void;
}

export default class SelectNodeEditor extends WidgetBase<SelectNodeProps> {
	private awaitingDrop = false;
	private validDropTarget = false;

	protected render(): VNode {
		let cardClasses = css.root + ' card m-1 ';
		if (this.awaitingDrop) {
			cardClasses += this.validDropTarget ? css.validDropTarget + ' ' : css.invalidDropTarget + ' ';
		}
		return v('div',
			{classes: cardClasses},
			[
				v('div', {
					classes: 'card-body p-3 border',
					ondragover: (event: DragEvent) => {
						this.checkDropPossibility(event);
					},
					ondragleave: (event: DragEvent) => {
						this.disableDropTarget();
					},
					ondrop: (event: DragEvent) => {
						this.addDroppedNodeToSelectedNodes(event);
					}
				}, [
					v('div', {classes: css.controls + ' card-title'}, [
						v('div',
							{
								styles: {
									display: 'flex',
									flex: '3',
									justifyContent: 'start'
								}
							},
							[
								v('div', {classes: css.title}, ['Selected fields'])
							]
						),
						v('div',
							{
								styles: {
									display: 'flex',
									flex: '1',
									justifyContent: 'flex-end'
								}
							},
							[
								v('button', {
									classes: 'btn btn-sm btn-danger',
									onclick: () => this.properties.onRemove()
								}, ['X'])
							]
						)
					]),
					v('div',
						{classes: css.activeNodesContainer + ' card-text'}, [
							v('div',
								{
									classes: css.activeSelectNodes,
								},

								this.properties.node.fields.map(
									(fieldName) => {
										return w(NodeFieldName, {fieldName, isActive: true, nodeType: 'selectnode'});
									}
								)
							)
						]
					)
				])
			]
		);
	}

	addFieldToNode(fieldName: string) {
		// if node is already present, remove it and add it to the end
		const fieldNameIndex = this.properties.node.fields.indexOf(fieldName);
		if (fieldNameIndex !== -1) {
			this.properties.node.fields.splice(fieldNameIndex, 1);
		}
		this.properties.node.fields.push(fieldName);
		this.properties.onSelectNodeChange([...this.properties.node.fields]);
	}

	private checkDropPossibility(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer.types.indexOf('nodefieldname') !== -1) {
			this.awaitingDrop = true;
			this.validDropTarget = true;
			this.invalidate();
			return false;
		}
		return true;
	}

	private disableDropTarget() {
		this.awaitingDrop = false;
		this.validDropTarget = false;
		this.invalidate();
	}

	private addDroppedNodeToSelectedNodes(event: DragEvent) {
		this.addFieldToNode(event.dataTransfer.getData('nodefieldname'));
		this.disableDropTarget();
	}
}
