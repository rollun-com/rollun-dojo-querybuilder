import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import { v, w } from '@dojo/framework/widget-core/d';
import Dialog from '@dojo/widgets/dialog';
import Query from 'rollun-ts-rql/dist/Query';
import theme from '@dojo/themes/dojo';
import QueryEditor from '../query-editor/QueryEditor';

export interface EditorModalProps {
	query: Query;
	fieldNames: string[];

	onApplyQuery(): void;
}

export default class QueryEditorInModal extends WidgetBase<EditorModalProps> {
	private openDialog = false;

	protected render(): DNode {
		const {query, fieldNames, onApplyQuery} = this.properties;
		return v('div', {
				styles: {
					display: 'flex',
					flex: '1'
				}
			},
			[
				w(Dialog, {
						theme,
						extraClasses: {
							'main': 'w-50 h-50',
							'content': 'd-flex flex-column'
						},
						title: 'Edit query',
						open: this.openDialog,
						underlay: true,
						modal: true,
						onRequestClose: () => {
							// @ts-ignore
							this.openDialog = false;
							this.invalidate();
						},
					},
					[v('div', {styles: {'flex': '1'}}, [
						w(QueryEditor, {query, fieldNames}),
					]),
						v('btn',
							{
								classes: 'btn btn-primary',
								onclick: () => {
									onApplyQuery();
									this.openDialog = false;
									this.invalidate();
								}
							},
							['Apply query']
						)
					]
				),
				v('button',
					{
						classes: 'btn btn-primary',
						onclick: () => {
							this.openDialog = true;
							this.invalidate();
						}
					},
					['Edit query']
				)
			]
		);
	}
}
