import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import * as css from '../../styles/arrayNode.m.css';
import AbstractArrayNode from 'rollun-ts-rql/dist/nodes/arrayNodes/AbstractArrayNode';

export interface ArrayNodeProps {
	id: number;
	node: AbstractArrayNode;
	fieldNames: string[];

	onRemove(id: number): void;
}

export default class ArrayNodeEditor extends WidgetBase<ArrayNodeProps> {
	protected render(): VNode {
		const nodeValueEditorText = this.properties.node.values.join();
		return v('div', {classes: css.root},
			[
				v('div', {classes: 'd-flex flex-row', styles: {'flex': '11'}}, [
					v('select',
						{
							classes: 'custom-select',
							onChange: (event: Event) => {
								// @ts-ignore
								this.dialogState.array.field = event.target.value;
							}
						},
						this.properties.fieldNames.map((nodeName) => v('option',
							{value: nodeName, selected: nodeName === this.properties.node.name},
							[nodeName]))
					),
					v('div', {classes: 'px-3 py-1 d-flex align-items-center'}, [this.getHumanNodeName(this.properties.node.name)]),
					v('input',
						{
							type: 'text',
							classes: 'form-control',
							value: nodeValueEditorText,
							onchange: (event: Event) => {
								// @ts-ignore
								this.properties.node.values = event.target.value.split(',');
								this.invalidate();
							}
						}
					),
				]),
				v('div', {classes: 'd-flex flex-row-reverse', styles: {'flex': '1'}},
					[
						v('button', {
								classes: css.removeButton + ' btn btn-danger',
								onclick: () => {
									this.remove(this.properties.id);
								}
							},
							[
								v('i', {classes: 'fas fa-times fa-lg'})
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
