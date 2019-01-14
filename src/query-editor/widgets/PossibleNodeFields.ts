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
		if (!this.isStarted && this.properties.fieldNames.length > 0) {
			this.fieldNames = this.properties.fieldNames;
			this.isStarted = true;
		}
		return v('div', {classes: css.root + ' card m-1'}, [
			v('div', {classes: 'card-body p-2'}, [
				v('div', {classes: css.title + ' card-title'}, ['Possible node fields']),
				v('div', {classes: css.possibleNodes  + ' card-text'}, this.fieldNames.map(
					(fieldName) => {
						return w(NodeFieldName, {fieldName});
					}
				))
			])
		]);
	}
}
