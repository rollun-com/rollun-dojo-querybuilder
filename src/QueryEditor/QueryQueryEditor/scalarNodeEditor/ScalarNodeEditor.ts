import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import * as ownCss from './scalarNode.m.css';
import AbstractScalarNode from 'rollun-ts-rql/dist/nodes/scalarNodes/AbstractScalarNode';
import * as bootstrap from 'rollun-common/dist/css/bootstrap.m.css';
import * as fa from 'rollun-common/dist/css/fontawesome.m.css';
import * as faSolid from 'rollun-common/dist/css/solid.m.css';

export interface ScalarNodeProps {
	id: number;
	node: (AbstractScalarNode);
	fieldNames: string[];

	onRemove(id: number): void;
}

export default class ScalarNodeEditor extends WidgetBase<ScalarNodeProps> {
	protected render(): VNode {
		return v('div', {classes: ownCss.root},
			[
				v('div', {classes: `${bootstrap.dFlex} ${bootstrap.flexRow} ${ownCss.controlsContainer}`},
					[
						v('select',
							{
								classes: 'bootstrap.customSelect',
								onChange: (event: Event) => {
									// @ts-ignore
									this.properties.node.fieldName = event.target.value;
								}
							},
							this.properties.fieldNames.map((nodeName) => v('option',
								{value: nodeName, selected: nodeName === this.properties.node.name},
								[nodeName])
							)
						),
						v('div',
							{classes: `${bootstrap.px3} ${bootstrap.py1} ${bootstrap.dFlex} ${bootstrap.alignItemsCenter}`},
							[this.getHumanNodeName(this.properties.node.name)]
						),
						v('input',
							{
								type: 'text',
								classes: '${bootstrap.formControl}',
								value: this.properties.node.value,
								onchange: (event: Event) => {
									// @ts-ignore
									this.properties.node.value = event.target.value;
									this.invalidate();
								}
							}
						),
					]),
				v('div', {classes: `${bootstrap.dFlex} ${bootstrap.flexRowReverse} ${ownCss.closeBtnContainer}`}, [
					v('button', {
							classes: `${ownCss.removeButton} ${bootstrap.btn} ${bootstrap.btnSm} ${bootstrap.btnDanger}`,
							onclick: () => {
								this.remove(this.properties.id);
							}
						},
						[
							v('i', {classes: `${faSolid.fas} ${fa.faTimes}`})
						]
					)
				])
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
