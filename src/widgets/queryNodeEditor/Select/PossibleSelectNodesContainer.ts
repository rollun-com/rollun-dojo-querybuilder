import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import SelectNodeField from './SelectNodeField';
import * as css from "../../../styles/select/possibleSelectNodes.m.css";


export interface PossibleSelectNodesContainerProps {
    fieldNames: string[],
}

export default class PossibleSelectNodesContainer extends WidgetBase<PossibleSelectNodesContainerProps> {
    protected render() {
        return v('div', {classes: css.root},
            this.properties.fieldNames.map((fieldName) => {
                return w(SelectNodeField, {fieldName})
            })
        )
    }
}
