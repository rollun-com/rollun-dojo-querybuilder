import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import * as css from './selectNodeEditor.m.css';
import Select from 'rollun-ts-rql/dist/nodes/Select';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import NodeFieldName from '../nodeFieldName/NodeFieldName';
import * as bs from 'rollun-common/dist/css/bootstrap.m.css';
import * as fa from 'rollun-common/dist/css/fontawesome.m.css';
import * as faSolid from 'rollun-common/dist/css/solid.m.css';
import * as commonCss from '../common/common.m.css';

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
		let cardClasses = `${bs.dFlex} ${bs.flexColumn} ${bs.card} ${bs.m1} ${bs.h100} ${commonCss.transparentBorder} ${css.root}`;
		if (this.awaitingDrop) {
			cardClasses += this.validDropTarget ? commonCss.validBorder + ' ' : commonCss.invalidBorder + ' ';
		}
		return v('div',
			{classes: cardClasses},
			[
				v('div', {
					classes: `${bs.cardBody} ${bs.p3} ${bs.border}`,
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
					v('div', {classes: `${bs.dFlex} ${bs.flexRow} ${bs.cardTitle} ${css.controls}`}, [
						v('div',
							{
								classes: `${bs.dFlex} ${bs.justifyContentCenter} ${css.titleContainer}`,
							},
							[
								v('div', {}, ['Selected fields'])
							]
						),
						v('div',
							{
								classes: `${bs.dFlex} ${bs.justifyContentEnd} ${css.closeBtnContainer}`,
							},
							[
								v('button', {
									classes: `${bs.btn} ${bs.btnSm} ${bs.btnDanger}`,
									onclick: () => this.properties.onRemove()
								}, [
									v('i', {classes: `${faSolid.fas} ${fa.faTimes}`})
								])
							]
						)
					]),
					v('div',
						{classes: `${bs.dFlex} ${bs.cardText} ${css.activeNodesContainer}`}, [
							v('div',
								{
									classes: `${bs.dFlex} ${bs.flexColumn} ${bs.w100} ${css.activeSelectNodes}`,
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
