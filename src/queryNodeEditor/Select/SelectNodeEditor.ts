import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import * as css from "../../../styles/select/selectNode.m.css";
import Select from "rollun-ts-rql/dist/nodes/Select";
import ActiveSelectNodesContainer from './ActiveSelectNodes';
import {VNode} from '@dojo/framework/widget-core/interfaces';

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

    render(): VNode {
        return v('div',
            {classes: css.root},
            [
                v('div', {classes: css.controls}, [
                    v('span', {classes: css.title}, ['Select node']),
                    v('button', {
                        classes: 'btn btn-sm btn-danger',
                        onclick: () => this.properties.onRemove()
                    }, ['X'])
                ]),
                v('div',
                    {classes: css.activeNodesContainer}, [
                        w(ActiveSelectNodesContainer, {
                            node: this.properties.node,
                            dragData: this.dragData,
                            onAddField: (fieldName: string) => {
                                this.addFieldToNode(fieldName)
                            }
                        }),
                    ]
                ),
            ]
        )

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
