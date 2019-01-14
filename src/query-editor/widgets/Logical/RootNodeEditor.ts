import LogicalNodeEditor from './LogicalNodeEditor';
import { v } from '@dojo/framework/widget-core/d';
import { DNode } from '@dojo/framework/widget-core/interfaces';

export default class RootNodeEditor extends LogicalNodeEditor {
	protected getNodeName(): DNode {
		return v('div', {classes: ''}, ['Root node']);
	}
}
