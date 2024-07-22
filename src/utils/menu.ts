import { createVNode } from "vue";
import * as IconsVue from "@ant-design/icons-vue";

type TreeNode = {
    key: string;
    icon: any;
    label: string;
    title: string;
    path: string;
    children?: TreeNode[];
};

interface Result {
    key: string;
    parKey: string | null;
}

//查询返回本级 上级数据
export function findNodeByPath(tree: TreeNode[], path: string, parentKey: string | null = null): Result | null {
    for (const node of tree) {
        if (node.path === path) {
            return {key: node.key, parKey: parentKey};
        }
        if (node.children) {
            const result = findNodeByPath(node.children, path, node.key);
            if (result) {
                return result;
            }
        }
    }
    return null;
}

export const Icon = (props: { icon: string }) => {
    const { icon } = props;
    const antIcon: { [key: string]: any } = IconsVue;
    return createVNode(antIcon[icon]);
};
