import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import Sort from 'rollun-ts-rql/dist/nodes/Sort';
import * as css from "../../../styles/v2/sortNode.m.css";
import {v, w} from '@dojo/framework/widget-core/d';
import {VNode} from '@dojo/framework/widget-core/interfaces';
import TextInput from '@dojo/widgets/text-input';

export interface SortNodeEditorProps {
    node: Sort,

    onRemove(): void,
}

export default class SortNodeEditor extends WidgetBase<SortNodeEditorProps> {
    protected render() {
        return v('div', {classes: css.sort}, [
            v('div', {}, ['Sort fields']),
            v('ul', {},
                this.renderSortEditors()
            ),
            v('button', {
                classes: css.addNewOptionBtn, onclick: () => {
                    this.addNewSortOption()
                }
            }, ['Add new sort option']),
            v('button', {
                onclick: () => {
                    this.properties.onRemove()
                }
            }, ['X'])

        ])
    }

    private renderSortEditors(): VNode[] {
        const result: VNode[] = [];
        Object.entries(this.properties.node.sortOptions).forEach((entry) => {
            const [field, sortDirection] = entry;
            const sortNode = v('div', {classes: css.sortRow}, [
                w(TextInput, {
                    value: field,
                    onChange: (value: string) => {
                        const sortDirection = this.properties.node.sortOptions[field];
                        delete this.properties.node.sortOptions[field];
                        this.properties.node.sortOptions[value] = sortDirection;
                        this.invalidate();

                    }
                }),
                v('button', {
                        onclick: () => {
                            this.properties.node.sortOptions[field] = this.properties.node.sortOptions[field] * -1;
                            this.invalidate();
                        }
                    },
                    [sortDirection === -1 ? 'asc' : 'desc']
                ),
                v('button', {
                    onclick: () => {
                        delete this.properties.node.sortOptions[field];
                        this.invalidate();
                    }
                }, ['X'])
            ]);
            result.push(sortNode);
        });
        return result;
    }

    private addNewSortOption(): undefined {
        this.properties.node.sortOptions.chageme = 1;
        this.invalidate();
        return undefined;
    }
}
