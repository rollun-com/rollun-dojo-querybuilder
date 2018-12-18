import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import {v, w} from '@dojo/framework/widget-core/d';
import {VNode} from "@dojo/framework/widget-core/interfaces";
import * as css from "../../styles/scalarNode.m.css";
import Select from "@dojo/widgets/select";
import TextInput from "@dojo/widgets/text-input";
import AbstractScalarNode from 'rollun-ts-rql/dist/nodes/scalarNodes/AbstractScalarNode';
import AbstractArrayNode from 'rollun-ts-rql/dist/nodes/arrayNodes/AbstractArrayNode';

export interface ScalarNodeProps {
    id: number,
    node: (AbstractScalarNode | AbstractArrayNode),
    fieldNames: string[],

    onRemove(id: number): void,
}

export default class ScalarNodeEditor extends WidgetBase<ScalarNodeProps> {
    protected render(): VNode {
        const fieldOptions: string[] = this.properties.fieldNames;
        const nodeValueEditorText = (this.properties.node instanceof AbstractScalarNode)
            ? String(this.properties.node.value)
            : this.properties.node.values.join();
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
                        (this.properties.node instanceof AbstractScalarNode)
                            ? this.properties.node.value = value
                            : this.properties.node.values = value.split(',');
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

