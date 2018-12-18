import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import * as css from "../../../styles/select/selectNode.m.css";
import Select from "rollun-ts-rql/dist/nodes/Select";
import ActiveSelectNodesContainer from './ActiveSelectNodesContainer';
import PossibleSelectNodesContainer from './PossibleSelectNodesContainer';

export interface SelectNodeProps {
    node: Select,
    fieldNames: string[],

    onRemove(): void,
}

export default class SelectNodeEditor extends WidgetBase<SelectNodeProps> {
    render() {
        return v('div',
            {classes: css.root}, [
                w(ActiveSelectNodesContainer, {}),
                w(PossibleSelectNodesContainer, {},
            ]
        );

    }

    removeFieldFromNode(fieldName: string) {

    }

    addFieldToNode(fieldName: string) {
        this.properties.node.fields.push(fieldName);
        this.invalidate();
    }
}
