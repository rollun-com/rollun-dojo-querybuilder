import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import * as css from "../../../styles/v2/selectNode.m.css";
import TextInput from '@dojo/widgets/text-input';
import Select from "rollun-ts-rql/dist/nodes/Select";

export interface SelectNodeProps {
    node: Select,
    onRemove(): void,
}

export default class SelectNodeEditor extends WidgetBase<SelectNodeProps> {
    render() {
        return v('div', {classes: css.root}, [
            v('div', {}, ['Select fields']),
            w(TextInput, {
                placeholder: 'Enter value',
                value: this.properties.node.fields.join(),
                onChange: (value: string) => {
                    this.properties.node.fields = value.split(',');
                    this.invalidate();
                }
            }),
            v('button', {onclick: ()=> {this.properties.onRemove()}}, ['X'])
        ])
    }
}
