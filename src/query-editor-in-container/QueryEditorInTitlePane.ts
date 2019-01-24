import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { w, v } from '@dojo/framework/widget-core/d';
import TitlePane from '@dojo/widgets/title-pane';
import QueryEditor from '../query-editor/QueryEditor';
import Query from 'rollun-ts-rql/dist/Query';
import theme from '@dojo/themes/dojo';
import { WNode } from '@dojo/framework/widget-core/interfaces';
import Limit from 'rollun-ts-rql/dist/nodes/Limit';

export interface EditorPaneProps {
	query: Query;
	fieldNames: string[];

	applyQuery(query: Query): void;
}

export default class QueryEditorInTitlePane extends WidgetBase<EditorPaneProps> {
	private isOpen = false;
	private query =  new Query({limit: new Limit(20, 0)});

	protected render(): WNode {
		const {fieldNames, applyQuery} = this.properties;
		const query = this.query;
		return w(TitlePane, {
			theme,
			title: 'Edit query',
			open: this.isOpen,
			onRequestClose: () => {
				this.isOpen = false;
				this.invalidate();
			},
			onRequestOpen: () => {
				this.isOpen = true;
				this.invalidate();
			}
		}, [
			w(QueryEditor, {query, fieldNames}),
			v('btn', {onclick: () => applyQuery(this.query), classes: 'btn btn-primary btn-block'}, ['Apply query'])
		]);
	}
}
