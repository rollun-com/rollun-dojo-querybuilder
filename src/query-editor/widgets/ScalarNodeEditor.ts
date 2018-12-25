import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import * as css from '../../styles/scalarNode.m.css';
import Select from '@dojo/widgets/select';
import TextInput from '@dojo/widgets/text-input';
import AbstractScalarNode from 'rollun-ts-rql/dist/nodes/scalarNodes/AbstractScalarNode';
import AbstractArrayNode from 'rollun-ts-rql/dist/nodes/arrayNodes/AbstractArrayNode';
import theme from '@dojo/themes/dojo';

export interface ScalarNodeProps {
	id: number;
	node: (AbstractScalarNode | AbstractArrayNode);
	fieldNames: string[];

	onRemove(id: number): void;
}

interface OptionData {
	disabled: boolean;
	label: string;
	value: string;
}

export default class ScalarNodeEditor extends WidgetBase<ScalarNodeProps> {
	protected render(): VNode {
		const fieldOptions: OptionData[] = this.properties.fieldNames.map((item) => {
			return {disabled: false, label: item, value: item};
		});
		const nodeValueEditorText = (this.properties.node instanceof AbstractScalarNode)
			? String(this.properties.node.value)
			: this.properties.node.values.join();
		return v('div', {classes: css.root},
			[
				w(Select, {
					useNativeElement: true,
					theme,
					options: fieldOptions,
					value: this.properties.node.field,
					getOptionDisabled: (option: OptionData) => option.disabled,
					getOptionLabel: (option: OptionData) => option.label,
					getOptionValue: (option: OptionData) => option.value,
					getOptionSelected: (option: OptionData) => option.value === this.properties.node.field,
					onChange: (option: OptionData) => {
						this.properties.node.field = option.value;
						this.invalidate();
					}
				}),
				v('span', {classes: 'px-3 py-1'}, [this.getHumanNodeName(this.properties.node.name)]),
				w(TextInput, {
					theme,
					placeholder: 'Enter value',
					value: nodeValueEditorText,
					onChange: (value: string) => {
						(this.properties.node instanceof AbstractScalarNode)
							? this.properties.node.value = value
							: this.properties.node.values = value.split(',');
						this.invalidate();
					}
				}),
				v('button', {
						classes: 'btn btn-sm btn-danger mx-2',
						onclick: () => {
							this.remove(this.properties.id);
						}
					},
					['X']
				)
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
