import renderer from '@dojo/framework/widget-core/vdom';
import {v, w} from '@dojo/framework/widget-core/d';
import RootRule from "./widgets/RootRule";

const r = renderer(() => v('div', {}, [
    w(RootRule, {}),
]));
r.mount();
