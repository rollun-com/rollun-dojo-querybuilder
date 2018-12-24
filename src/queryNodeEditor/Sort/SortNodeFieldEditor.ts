import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v} from "@dojo/framework/widget-core/d";
import * as css from "../../../styles/sort/sortFieldEditor.m.css";
import {VNode} from '@dojo/framework/widget-core/interfaces';

export interface SortFieldEditorProps {
    fieldName: string,
    sortDirection: (-1 | 1),

    onSortDirectionChange(fieldName: string, sortDirection: (-1 | 1)): void
}

export default class SortNodeFieldEditor extends WidgetBase<SortFieldEditorProps> {
    protected render(): VNode {
        const {fieldName, sortDirection, onSortDirectionChange} = this.properties;
        return v('div',
            {
                classes: css.sortRow,
                draggable: true,
                ondragstart: (event: DragEvent) => {
                    this.handleDragStart(event)
                }
            },
            [
                v('div', {
                    classes: css.sortFieldName,
                }, [fieldName]),
                v('button', {
                        classes: css.changeSortDirectionButton,
                        onclick: () => {
                            onSortDirectionChange(fieldName, (sortDirection === -1 ? 1 : -1))
                        }
                    },
                    [sortDirection === -1 ? 'asc' : 'desc']
                ),
            ]);
    }

    private handleDragStart(event: DragEvent) {
        event.dataTransfer.setData('nodefieldname', this.properties.fieldName)
    }
}
