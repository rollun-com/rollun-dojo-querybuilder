import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from "@dojo/framework/widget-core/d";
import AbstractLogicalNode from 'rollun-ts-rql/dist/nodes/logicalNodes/AbstractLogicalNode';
import AbstractQueryNode from 'rollun-ts-rql/dist/nodes/AbstractQueryNode';
import ScalarNodeEditor from "./ScalarNodeEditor";
import AbstractScalarNode from 'rollun-ts-rql/dist/nodes/scalarNodes/AbstractScalarNode';
import ArrayNodeEditor from "./ArrayNodeEditor";
import AbstractArrayNode from 'rollun-ts-rql/dist/nodes/arrayNodes/AbstractArrayNode';
import * as css from "../../styles/logical/logicalNode.m.css";
import * as modalCss from "../../styles/logical/logicalNodeModal.m.css";
import Dialog from "@dojo/widgets/dialog";
import theme from '@dojo/themes/dojo';
import {VNode} from '@dojo/framework/widget-core/interfaces';
import RqlNodeFactory, {RqlNodeFactoryParams} from "../RqlNodeFactory";
import Select from "@dojo/widgets/select";
import TextInput from "@dojo/widgets/text-input";

export interface LogicalNodeProps {
    id: number,
    node: AbstractLogicalNode,

    onRemove(id: number): void,

    fieldNames: string[]
}

export default class LogicalNodeEditor extends WidgetBase<LogicalNodeProps> {
    private openDialog: boolean = false;

    private scalarNodeNames = [
        'like',
        'alike',
        'eq',
        'ge',
        'gt',
        'le',
        'lt',
        'ne'
    ];

    private arrayNodeNames = [
        'in', 'out'
    ];

    private dialogState = {
        scalar: {
            name: this.scalarNodeNames[0],
            field: '',
            value: ''
        },
        array: {
            name: this.arrayNodeNames[0],
            field: '',
            value: ''
        }
    };

    private nodeFactory: RqlNodeFactory;

    constructor() {
        super();
        this.nodeFactory = new RqlNodeFactory();
    }

    protected render() {
        const onRemove = (id: number) => this.removeChildNode(id);
        const fieldNames = this.properties.fieldNames;
        return v('div', {classes: css.root}, [
                v('div', {classes: css.controls}, [
                    v('div', {}, [this.properties.node.name]),
                    v('button',
                        {
                            onclick: () => {
                                this.addChildNode();
                            }
                        },
                        ['Add new child']),
                    v('button',
                        {
                            onclick: () => {
                                this.properties.onRemove(this.properties.id)
                            }
                        },
                        ['X']),
                ]),
                v('div', {}, this.properties.node.subNodes.map(
                    (node: AbstractQueryNode, id: number) => {
                        let castedNode;
                        switch (true) {
                            case (node instanceof AbstractLogicalNode):
                                castedNode = <AbstractLogicalNode>node;
                                return w(LogicalNodeEditor, {id, node: castedNode, fieldNames, onRemove});

                            case (node instanceof AbstractScalarNode):
                                castedNode = <AbstractScalarNode>node;
                                return w(ScalarNodeEditor, {id, node: castedNode, fieldNames, onRemove});

                            case (node instanceof AbstractArrayNode):
                                castedNode = <AbstractArrayNode>node;
                                return w(ArrayNodeEditor, {id, node: castedNode, fieldNames, onRemove});
                        }
                    }
                )),
                w(Dialog, {
                    theme,
                    title: 'Create new node',
                    underlay: true,
                    open: this.openDialog,
                    onRequestClose: () => {
                        this.openDialog = false;
                        this.invalidate();
                    }
                }, [this.getChildNodeCreationMenu()])
            ]
        )
    }

    private removeChildNode(id: number) {
        this.properties.node.subNodes.splice(id);
        this.invalidate();
    }

    private addChildNode() {
        this.openDialog = true;
        this.invalidate();
    }

    private getChildNodeCreationMenu(): VNode {
        return v('div', {classes: modalCss.root}, [
            v('div', {classes: modalCss.logicalNodes}, [
                'Logical Nodes',
                v('button', {
                    onclick: () => {
                        this.createChildNode('and', {subNodes: []})
                    }
                }, [' AND ']),
                v('button', {
                    onclick: () => {
                        this.createChildNode('or', {subNodes: []})
                    }
                }, [' OR '])
            ]),
            v('div', {classes: modalCss.scalarNodes}, [
                'Scalar nodes',
                w(Select, {
                    value: this.dialogState.scalar.name,
                    options: this.scalarNodeNames,
                    onChange: (value: string) => {
                        this.dialogState.scalar.name = value;
                        this.invalidate();
                    }
                }),
                w(TextInput, {
                    value: this.dialogState.scalar.field,
                    placeholder: 'field name',
                    onChange: (value: string) => {
                        this.dialogState.scalar.field = value;
                        this.invalidate();
                    }
                }),
                w(TextInput, {
                    value: this.dialogState.scalar.value,
                    placeholder: 'value',
                    onChange: (value: string) => {
                        this.dialogState.scalar.value = value;
                        this.invalidate();
                    }
                }),
                v('button', {
                    onclick: () => {
                        this.createChildNode(this.dialogState.scalar.name, {
                            field: this.dialogState.scalar.field,
                            value: this.dialogState.scalar.value
                        })
                    }
                }, ['Create scalar node'])
            ]),
            v('div', {classes: modalCss.arrayNodes}, [
                'Array nodes',
                w(Select, {
                    value: this.dialogState.array.name,
                    options: this.arrayNodeNames,
                    onChange: (value: string) => {
                        this.dialogState.array.name = value;
                        this.invalidate();
                    }
                }),
                w(TextInput, {
                    value: this.dialogState.array.field,
                    placeholder: 'field name',
                    onChange: (value: string) => {
                        this.dialogState.array.field = value;
                        this.invalidate();
                    }
                }),
                w(TextInput, {
                    value: this.dialogState.array.value,
                    placeholder: 'values',
                    onChange: (value: string) => {
                        this.dialogState.array.value = value;
                        this.invalidate();
                    }
                }),
                v('button', {
                    onclick: () => {
                        this.createChildNode(this.dialogState.array.name, {
                            field: this.dialogState.array.field,
                            values: this.dialogState.array.value.split(',')
                        })
                    }
                }, ['Create scalar node'])
            ])
        ])
    }

    private createChildNode(nodeName: string, params: RqlNodeFactoryParams) {
        this.properties.node.subNodes.push(this.nodeFactory.createNode(nodeName, params));
        this.openDialog = false;
        this.invalidate();
    }

}
