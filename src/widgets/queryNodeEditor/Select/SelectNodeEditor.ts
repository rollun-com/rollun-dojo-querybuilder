import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import * as css from "../../../styles/select/selectNode.m.css";
import Select from "rollun-ts-rql/dist/nodes/Select";
import ActiveSelectNodesContainer from './ActiveSelectNodes';
import PossibleSelectNodes from './PossibleSelectNodes';
import DropToRemoveSelectField from "./DropToRemoveSelectField";

export interface SelectNodeDragData {
    fieldName: string
}

export interface SelectNodeProps {
    node: Select,
    fieldNames: string[],

    onSelectNodeChange(fields: string[]): void,

    onRemove(): void,
}

export default class SelectNodeEditor extends WidgetBase<SelectNodeProps> {
    private dragData: SelectNodeDragData = {
        fieldName: ''
    };

    render() {
        return v('div',
            {classes: css.root},
            [
                v('div',
                    {classes: css.removeAreaContainer}, [
                        w(DropToRemoveSelectField, {
                            dragData: this.dragData,
                            onRemoveField: (fieldName: string) => {
                                this.removeFieldFromNode(fieldName)
                            }
                        })
                    ]
                ),
                v('div',
                    {classes: css.activeNodesContainer}, [
                        w(ActiveSelectNodesContainer, {
                            node: this.properties.node,
                            dragData: this.dragData,
                            onAddField: (fieldName: string) => {
                                this.addFieldToNode(fieldName)
                            }
                        }),
                    ]),
                v('div',
                    {classes: css.possibleNodesContainer}, [
                        w(PossibleSelectNodes, {
                            fieldNames: this.properties.fieldNames,
                            dragData: this.dragData
                        }),
                    ])
            ]
        )

    }

    removeFieldFromNode(fieldName: string) {
        const fieldNameIndex = this.properties.node.fields.indexOf(fieldName);
        if (fieldNameIndex !== -1) {
            this.properties.node.fields.splice(fieldNameIndex, 1);
            this.properties.onSelectNodeChange([...this.properties.node.fields]);
        }
    }

    addFieldToNode(fieldName: string) {
        // if node is already present, remove it and add it to the end
        const fieldNameIndex = this.properties.node.fields.indexOf(fieldName);
        if (fieldNameIndex !== -1) {
            this.properties.node.fields.splice(fieldNameIndex, 1);
        }
        this.properties.node.fields.push(fieldName);
        this.properties.onSelectNodeChange([...this.properties.node.fields]);
    }
}
