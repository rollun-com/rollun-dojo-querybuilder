import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import {v} from "@dojo/framework/widget-core/d";
import * as css from "../../../styles/select/selectNodeField.m.css";
import {SelectNodeDragData} from "./SelectNodeEditor";

export interface SelectFieldProps {
    fieldName: string,
    dragData: SelectNodeDragData
}

export default class SelectNodeField extends WidgetBase<SelectFieldProps> {
    render() {
        return v('div', {
                draggable: true,
                ondragstart: (event: DragEvent) => {
                    this.handleDragStart(event)
                },
                classes: css.root,
            },
            [`${this.properties.fieldName}`])
    }

    private handleDragStart(event: DragEvent) {
        event.dataTransfer.setData("nodeFieldName", this.properties.fieldName);
    }
}
