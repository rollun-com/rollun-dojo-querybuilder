import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import NodeFieldName from '../nodeFieldName/NodeFieldName';
import * as css from './possibleFieldNames.m.css';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import * as bootstrap from 'rollun-common/dist/css/bootstrap.m.css';

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
		return v('div',
			{classes: `${css.root} ${bootstrap.card} ${bootstrap.m1}`},
			[
				v('div',
					{classes: `${bootstrap.cardBody} ${bootstrap.p3} ${bootstrap.border}`},
					[
						v('div',
							{classes: `${css.title} ${bootstrap.cardTitle}`},
							['Possible fields']
						),
						v('div',
							{classes: `${css.possibleNodes} ${bootstrap.cardText}`},
							this.fieldNames.map(
								(fieldName) => {
									return w(NodeFieldName, {fieldName});
								}
							)
						)
					]
				)
			]
		);
	}
}
