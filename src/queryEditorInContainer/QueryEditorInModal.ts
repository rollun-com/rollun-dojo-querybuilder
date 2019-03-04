import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import { v, w } from '@dojo/framework/widget-core/d';
import Dialog from 'rollun-common-widgets/dist/all/Dialog';
import Query from 'rollun-ts-rql/dist/Query';
import QueryEditor from '../QueryEditor/queryEditor/QueryEditor';
import Limit from 'rollun-ts-rql/dist/nodes/Limit';
import * as bs from 'rollun-common/dist/css/bootstrap.m.css';

export interface EditorModalProps {
	query: Query;
	fieldNames: string[];

	applyQuery(query: Query): void;
}

export default class QueryEditorInModal extends WidgetBase<EditorModalProps> {
	private openDialog = false;
	private query = new Query({limit: new Limit(20, 0)});
	private fieldNames: string[];
	private isStarted = false;

	protected render(): DNode {
		const {fieldNames, applyQuery} = this.properties;
		if (!this.isStarted && fieldNames && fieldNames.length > 0) {
			this.fieldNames = fieldNames;
			this.isStarted = true;
		}
		const query = this.query;
		return v('div', {
				styles: {}
			},
			[
				w(Dialog, {
						title: 'Edit query',
						isOpen: this.openDialog,
						onClose: () => {
							this.openDialog = false;
							this.invalidate();
						},
						options: {
							size: 3,
							centered: true
						}
					},
					[
						v('div', {
								classes: `${bs.dFlex} ${bs.flexGrow1}`
							},
							[
								w(QueryEditor, {query, fieldNames: this.fieldNames}),
							]
						),
						v('btn',
							{
								classes: `${bs.btn} ${bs.btnPrimary}`,
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
						classes: `${bs.btn} ${bs.btnPrimary}`,
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
