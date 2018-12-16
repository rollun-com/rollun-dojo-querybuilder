import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import {v, w} from "@dojo/framework/widget-core/d";
import AbstractQueryNode from 'rollun-ts-rql/dist/nodes/AbstractQueryNode';
import Select from 'rollun-ts-rql/dist/nodes/Select';
import Sort from 'rollun-ts-rql/dist/nodes/Sort';
import Limit from 'rollun-ts-rql/dist/nodes/Limit';
import SelectNodeEditor from './queryNodeEditor/SelectNodeEditor';
import SortNodeEditor from "./queryNodeEditor/SortNodeEditor";
import LimitNodeEditor from './queryNodeEditor/LimitNodeEditor';
import LogicalNodeEditor from './queryNodeEditor/LogicalNodeEditor';
import And from 'rollun-ts-rql/dist/nodes/logicalNodes/And';
import Query from 'rollun-ts-rql/dist/Query';
import * as css from '../../styles/v2/queryEditor.m.css';

export interface QueryQueryEditorProps {
    query: Query,
    fieldNames: string[]
}

export default class QueryEditor extends WidgetBase<QueryQueryEditorProps> {
    protected render() {
        return v('div', {classes: css.root}, [
            this.renderSelectNode(this.properties.query.selectNode),
            this.renderSortNode(this.properties.query.sortNode),
            this.renderLimitNode(this.properties.query.limitNode),
            this.renderQueryNode(this.properties.query.queryNode),
        ])
    }

    private renderSelectNode(node: (Select | undefined)) {
        if (node) {
            const onRemove = () => {this.removeNode('select')};
            return w(SelectNodeEditor, {node, onRemove});
        }
        else return v('button', {onclick: () => this.addSelectNode()}, ['Add select node'])
    }

    private addSelectNode() {
        this.properties.query.selectNode = new Select(['id']);
        this.invalidate()
    }

    private renderSortNode(node: Sort) {
        if (node) {
            const onRemove = () => {this.removeNode('sort')};
            return w(SortNodeEditor, {node, onRemove})
        }
        else return v('button', {onclick: () => this.addSortNode()}, ['Add sort node'])
    }

    private addSortNode() {
        this.properties.query.sortNode = new Sort({id: 1});
        this.invalidate()
    }

    private renderLimitNode(node: Limit) {
        if (node) {
            const onRemove = () => {this.removeNode('limit')};
            return w(LimitNodeEditor, {node, onRemove})
        }
        else return v('button', {onclick: () => this.addLimitNode()}, ['Add limit node'])
    }

    private addLimitNode() {
        this.properties.query.limitNode = new Limit(20,0);
        this.invalidate()
    }

    private renderQueryNode(node: AbstractQueryNode) {
        if (node) {
            return w(LogicalNodeEditor, {
                id: 1, onRemove: () => {
                    this.removeNode('query')
                }, fieldNames: this.properties.fieldNames, node: new And([node])
            })
        }
        else return v('button', {onclick: () => this.addQueryNode()}, ['Add query node'])
    }

    private addQueryNode() {
        this.properties.query.queryNode = new And([]);
        this.invalidate()
    }

    private removeNode(queryNodeName: ('select' | 'sort' | 'limit' | 'query')) {
        switch (true) {
            case queryNodeName === 'select': {
                this.properties.query.selectNode = undefined;
                break;
            }
            case queryNodeName === 'sort': {
                this.properties.query.sortNode = undefined;
                break;
            }
            case queryNodeName === 'limit': {
                this.properties.query.limitNode = undefined;
                break;
            }
            case queryNodeName === 'query': {
                this.properties.query.queryNode = undefined;
                break;
            }
        }
        this.invalidate();
    }
}
