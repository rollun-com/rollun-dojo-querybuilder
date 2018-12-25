import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import * as css from '../../styles/nodeFieldNames/nodeFieldName.m.css';
import { VNode } from '@dojo/framework/widget-core/interfaces';

export interface SelectFieldProps {
	fieldName: string;
	isActive?: boolean;
	nodeType?: string;
}

export default class NodeFieldName extends WidgetBase<SelectFieldProps> {
	render(): VNode {
		const classes = this.properties.isActive ? `${css.root} ${css.active}` : css.root;
		return v('div', {
				draggable: true,
				ondragstart: (event: DragEvent) => {
					this.handleDragStart(event);
				},
				classes
			},
			[`${this.properties.fieldName}`]);
	}

	private handleDragStart(event: DragEvent) {
		event.dataTransfer.setData('nodefieldname', this.properties.fieldName);
		if (this.properties.nodeType) {
			event.dataTransfer.setData(this.properties.nodeType, '');
		}
	}
}
