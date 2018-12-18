import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import {v} from '@dojo/framework/widget-core/d';
import * as css from "../../../styles/select/dropToRemoveSelectField.m.css";


export interface DropToRemoveSelectFieldProps {
    onRemoveField(fieldNamme: string): void
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
                ondragleave: () => {
                    this.disableDropTarget()
                },
                ondrop: (event: DragEvent) => {
                    this.removeDroppedNodeFromSelectedNodes(event)
                }
            },
            ['Drop node here to remove it'])
    }

    private checkDropPossibility(event: DragEvent) {
        const dragDataString = event.dataTransfer.getData('application/json');
        if (dragDataString && (JSON.parse(dragDataString).type === 'selectNode')) {
            event.preventDefault();
            this.awaitingDrop = true;
            this.validDropTarget = true;
            this.invalidate();
        }
    }

    private disableDropTarget() {
        this.awaitingDrop = false;
        this.invalidate();
    }

    private removeDroppedNodeFromSelectedNodes(event: DragEvent) {
        const dragDataString = event.dataTransfer.getData('application/json');
        const dragData = JSON.parse(dragDataString);
        this.properties.onRemoveField(dragData.fieldName)
    }


}
