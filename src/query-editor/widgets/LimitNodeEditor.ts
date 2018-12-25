import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Limit from 'rollun-ts-rql/dist/nodes/Limit';
import { v, w /*w*/ } from '@dojo/framework/widget-core/d';
import TextInput from '@dojo/widgets/text-input';
import * as css from '../../styles/limitNode.m.css';
import theme from '@dojo/themes/dojo';
import { VNode } from '@dojo/framework/widget-core/interfaces';

export interface LimitNodeEditorProps {
	node: Limit;

	onRemove(): void;
}

export default class LimitNodeEditor extends WidgetBase<LimitNodeEditorProps> {
	render(): VNode {
		return v('div', {classes: css.root}, [
			v('div', {classes: css.titleRow}, [
				v('span', {}, ['Limit node']),
				v('button', {
					classes: 'btn btn-sm btn-danger',
					onclick: () => {
						this.properties.onRemove();
					}
				}, ['X'])
			]),
			v('div', {classes: css.editorsContainer}, [
				v('div', {classes: css.limitEditorRow}, [
					v('div', {classes: css.editorItem}, ['Limit']),
					w(TextInput, {
						theme,
						type: 'number',
						value: String(this.properties.node.limit),
						onChange: (value: number) => {
							this.properties.node.limit = value;
							this.invalidate();
						}
					})
				]),
				v('div', {classes: css.limitEditorRow}, [
					v('div', {classes: css.editorItem}, ['Offset']),
					w(TextInput, {
						theme,
						type: 'number',
						value: String(this.properties.node.limit),
						onChange: (value: number) => {
							this.properties.node.offset = value;
							this.invalidate();
						}
					})
				])
			])
		]);
	}
}
