import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import NodeFieldName from './NodeFieldName';
import * as css from '../../styles/nodeFieldNames/possibleFieldNames.m.css';
import { VNode } from '@dojo/framework/widget-core/interfaces';

export interface PossibleNodeFieldsContainerProps {
	fieldNames: string[];
}

export default class PossibleNodeFields extends WidgetBase<PossibleNodeFieldsContainerProps> {
	private fieldNames: string[] = [];
	private isStarted = false;
	protected render(): VNode {
		if (!this.isStarted) {
			this.fieldNames = this.properties.fieldNames;
			this.isStarted = true;
		}
		return v('div', {classes: css.root}, [
			v('div', {classes: css.title}, ['Possible node fields']),
			v('div', {classes: css.possibleNodes}, this.fieldNames.map(
				(fieldName) => {
					return w(NodeFieldName, {fieldName});
				}
			))
		]);
	}
}
