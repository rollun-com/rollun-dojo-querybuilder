import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import { v, w } from '@dojo/framework/widget-core/d';
import Dialog from '@dojo/widgets/dialog';
import Query from 'rollun-ts-rql/dist/Query';
import theme from '@dojo/themes/dojo';
import QueryEditor from '../query-editor/QueryEditor';
import Limit from 'rollun-ts-rql/dist/nodes/Limit';

export interface EditorModalProps {
	query: Query;
	fieldNames: string[];

	applyQuery(query: Query): void;
}

export default class QueryEditorInModal extends WidgetBase<EditorModalProps> {
	private openDialog = false;
	private query =  new Query({limit: new Limit(20, 0)});

	protected render(): DNode {
		const {fieldNames, applyQuery} = this.properties;
		const query = this.query;
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
									applyQuery(this.query);
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
