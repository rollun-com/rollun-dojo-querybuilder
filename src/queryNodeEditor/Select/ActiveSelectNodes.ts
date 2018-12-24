import {v, w} from "@dojo/framework/widget-core/d";
import * as css from "../../../styles/select/activeSelectNodes.m.css";
import NodeFieldName from "../NodeFieldName";
import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import Select from 'rollun-ts-rql/dist/nodes/Select';
import {SelectNodeDragData} from "./SelectNodeEditor";
import {VNode} from "@dojo/framework/widget-core/interfaces";

export interface ActiveSelectNodesContainerProps {
    node: Select,
    dragData: SelectNodeDragData,

    onAddField(fieldName: string): void
}

export default class ActiveSelectNodes extends WidgetBase<ActiveSelectNodesContainerProps> {
    private awaitingDrop: boolean = false;
    private validDropTarget: boolean = false;

    protected render(): VNode {
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
                    this.addDroppedNodeToSelectedNodes(event)
                }
            },
            [
                v('div', {
                    classes: css.title
                }, ['Active select nodes']),
                v('div',
                    {classes: css.activeSelectNodes},
                    this.properties.node.fields.map(
                        (fieldName) => {
                            return w(NodeFieldName, {fieldName, isActive: true, nodeType: 'selectnode'})
                        }
                    )
                )
            ]
        )
    }

    private checkDropPossibility(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer.types.indexOf('nodefieldname') !== -1) {
            this.awaitingDrop = true;
            this.validDropTarget = true;
            this.invalidate();
            return false;
        }
        return true;
    }

    private disableDropTarget() {
        this.awaitingDrop = false;
        this.validDropTarget = false;
        this.invalidate();
    }

    private addDroppedNodeToSelectedNodes(event: DragEvent) {
        this.properties.onAddField(event.dataTransfer.getData('nodefieldname'));
        this.disableDropTarget();
    }

}
