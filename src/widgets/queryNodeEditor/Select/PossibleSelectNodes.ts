import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import SelectNodeField from './SelectNodeField';
import * as css from "../../../styles/select/possibleSelectNodes.m.css";
import {SelectNodeDragData} from "./SelectNodeEditor";


export interface PossibleSelectNodesContainerProps {
    fieldNames: string[],
    dragData: SelectNodeDragData
}

export default class PossibleSelectNodes extends WidgetBase<PossibleSelectNodesContainerProps> {
    protected render() {
        return v('div', {classes: css.root}, [
            v('div', {classes: css.title}, ['Possible select nodes']),
            v('div', {}, this.properties.fieldNames.map(
                (fieldName) => {
                    return w(SelectNodeField, {fieldName, dragData: this.properties.dragData})
                }
            ))
        ])
    }
}
