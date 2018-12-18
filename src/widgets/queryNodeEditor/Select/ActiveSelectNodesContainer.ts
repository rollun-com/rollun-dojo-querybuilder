import {v, w} from "@dojo/framework/widget-core/d";
import * as css from "../../../styles/select/activeSelectNodes.m.css";
import SelectNodeField from "./SelectNodeField";
import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import Select from 'rollun-ts-rql/dist/nodes/Select';

export interface ActiveSelectNodesContainerProps {
    node: Select,
}

export default class ActiveSelectNodes extends WidgetBase<ActiveSelectNodesContainerProps> {
    render() {
        return v('div',
            {
                classes: css.root,
            },
            this.properties.node.fields.map(
                (fieldName) => {
                    return w(SelectNodeField, {fieldName})
                }
            )
        )
    }
}
