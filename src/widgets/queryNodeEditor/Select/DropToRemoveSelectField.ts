import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import {v} from '@dojo/framework/widget-core/d';
import * as css from "../../../styles/select/dropToRemoveSelectField.m.css";
import {SelectNodeDragData} from "./SelectNodeEditor";


export interface DropToRemoveSelectFieldProps {
    onRemoveField(fieldName: string): void,

    dragData: SelectNodeDragData,
}

export default class DropToRemoveSelectField extends WidgetBase<DropToRemoveSelectFieldProps> {
    private awaitingDrop = false;
    private validDropTarget = false;

    protected render() {
        let classes = css.root;
        if (this.awaitingDrop === true) {
            classes += this.validDropTarget ? css.validDropTarget : css.invalidDropTarget;
        }
        return v('div',
            {
                classes: classes,
                ondragover: (event: DragEvent) => {
                    this.checkDropPossibility(event)
                },
                ondragleave: (event: DragEvent) => {
                    this.disableDropTarget(event)
                },
                ondrop: (event: DragEvent) => {
                    this.removeDroppedNodeFromSelectedNodes(event)
                }
            },
            ['Drop node here to remove it'])
    }

    private checkDropPossibility(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer.types.indexOf('nodeFieldName') !== -1) {
            this.awaitingDrop = true;
            this.validDropTarget = true;
            this.invalidate();
            return false;
        }
        return true;
    }

    private disableDropTarget(event: DragEvent) {
        this.awaitingDrop = false;
        this.invalidate();
    }

    private removeDroppedNodeFromSelectedNodes(event: DragEvent) {
        this.properties.onRemoveField(event.dataTransfer.getData('nodeFieldName'))
    }


}
