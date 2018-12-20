import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import Limit from 'rollun-ts-rql/dist/nodes/Limit';
import {v, /*w*/} from "@dojo/framework/widget-core/d";
//import TextInput from '@dojo/widgets/text-input';
import * as css from "../../styles/limitNode.m.css";

export interface LimitNodeEditorProps {
    node: Limit,

    onRemove(): void,
}

export default class LimitNodeEditor extends WidgetBase<LimitNodeEditorProps> {
    render() {
        return v('div', {classes: css.root}, [
            v('div', {classes: css.titleRow}, [
                v('span', {}, ['Limit node']),
                v('button', {
                    onclick: () => {
                        this.properties.onRemove()
                    }
                }, ['X'])
            ]),
            v('div', {classes: css.editorsContainer}, [
                v('div', {classes: css.limitEditorRow}, [
                    v('div', {classes: css.editorItem}, ['Limit']),
                    v('input', {
                        classes: css.editorItem,
                        type: 'number',
                        value: String(this.properties.node.limit),
                        onChange: (value: number) => {
                            this.properties.node.limit = value;
                            this.invalidate();
                        }
                    }),
                ]),
                v('div', {classes: css.limitEditorRow}, [
                    v('div', {classes: css.editorItem}, ['Offset']),
                    v('input', {
                        type: 'number',
                        classes: css.editorItem,
                        value: String(this.properties.node.limit),
                        onChange: (value: number) => {
                            this.properties.node.offset = value;
                            this.invalidate();
                        }
                    }),
                ]),
            ])
        ])
    }
}
