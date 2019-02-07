import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Sort, { SortOptions } from 'rollun-ts-rql/dist/nodes/Sort';
import * as css from '../../../styles/sortNodeEditor/sortNodeEditor.m.css';
import { v, w } from '@dojo/framework/widget-core/d';
import { VNode, WNode } from '@dojo/framework/widget-core/interfaces';
import SortNodeFieldEditor from './SortNodeFieldEditor';

export interface SortNodeEditorProps {
	node: Sort;

	onRemove(): void;

	onSortNodeChange(sortOptions: SortOptions): void;
}

export default class SortNodeEditor extends WidgetBase<SortNodeEditorProps> {
	protected awaitingDrop = false;
	protected validDropTarget = false;

	protected render(): VNode {
		let classes = css.sortNodeEditor + ' card m-1';
		if (this.awaitingDrop === true) {
			classes += this.validDropTarget ? ' ' + css.validDropTarget : ' ' + css.invalidDropTarget;
		}
		return v('div', {classes}, [
			v('div',
				{
					classes: css.sort + ' card-body p-3 border',
					ondragover: this.checkSortOptionValidity,
					ondrop: this.addNewSortOption,
					ondragleave: () => {
						this.disableDropTarget();
					}
				}, [
					v('div', {classes: css.titleRow + ' card-title'}, [
						v('div', {
								styles: {
									display: 'flex',
									flex: '3',
									justifyContent: 'start'
								}
							},
							[
								v('span', {}, ['Sort fields'])
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
										onclick: () => {
											this.properties.onRemove();
										}
									},
									[
										v('i', {classes: 'fas fa-times'})
									]
								)
							]
						)
					]),
					v('div', {classes: css.activeSortNodes + ' card-text'},
						this.renderSortEditors()
					)
				])
		]);
	}

	private renderSortEditors(): WNode[] {
		const result: WNode[] = [];
		const onSortDirectionChange = (fieldName: string, sortDirection: (-1 | 1)) => {
			this.changeSortOption(fieldName, sortDirection);
		};
		Object.entries(this.properties.node.sortOptions).forEach((entry) => {
			const [fieldName, sortDirection] = entry;
			result.push(w(SortNodeFieldEditor, {fieldName, sortDirection, onSortDirectionChange}));
		});
		return result;
	}

	private checkSortOptionValidity(event: DragEvent) {
		event.preventDefault();
		this.awaitingDrop = true;
		if (event.dataTransfer.types.indexOf('nodefieldname') !== -1) {
			this.validDropTarget = true;
			this.invalidate();
			return false;
		}
		this.invalidate();
		return true;
	}

	private addNewSortOption(event: DragEvent) {
		const fieldName = event.dataTransfer.getData('nodefieldname');
		this.properties.node.sortOptions[fieldName] = 1;
		const newSortOptions = Object.assign({}, this.properties.node.sortOptions);
		this.properties.onSortNodeChange(newSortOptions);
		this.disableDropTarget();
		this.invalidate();
	}

	private disableDropTarget() {
		this.awaitingDrop = false;
		this.validDropTarget = false;
		this.invalidate();
	}

	private changeSortOption(fieldName: string, sortDirection: (-1 | 1)) {
		this.properties.node.sortOptions[fieldName] = sortDirection;
		const newSortOptions = Object.assign({}, this.properties.node.sortOptions);
		this.properties.onSortNodeChange(newSortOptions);
	}

}
