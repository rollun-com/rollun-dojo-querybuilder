import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import {v, w} from '@dojo/framework/widget-core/d';
import {VNode} from "@dojo/framework/widget-core/interfaces";
import GroupRule from "./GroupRule";

export interface RootRuleProps {

}

export default class RootRule extends WidgetBase<RootRuleProps> {
    protected render(): VNode {
        const id = 'root';
        const onRemove = () => {
        };
        const onGroupUpdate = (id:string, data: {}) => {
            console.log(id, data)
        };
        const operators = [
            'equals',
            'not equals',
            'less than',
            'more than'
        ];
        const fieldNames = [
            'id', 'name', 'value'
        ];
        return v('div', {}, [
            w(GroupRule, {id, onRemove, operators, fieldNames, onGroupUpdate}),
        ])
    }
}
