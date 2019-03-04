import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import * as css from './sortNodeFieldEditor.m.css';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import * as fa from 'rollun-common/dist/css/fontawesome.m.css';
import * as faSolid from 'rollun-common/dist/css/solid.m.css';
import * as bs from 'rollun-common/dist/css/bootstrap.m.css';

export interface SortFieldEditorProps {
	fieldName: string;
	sortDirection: (-1 | 1);

	onSortDirectionChange(fieldName: string, sortDirection: (-1 | 1)): void;
}

export default class SortNodeFieldEditor extends WidgetBase<SortFieldEditorProps> {
	protected render(): VNode {
		const {fieldName, sortDirection, onSortDirectionChange} = this.properties;
		return v('div',
			{
				classes: `${bs.dFlex} ${bs.flexRow} ${bs.mb1}  ${css.sortRow}`,
				draggable: true,
				ondragstart: (event: DragEvent) => {
					this.handleDragStart(event);
				}
			},
			[
				v('div', {
					classes: `${bs.py1} ${bs.px2} ${bs.w100} ${css.sortFieldName}`
				}, [fieldName]),
				v('button',
					{
						classes: `${css.changeSortDirectionButton}`,
						onclick: () => {
							onSortDirectionChange(fieldName, (sortDirection === -1 ? 1 : -1));
						}
					},
					[sortDirection === 1
						? v('i', {classes: `${faSolid.fas} ${fa.faCaretUp}`})
						: v('i', {classes: `${faSolid.fas} ${fa.faCaretDown}`})
					]
				)
			]);
	}

	private handleDragStart(event: DragEvent) {
		event.dataTransfer.setData('nodefieldname', this.properties.fieldName);
	}
}
