import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import {v} from "@dojo/framework/widget-core/d";
import * as css from "../../styles/select/selectNodeField.m.css";

export interface SelectFieldProps {
    fieldName: string,
}

export default class SelectNodeField extends WidgetBase<SelectFieldProps> {
    render() {
        return v('div', {
            draggable: true,
            ondragstart: this.handleDragStart,
            classes: css.root,
        },
            [`${this.properties.fieldName}`])
    }

    private handleDragStart(event: DragEvent) {
        const serializedData = JSON.stringify({type: 'selectNode', fieldName: this.properties.fieldName});
        event.dataTransfer.setData("application/json", serializedData);
    }
}
