import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import * as css from '../../styles/scalarNode.m.css';
import AbstractScalarNode from 'rollun-ts-rql/dist/nodes/scalarNodes/AbstractScalarNode';

export interface ScalarNodeProps {
	id: number;
	node: (AbstractScalarNode);
	fieldNames: string[];

	onRemove(id: number): void;
}

export default class ScalarNodeEditor extends WidgetBase<ScalarNodeProps> {
	protected render(): VNode {
		return v('div', {classes: css.root},
			[
				v('div', {classes: 'd-flex flex-row', styles: {'flex': '11'}},
					[
						v('select',
							{
								classes: 'custom-select',
								onChange: (event: Event) => {
									// @ts-ignore
									this.properties.node.fieldName = event.target.value;
								}
							},
							this.properties.fieldNames.map((nodeName) => v('option', {value: nodeName}, [nodeName]))
						),
						v('div', {classes: 'px-3 py-1 d-flex align-items-center'}, [this.getHumanNodeName(this.properties.node.name)]),
						v('input',
							{
								type: 'text',
								classes: 'form-control',
								value: this.properties.node.value,
								onchange: (event: Event) => {
									// @ts-ignore
									this.properties.node.value = event.target.value;
									this.invalidate();
								}
							}
						),
					]),
				v('div', {classes: 'd-flex flex-row-reverse', styles: {'flex': '1'}}, [
					v('button', {
							classes: css.removeButton + ' btn btn-sm btn-danger',
							onclick: () => {
								this.remove(this.properties.id);
							}
						},
						[
							v('i', {classes: 'fas fa-times fa-lg'})
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
