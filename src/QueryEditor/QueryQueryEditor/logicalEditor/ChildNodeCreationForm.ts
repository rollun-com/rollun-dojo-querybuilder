import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { RqlNodeFactoryParams } from '../../../rqlNodeFactory/RqlNodeFactory';
import { v, w } from '@dojo/framework/widget-core/d';
import * as modalCss from './logicalNodeModal.m.css';
import AccordionPane from '@dojo/widgets/accordion-pane';
import TitlePane from '@dojo/widgets/title-pane';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import * as bootstrap from 'rollun-common/dist/css/bootstrap.m.css';

export interface ChildNodeCreationFormProps {
	fieldNames: string[];

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
		this.dialogState.scalar.field = this.properties.fieldNames[0];
		this.dialogState.array.field = this.properties.fieldNames[0];
		return w(AccordionPane, {
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
					extraClasses: {
						title: '',
						root: `${bootstrap.overflowHidden}`,
						titleButton: `${bootstrap.btn} ${bootstrap.btnLight} ${bootstrap.w100} ${bootstrap.dropdownToggle} ${bootstrap.positionRelative}`
					},
					title: 'Logical Nodes',
					key: '1'
				},
				[
					v('div', {classes: modalCss.logicalNodes},
						[
							v('button', {
								classes: `${bootstrap.btn} ${bootstrap.btnSm} ${bootstrap.btnPrimary} ${bootstrap.btnBlock}`,
								onclick: () => {
									this.createChildNode('and', {subNodes: []});
								}
							}, [' AND ']),
							v('button',
								{
									classes: `${bootstrap.btn} ${bootstrap.btnSm} ${bootstrap.btnPrimary} ${bootstrap.btnBlock}`,
									onclick: () => {
										this.createChildNode('or', {subNodes: []});
									}
								},
								[' OR ']
							)
						]
					)
				]),
			w(TitlePane, {
				extraClasses: {
					title: '',
					root: `${bootstrap.overflowHidden}`,
					titleButton: `${bootstrap.btn} ${bootstrap.btnLight} ${bootstrap.w100} ${bootstrap.dropdownToggle} ${bootstrap.positionRelative}`
				},
				title: 'Scalar Nodes',
				key: '2'
			}, [
				v('div', {classes: modalCss.scalarNodes}, [
					v('div', {classes: bootstrap.mb2}, [
						v('select',
							{
								classes: bootstrap.customSelect,
								onchange: (event: Event) => {
									// @ts-ignore
									this.dialogState.scalar.name = event.target.value;
								}
							},
							this.scalarNodeNames.map((nodeName) => v('option', {value: nodeName}, [nodeName]))
						)
					]),
					v('div', {classes: bootstrap.mb2}, [
						v('select',
							{
								classes: bootstrap.customSelect
							},
							this.properties.fieldNames.map((fieldName) => v('option', {value: fieldName}, [fieldName]))
						)
					]),
					v('div', {classes: bootstrap.mb2}, [
						v('input',
							{
								type: 'text',
								classes: bootstrap.formControl,
								value: this.dialogState.scalar.value,
								onchange: (event: Event) => {
									// @ts-ignore
									this.dialogState.scalar.value = event.target.value;
									this.invalidate();
								}
							}
						)
					]),
					v('button', {
						classes: `${bootstrap.btn} ${bootstrap.btnSm} ${bootstrap.btnPrimary} ${bootstrap.btnBlock}`,
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
				extraClasses: {
					title: '',
					root: `${bootstrap.overflowHidden}`,
					titleButton: `${bootstrap.btn} ${bootstrap.btnLight} ${bootstrap.w100} ${bootstrap.dropdownToggle} ${bootstrap.positionRelative}`
				},
				title: 'Array Nodes',
				key: '3'
			}, [
				v('div', {classes: modalCss.arrayNodes}, [
					v('div', {classes: bootstrap.mb2}, [
						v('select',
							{
								classes: bootstrap.customSelect,
								onChange: (event: Event) => {
									// @ts-ignore
									this.dialogState.array.name = event.target.value;
								}
							},
							this.arrayNodeNames.map((nodeName) => v('option', {value: nodeName}, [nodeName]))
						)
					]),
					v('div', {classes: bootstrap.mb2}, [
						v('select',
							{
								classes: bootstrap.customSelect,
								onChange: (event: Event) => {
									// @ts-ignore
									this.dialogState.array.field = event.target.value;
								}
							},
							this.properties.fieldNames.map((nodeName) => v('option', {value: nodeName}, [nodeName]))
						)
					]),
					v('div', {classes: bootstrap.mb2}, [
						v('input',
							{
								type: 'text',
								classes: bootstrap.formControl,
								value: this.dialogState.array.value,
								onchange: (event: Event) => {
									// @ts-ignore
									this.dialogState.array.value = event.target.value;
									this.invalidate();
								}
							}
						)
					]),
					v('button', {
						classes: `${bootstrap.btn} ${bootstrap.btnSm} ${bootstrap.btnPrimary} ${bootstrap.btnBlock}`,
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
