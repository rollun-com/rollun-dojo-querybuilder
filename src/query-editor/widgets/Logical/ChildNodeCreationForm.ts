import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { RqlNodeFactoryParams } from '../../../rql-node-factory/RqlNodeFactory';
import { v, w } from '@dojo/framework/widget-core/d';
import * as modalCss from '../../../styles/logical/logicalNodeModal.m.css';
import Select from '@dojo/widgets/select';
import TextInput from '@dojo/widgets/text-input';
import AccordionPane from '@dojo/widgets/accordion-pane';
import TitlePane from '@dojo/widgets/title-pane';
// import theme from '../../../themes/default/theme';
import theme from '@dojo/themes/dojo';
import { DNode } from '@dojo/framework/widget-core/interfaces';

export interface ChildNodeCreationFormProps {
	onChildNodeCreate(nodeName: string, params: RqlNodeFactoryParams): void;
}

export default class ChildNodeCreationForm extends WidgetBase<ChildNodeCreationFormProps> {
	private scalarNodeNames = [
		'like',
		'alike',
		'eq',
		'ge',
		'gt',
		'le',
		'lt',
		'ne'
	];

	private arrayNodeNames = [
		'in', 'out'
	];

	private openKey: string;

	private dialogState = {
		scalar: {
			name: this.scalarNodeNames[0],
			field: '',
			value: ''
		},
		array: {
			name: this.arrayNodeNames[0],
			field: '',
			value: ''
		}
	};

	protected render(): DNode {
		return w(AccordionPane, {
			theme,
			onRequestOpen: (key: string) => {
				this.openKey = key;
				this.invalidate();
			},
			onRequestClose: (key: string) => {
				this.openKey = '';
				this.invalidate();
			},
			openKeys: [this.openKey]
		}, [
			w(TitlePane, {
				theme,
				title: 'Logical Nodes',
				key: '1'
			}, [
				v('div', {classes: modalCss.logicalNodes}, [
					v('button', {
						classes: 'btn btn-sm btn-primary btn-block',
						onclick: () => {
							this.createChildNode('and', {subNodes: []});
						}
					}, [' AND ']),
					v('button', {
						classes: 'btn btn-sm btn-primary btn-block',
						onclick: () => {
							this.createChildNode('or', {subNodes: []});
						}
					}, [' OR '])
				])
			]),
			w(TitlePane, {
				theme,
				title: 'Scalar Nodes',
				key: '2'
			}, [
				v('div', {classes: modalCss.scalarNodes}, [
					w(Select, {
						theme,
						value: this.dialogState.scalar.name,
						options: this.scalarNodeNames,
						onChange: (value: string) => {
							this.dialogState.scalar.name = value;
							this.invalidate();
						}
					}),
					w(TextInput, {
						theme,
						value: this.dialogState.scalar.field,
						placeholder: 'field name',
						onChange: (value: string) => {
							this.dialogState.scalar.field = value;
							this.invalidate();
						}
					}),
					w(TextInput, {
						theme,
						value: this.dialogState.scalar.value,
						placeholder: 'value',
						onChange: (value: string) => {
							this.dialogState.scalar.value = value;
							this.invalidate();
						}
					}),
					v('button', {
						classes: 'btn btn-sm btn-primary btn-block',
						onclick: () => {
							this.createChildNode(this.dialogState.scalar.name, {
								field: this.dialogState.scalar.field,
								value: this.dialogState.scalar.value
							});
						}
					}, ['Create node'])
				])
			]),
			w(TitlePane, {
				theme,
				title: 'Array Nodes',
				key: '3'
			}, [
				v('div', {classes: modalCss.arrayNodes}, [
					w(Select, {
						theme,
						value: this.dialogState.array.name,
						options: this.arrayNodeNames,
						onChange: (value: string) => {
							this.dialogState.array.name = value;
							this.invalidate();
						}
					}),
					w(TextInput, {
						theme,
						value: this.dialogState.array.field,
						placeholder: 'field name',
						onChange: (value: string) => {
							this.dialogState.array.field = value;
							this.invalidate();
						}
					}),
					w(TextInput, {
						theme,
						value: this.dialogState.array.value,
						placeholder: 'values',
						onChange: (value: string) => {
							this.dialogState.array.value = value;
							this.invalidate();
						}
					}),
					v('button', {
						classes: 'btn btn-sm btn-primary btn-block',
						onclick: () => {
							this.createChildNode(this.dialogState.array.name, {
								field: this.dialogState.array.field,
								values: this.dialogState.array.value.split(',')
							});
						}
					}, ['Create node'])
				])
			])
		]);
	}

	private createChildNode(nodeName: string, params: RqlNodeFactoryParams) {
		this.properties.onChildNodeCreate(nodeName, params);
	}
}
