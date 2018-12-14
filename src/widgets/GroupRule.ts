import WidgetBase from "@dojo/framework/widget-core/WidgetBase";
import {v, w} from '@dojo/framework/widget-core/d';
import {VNode, WNode} from "@dojo/framework/widget-core/interfaces";
import {Map} from "@dojo/framework/shim/main";
import ScalarRule, {ScalarRuleState} from './ScalarRule';
import * as css from '../styles/groupRule.m.css';

export interface GroupRuleState {
    operatorName: string,
    value: (ScalarRuleState | GroupRuleState)[],
}

export interface GroupRuleProps {
    id: string,
    fieldNames: string[],
    operators: string[],

    onGroupUpdate(id: string, data: GroupRuleState): void

    onRemove(id: string): void
}

export default class GroupRule extends WidgetBase<GroupRuleProps> {
    private childrenDataRegistry = new Map<string, ScalarRuleState | GroupRuleState>([]);

    private operatorName: string = 'and';

    protected render(): VNode {
        return v('div', {classes: css.groupRule}, [
            v('div', {classes: css.groupRuleControls}, [
                v('div', {}, [
                    v('button', {
                        onclick: () => {
                            this.operatorName = 'and'
                        }
                    }, [' AND ']),
                    v('button', {
                        onclick: () => {
                            this.operatorName = 'or'
                        }
                    }, [' OR ']),
                ]),
                v('div', {}, [
                    v('button', {
                        onclick: () => {
                            this.addNewGroupRule()
                        }
                    }, [' Add new group '])
                ])
            ]),
            v('div', {classes: css.groupRuleChildren}, this.getChildRules()),
            v('button', {
                onclick: () => {
                    this.addNewChildRule()
                }
            }, ['Add new rule'])
        ]);
    }

    private getChildRules(): WNode[] {
        const childrenArray: WNode[] = [];
        this.childrenDataRegistry.forEach( (data, key) => {
            if (data.operatorName === 'and' || data.operatorName === 'or') {
                childrenArray.push(w(GroupRule, {
                    id: key,
                    fieldNames: this.properties.fieldNames,
                    operators: this.properties.operators,
                    onGroupUpdate: (id: string, data: GroupRuleState) => {
                        this.updateChildData(id, data)
                    },
                    onRemove: (id: string) => {
                        this.removeChildRule(id)
                    }
                }));
            } else {
                childrenArray.push(w(ScalarRule, {
                    id: key,
                    fieldNames: this.properties.fieldNames,
                    operators: this.properties.operators,
                    onRemove: (id: string) => {
                        this.removeChildRule(id);
                    },
                    onUpdate: (id: string, data: ScalarRuleState) => {
                        this.updateChildData(id, data);
                    },
                    state: {
                        fieldName: this.properties.fieldNames[0],
                        operatorName: this.properties.operators[0],
                        value: ''
                    }
                }));
            }
        })
        return childrenArray;
    }

    private addNewChildRule(): void {
        this.childrenDataRegistry.set(this.generateId(), {
            fieldName: this.properties.fieldNames[0],
            value: '',
            operatorName: this.properties.operators[0]
        });
        this.invalidate();
    }

    private addNewGroupRule(): void {
        this.childrenDataRegistry.set(this.generateId(), {
            operatorName: 'and',
            value: []
        });
        this.invalidate()
    }

    private generateId(): string {
        const random = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (random() + random() + random() + "-" + random() + random() + random());
    }

    private removeChildRule(id: string) {
        this.childrenDataRegistry.delete(id);
        this.invalidate();
    }

    private updateChildData(id: string, data: GroupRuleState | ScalarRuleState) {
        const oldData = this.childrenDataRegistry.get(id);
        let newData: GroupRuleState | ScalarRuleState;
        if (data.operatorName === 'and' || data.operatorName === 'or') {
            newData = {...oldData, ...data};
        } else {
            newData = {...oldData, ...data};
        }
        this.childrenDataRegistry.set(id, newData);
        this.updateParent(this.getRuleData());
        this.invalidate();
    }

    private getRuleData(): GroupRuleState {
        const rulesData: (ScalarRuleState | GroupRuleState)[] = [];
        for (const childRuleData of this.childrenDataRegistry.values()) {
            rulesData.push(childRuleData);
        }
        return {
            operatorName: this.operatorName,
            value: rulesData,
        };
    }

    private updateParent(data: GroupRuleState) {
        this.properties.onGroupUpdate(this.properties.id, data);
    }
}
