import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import {v, w} from '@dojo/framework/widget-core/d';
import {VNode} from "@dojo/framework/widget-core/interfaces";
import * as css from "../../styles/arrayNode.m.css";
import Select from "@dojo/widgets/select";
import TextInput from "@dojo/widgets/text-input";
import AbstractArrayNode from 'rollun-ts-rql/dist/nodes/arrayNodes/AbstractArrayNode';
import theme from "@dojo/themes/dojo";

export interface ArrayNodeProps {
    id: number,
    node: AbstractArrayNode,
    fieldNames: string[],

    onRemove(id: number): void,
}

interface OptionData {
    disabled: boolean;
    label: string;
    value: string;
}

export default class ArrayNodeEditor extends WidgetBase<ArrayNodeProps> {
    protected render(): VNode {
        //const fieldOptions: string[] = this.properties.fieldNames;
        const fieldOptions: OptionData[] = this.properties.fieldNames.map((item) => {
            return {disabled: false, label: item, value: item}
        });
        const nodeValueEditorText = this.properties.node.values.join();
        return v('div', {classes: css.root},
            [
                w(Select, {
                    useNativeElement: true,
                    theme,
                    options: fieldOptions,
                    value: this.properties.node.field,
                    getOptionDisabled: (option: OptionData) => option.disabled,
                    getOptionLabel: (option: OptionData) => option.label,
                    getOptionValue: (option: OptionData) => option.value,
                    getOptionSelected: (option: OptionData) => option.value === this.properties.node.field,
                    onChange: (option: OptionData) => {
                        this.properties.node.field = option.value;
                        this.invalidate()
                    }
                }),
                v('span', {}, [this.getHumanNodeName(this.properties.node.name)]),
                w(TextInput, {
                    theme,
                    placeholder: 'Enter value',
                    value: nodeValueEditorText,
                    onChange: (value: string) => {
                        this.properties.node.values = value.split(',');
                        this.invalidate();
                    }
                }),
                v('button', {
                        classes: css.removeButton + ' mx-2',
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

