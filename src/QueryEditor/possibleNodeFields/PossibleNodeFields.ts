import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import NodeFieldName from '../nodeFieldName/NodeFieldName';
import * as css from './possibleNodeFields.m.css';
import { VNode } from '@dojo/framework/widget-core/interfaces';
import * as bs from 'rollun-common/dist/css/bootstrap.m.css';
import * as commonCss from '../common/common.m.css';

export interface PossibleNodeFieldsContainerProps {
	fieldNames: string[];
}

export default class PossibleNodeFields extends WidgetBase<PossibleNodeFieldsContainerProps> {
	private fieldNames: string[] = [];
	private isStarted = false;

	protected render(): VNode {
		if (!this.isStarted && this.properties.fieldNames && this.properties.fieldNames.length > 0) {
			this.fieldNames = this.properties.fieldNames;
			this.isStarted = true;
		}
		return v('div',
			{classes: `${bs.dFlex} ${bs.flexColumn} ${bs.h100} ${bs.card} ${bs.m1} ${commonCss.transparentBorder} ${css.root}`},
			[
				v('div',
					{classes: `${bs.cardBody} ${bs.p3} ${bs.border}`},
					[
						v('div',
							{classes: `${bs.cardTitle} ${css.title}`},
							['Possible fields']
						),
						v('div',
							{classes: `${bs.dFlex} ${bs.flexColumn} ${bs.cardText} ${css.possibleNodes}`},
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
