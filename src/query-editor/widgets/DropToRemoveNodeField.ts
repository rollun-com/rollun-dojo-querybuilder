import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import * as css from '../../styles/dropToRemoveField.m.css';
import { VNode } from '@dojo/framework/widget-core/interfaces';

export interface DropToRemoveFieldProps {
	onNodeFieldRemove(fieldName: string, nodeName: string): void;
}

export default class DropToRemoveField extends WidgetBase<DropToRemoveFieldProps> {
	private awaitingDrop = false;
	private validDropTarget = false;

	protected render(): VNode {
		let classes = css.root;
		if (this.awaitingDrop === true) {
			classes += this.validDropTarget ? ' ' + css.validDropTarget : ' ' + css.invalidDropTarget;
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
				}
			},
			[
				v('i', {classes: 'fas fa-trash-alt'}),
				v('span', {classes: css.title}, ['Drop node here to remove it'])
			]);
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
