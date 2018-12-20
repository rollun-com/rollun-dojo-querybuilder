import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import NodeFieldName from './NodeFieldName';
import * as css from "../../styles/nodeFieldNames/possibleFieldNames.m.css";

export interface PossibleNodeFieldsContainerProps {
    fieldNames: string[],
}

export default class PossibleNodeFields extends WidgetBase<PossibleNodeFieldsContainerProps> {
    protected render() {
        return v('div', {classes: css.root}, [
            v('div', {classes: css.title}, ['Possible node fields']),
            v('div', {classes: css.possibleNodes}, this.properties.fieldNames.map(
                (fieldName) => {
                    return w(NodeFieldName, {fieldName})
                }
            ))
        ])
    }
}
