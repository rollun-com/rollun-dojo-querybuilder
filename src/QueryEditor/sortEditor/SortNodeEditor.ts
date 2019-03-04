import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Sort, { SortOptions } from 'rollun-ts-rql/dist/nodes/Sort';
import * as css from './sortNodeEditor.m.css';
import { v, w } from '@dojo/framework/widget-core/d';
import { VNode, WNode } from '@dojo/framework/widget-core/interfaces';
import SortNodeFieldEditor from './SortNodeFieldEditor';
import * as bs from 'rollun-common/dist/css/bootstrap.m.css';
import * as fa from 'rollun-common/dist/css/fontawesome.m.css';
import * as faSolid from 'rollun-common/dist/css/solid.m.css';
import * as commonCss from '../common/common.m.css';

export interface SortNodeEditorProps {
	node: Sort;

	onRemove(): void;

	onSortNodeChange(sortOptions: SortOptions): void;
}

export default class SortNodeEditor extends WidgetBase<SortNodeEditorProps> {
	protected awaitingDrop = false;
	protected validDropTarget = false;

	protected render(): VNode {
		let classes = `${bs.card} ${bs.m1} ${bs.h100} ${commonCss.transparentBorder} ${css.root}`;
		if (this.awaitingDrop === true) {
			classes += this.validDropTarget ? ` ${commonCss.validBorder}` : ` ${commonCss.invalidBorder}`;
		}
		return v('div', {classes}, [
			v('div',
				{
					classes: ` ${bs.cardBody} ${bs.p3} ${bs.border} ${css.sort}`,
					ondragover: this.checkSortOptionValidity,
					ondrop: this.addNewSortOption,
					ondragleave: () => {
						this.disableDropTarget();
					}
				}, [
					v('div', {classes: `${bs.dFlex} ${bs.flexRow} ${bs.cardTitle} ${css.titleRow}`}, [
						v('div', {
								classes: `${bs.dFlex} ${bs.justifyContentStart} ${css.titleContainer}`
							},
							[
								v('span', {}, ['Sort fields'])
							]
						),
						v('div',
							{
								classes: `${bs.dFlex} ${bs.flexRow} ${bs.justifyContentEnd} ${css.closeBtnContainer}`,
							},
							[
								v('button', {
										classes: `${bs.btn} ${bs.btnSm} ${bs.btnDanger}`,
										onclick: () => {
											this.properties.onRemove();
										}
									},
									[
										v('i', {classes: `${faSolid.fas} ${fa.faTimes}`})
									]
								)
							]
						)
					]),
					v('div', {classes: `${bs.dFlex} ${bs.flexColumn} ${css.activeSortNodes} ${bs.cardText}`},
						this.renderSortEditors()
					)
				]
			)
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
