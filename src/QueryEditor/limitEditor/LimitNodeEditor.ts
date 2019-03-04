import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Limit from 'rollun-ts-rql/dist/nodes/Limit';
import { v, w } from '@dojo/framework/widget-core/d';
import TextInput from '@dojo/widgets/text-input';
import * as css from './limitNode.m.css';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import * as bs from 'rollun-common/dist/css/bootstrap.m.css';

export interface LimitNodeEditorProps {
	node: Limit;

	onRemove(): void;
}

export default class LimitNodeEditor extends WidgetBase<LimitNodeEditorProps> {
	render(): VNode {
		return v('div',
			{classes: `${bs.dFlex} ${bs.p2} ${bs.flexColumn} ${css.root}`},
			[
				v('div',
					{classes: `${bs.dFlex} ${bs.flexRow} ${css.titleRow}`},
					[
						v('span',
							{},
							['Limit node']),
						v('button',
							{
								classes: `${bs.btn} ${bs.btnSm} ${bs.btnDanger}`,
								onclick: () => {
									this.properties.onRemove();
								}
							}, ['X']
						)
					]),
				v('div',
					{classes: `${bs.dFlex} ${bs.flexColumn} ${css.editorsContainer}`},
					[
						v('div',
							{classes: `${bs.dFlex} ${bs.flexRow} ${css.limitEditorRow}`},
							[
								v('div',
									{classes: `${bs.mr2} ${css.editorItem}`},
									['Limit']
								),
								w(TextInput, {
									type: 'number',
									value: String(this.properties.node.limit),
									onChange: (value: number) => {
										this.properties.node.limit = value;
										this.invalidate();
									}
								})
							]),
						v('div',
							{classes: `${bs.dFlex} ${bs.flexRow} ${css.limitEditorRow}`},
							[
								v('div',
									{classes: `${bs.mr2} ${css.editorItem}`},
									['Offset']
								),
								w(TextInput, {
									type: 'number',
									value: String(this.properties.node.offset),
									onChange: (value: number) => {
										this.properties.node.offset = value;
										this.invalidate();
									}
								})
							]
						)
					]
				)
			]
		);
	}
}
