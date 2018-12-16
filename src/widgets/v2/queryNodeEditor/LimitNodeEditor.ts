import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import Limit from 'rollun-ts-rql/dist/nodes/Limit';
import {v, w} from "@dojo/framework/widget-core/d";
import TextInput from '@dojo/widgets/text-input';
import * as css from "../../../styles/v2/limitNode.m.css";

export interface LimitNodeEditorProps {
    node: Limit,
    onRemove(): void,
}

export default class LimitNodeEditor extends WidgetBase<LimitNodeEditorProps> {
    render() {
        return v('div', {classes: css.root}, [
            v('div', {}, ['Limit']),
            w(TextInput, {
                value: String(this.properties.node.limit),
                onChange: (value: string) => {
                    this.properties.node.limit = parseInt(value, 10);
                    this.invalidate();
                }
            }),
            v('div', {}, ['Offset']),
            w(TextInput, {
                value: String(this.properties.node.limit),
                onChange: (value: number) => {
                    this.properties.node.offset = value;
                    this.invalidate();
                }
            }),
            v('button', {onclick: () => {this.properties.onRemove()}}, ['X'])
        ])
    }
}
