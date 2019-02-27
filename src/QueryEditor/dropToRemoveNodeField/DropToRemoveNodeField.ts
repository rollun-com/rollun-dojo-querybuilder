import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import * as css from './dropToRemoveField.m.css';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import * as bootstrap from 'rollun-common/dist/css/bootstrap.m.css';
import * as fa from 'rollun-common/dist/css/fontawesome.m.css';
import * as faSolid from 'rollun-common/dist/css/solid.m.css';

export interface DropToRemoveFieldProps {
	onNodeFieldRemove(fieldName: string, nodeName: string): void;
}

export default class DropToRemoveField extends WidgetBase<DropToRemoveFieldProps> {
	private awaitingDrop = false;
	private validDropTarget = false;

	protected render(): VNode {
		let classes = `${css.root} ${bootstrap.card} ${bootstrap.m1}`;
		if (this.awaitingDrop === true) {
			classes += this.validDropTarget ? ` ${css.validDropTarget}` : ` ${css.invalidDropTarget}`;
		}
		return v('div',
			{
				classes: classes,
				ondragover: (event: DragEvent) => {
					this.checkDropPossibility(event);
				},
				ondragleave: (event: DragEvent) => {
					this.disableDropTarget(event);
				},
				ondrop: (event: DragEvent) => {
					this.removeDroppedNodeFromSelectedNodes(event);
					this.disableDropTarget(event);
				}
			},
			[
				v('div',
					{classes: `${bootstrap.cardBody} ${bootstrap.p3} ${bootstrap.h100} ${bootstrap.border}`},
					[
						v('span',
							{classes: `${css.title} ${bootstrap.cardTitle}`},
							['Drop field to remove it']),
						v('div',
							{classes: `${css.iconAligner} ${bootstrap.cardText}`},
							[
								v('div',
									{},
									[
										v('i', {classes: `${faSolid.fas} ${fa.faTrashAlt} ${fa.fa3x}`})
									]
								)
							]
						)
					]
				)
			]
		);
	}

	private checkDropPossibility(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer.types.indexOf('nodefieldname') !== -1) {
			this.awaitingDrop = true;
			this.validDropTarget = true;
			this.invalidate();
			return false;
		}
		this.invalidate();
		return true;
	}

	private disableDropTarget(event: DragEvent) {
		this.awaitingDrop = false;
		this.validDropTarget = false;
		this.invalidate();
	}

	private removeDroppedNodeFromSelectedNodes(event: DragEvent) {
		const nodeFieldName = event.dataTransfer.getData('nodefieldname');
		if (event.dataTransfer.types.indexOf('selectnode') !== -1) {
			const nodeType = 'selectnode';
			this.properties.onNodeFieldRemove(nodeFieldName, nodeType);
		} else {
			const nodeType = 'sortnode';
			this.properties.onNodeFieldRemove(nodeFieldName, nodeType);
		}
	}
}
