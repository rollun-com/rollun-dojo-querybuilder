import {v, w} from "@dojo/framework/widget-core/d";
import * as css from "../../../styles/select/activeSelectNodes.m.css";
import SelectNodeField from "./SelectNodeField";
import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import Select from 'rollun-ts-rql/dist/nodes/Select';
import {SelectNodeDragData} from "./SelectNodeEditor";

export interface ActiveSelectNodesContainerProps {
    node: Select,
    dragData: SelectNodeDragData,
    onAddField(fieldName: string): void
}

export default class ActiveSelectNodes extends WidgetBase<ActiveSelectNodesContainerProps> {
    private awaitingDrop: boolean = false;
    private validDropTarget: boolean = false;

    protected render() {
        let classes = css.root + ' ';
        if (this.awaitingDrop) {
            classes += this.validDropTarget ? css.validDropTarget + ' ' : css.invalidDropTarget + ' '
        }
        return v('div',
            {
                classes: classes,
                ondragover: (event: DragEvent) => {
                    this.checkDropPossibility(event)
                },
                ondragleave: (event: DragEvent) => {
                    this.disableDropTarget()
                },
                ondrop: (event: DragEvent) => {
                    this.addDroppedNodeToSelectedNodes()
                }
            },
            [
                v('div', {classes: css.title}, ['Active select nodes']),
                v('div',
                    {},
                    this.properties.node.fields.map(
                        (fieldName) => {
                            return w(SelectNodeField, {fieldName, dragData: this.properties.dragData})
                        }
                    )
                )
            ]
        )
    }

    private checkDropPossibility(event: DragEvent) {
        event.preventDefault();
        const dragData = this.properties.dragData.fieldName;
        this.awaitingDrop = true;
        if (dragData && dragData.length > 0) {
            this.validDropTarget = true;
            return false;
        }
        this.invalidate();
        return true;
    }

    private disableDropTarget() {
        this.awaitingDrop = false;
        this.validDropTarget = false;
        this.invalidate();
    }

    private addDroppedNodeToSelectedNodes() {
        this.properties.onAddField(this.properties.dragData.fieldName);
        this.disableDropTarget();
    }

}
