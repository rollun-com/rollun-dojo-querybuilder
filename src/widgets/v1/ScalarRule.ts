import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from "@dojo/framework/widget-core/d";
import * as css from '../../styles/v1/rule.m.css';
import Select from "@dojo/widgets/select";
import TextInput from "@dojo/widgets/text-input";
import {VNode} from '@dojo/framework/widget-core/interfaces';

export interface RuleProps {
    onRemove(id: string): void,

    onUpdate(id: string, updateData: Partial<ScalarRuleState>): void

    id: string,
    fieldNames: string[],
    operators: string[],
    state: ScalarRuleState
}

export interface ScalarRuleState {
    fieldName: string,
    value: string,
    operatorName: string
}

export default class ScalarRule extends WidgetBase<RuleProps> {

    protected render(): VNode {
        const fieldOptions: string[] = this.properties.fieldNames;
        const operatorOptions: string[] = this.properties.operators;
        const {fieldName, operatorName, value} = this.properties.state;
        return v('div', {classes: css.rule},
            [
                w(Select, {
                    placeholder: 'Select field',
                    options: fieldOptions,
                    value: fieldName,
                    onChange: (value: string) => {
                        this.updateRule({fieldName: value});
                        this.invalidate()
                    }
                }),
                w(Select, {
                    placeholder: 'Select operator',
                    options: operatorOptions,
                    value: operatorName,
                    onChange: (value: string) => {
                        this.updateRule({operatorName: value});
                    }
                }),
                w(TextInput, {
                    placeholder: 'Enter value',
                    value: value,
                    onChange: (value: string) => {
                        this.updateRule({value: value});
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

    private remove(id: string) {
        this.properties.onRemove(id)
    }

    private updateRule(data: Partial<ScalarRuleState>) {
        this.properties.onUpdate(this.properties.id, data);
        this.invalidate();
    }
}
