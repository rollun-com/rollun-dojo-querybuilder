import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import {v, w} from '@dojo/framework/widget-core/d';
import {VNode} from "@dojo/framework/widget-core/interfaces";
import * as css from "../../../styles/v2/arrayNode.m.css";
import Select from "@dojo/widgets/select";
import TextInput from "@dojo/widgets/text-input";
import AbstractArrayNode from 'rollun-ts-rql/dist/nodes/arrayNodes/AbstractArrayNode';

export interface ArrayNodeProps {
    id: number,
    node: AbstractArrayNode,
    fieldNames: string[],

    onRemove(id: number): void,
}

export default class ArrayNodeEditor extends WidgetBase<ArrayNodeProps> {
    protected render(): VNode {
        const fieldOptions: string[] = this.properties.fieldNames;
        const nodeValueEditorText = this.properties.node.values.join();
        return v('div', {classes: css.root},
            [
                w(Select, {
                    placeholder: 'Select field',
                    options: fieldOptions,
                    value: this.properties.node.field,
                    onChange: (value: string) => {
                        this.properties.node.field = value;
                        this.invalidate()
                    }
                }),
                v('span', {}, [this.getHumanNodeName(this.properties.node.name)]),
                w(TextInput, {
                    placeholder: 'Enter value',
                    value: nodeValueEditorText,
                    onChange: (value: string) => {
                        this.properties.node.values = value.split(',');
                        this.invalidate();
                    }
                }),
                v('button', {
                        classes: css.removeButton,
                        onclick: () => {
                            this.remove(this.properties.id)
                        },
                    },
                    ['X']
                )
            ]
        );
    }

    private remove(id: number) {
        this.properties.onRemove(id)
    }

    private getHumanNodeName(nodeName: string) {
        return nodeName;
    }

}

