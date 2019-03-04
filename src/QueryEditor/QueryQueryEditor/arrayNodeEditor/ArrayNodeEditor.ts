import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import * as ownCss from './arrayNode.m.css';
import AbstractArrayNode from 'rollun-ts-rql/dist/nodes/arrayNodes/AbstractArrayNode';
import * as bs from 'rollun-common/dist/css/bootstrap.m.css';
import * as fa from 'rollun-common/dist/css/fontawesome.m.css';
import * as faSolid from 'rollun-common/dist/css/solid.m.css';

export interface ArrayNodeProps {
	id: number;
	node: AbstractArrayNode;
	fieldNames: string[];

	onRemove(id: number): void;
}

export default class ArrayNodeEditor extends WidgetBase<ArrayNodeProps> {
	protected render(): VNode {
		const nodeValueEditorText = this.properties.node.values.join();
		return v('div', {classes: `${bs.dFlex} ${bs.flexRow} ${bs.p2} ${bs.mb1} ${ownCss.root}`},
			[
				v('div', {classes: `${bs.dFlex} ${bs.flexRow} ${ownCss.controlsContainer}`}, [
					v('select',
						{
							classes: bs.customSelect,
							onChange: (event: Event) => {
								// @ts-ignore
								this.dialogState.array.field = event.target.value;
							}
						},
						this.properties.fieldNames.map((nodeName) => v('option',
							{value: nodeName, selected: nodeName === this.properties.node.name},
							[nodeName])
						)
					),
					v('div',
						{classes: `${bs.px3} ${bs.py1} ${bs.dFlex} ${bs.alignItemsCenter}`},
						[this.getHumanNodeName(this.properties.node.name)]),
					v('input',
						{
							type: 'text',
							classes: bs.formControl,
							value: nodeValueEditorText,
							onchange: (event: Event) => {
								// @ts-ignore
								this.properties.node.values = event.target.value.split(',');
								this.invalidate();
							}
						}
					),
				]),
				v('div',
					{classes: `${bs.dFlex} ${bs.flexRowReverse} ${ownCss.closeBtnContainer}`},
					[
						v('button', {
								classes: `${ownCss.removeButton} ${bs.btn} ${bs.btnDanger}`,
								onclick: () => {
									this.remove(this.properties.id);
								}
							},
							[
								v('i',
									{classes: `${faSolid.fas} ${fa.faTimes}`}
								)
							]
						)
					]
				),
			]
		);
	}

	private remove(id: number) {
		this.properties.onRemove(id);
	}

	private getHumanNodeName(nodeName: string) {
		return nodeName;
	}

}
