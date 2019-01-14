import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { w, v } from '@dojo/framework/widget-core/d';
import TitlePane from '@dojo/widgets/title-pane';
import QueryEditor from '../query-editor/QueryEditor';
import Query from 'rollun-ts-rql/dist/Query';
import theme from '@dojo/themes/dojo';
import { WNode } from '@dojo/framework/widget-core/interfaces';

export interface EditorPaneProps {
	query: Query;
	fieldNames: string[];

	onApplyQuery(): void;
}

export default class QueryEditorInTitlePane extends WidgetBase<EditorPaneProps> {
	private isOpen = false;

	protected render(): WNode {
		const {query, fieldNames, onApplyQuery} = this.properties;
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
			v('btn', {onclick: () => onApplyQuery(), classes: 'btn btn-primary btn-block'}, ['Apply query'])
		]);
	}
}
