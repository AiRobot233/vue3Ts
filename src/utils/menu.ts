import { createVNode } from 'vue'
import * as IconsVue from '@ant-design/icons-vue'

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
    nameTrail: string[];
}

//查询返回本级 上级数据
export function findNodeByPath(tree: TreeNode[], path: string, parentKey: string | null = null, nameTrail: string[] = []): Result | null {
    for (const node of tree) {
        const currentTrail = [...nameTrail, node.title]

        if (node.path === path) {
            return { key: node.key, parKey: parentKey, nameTrail: currentTrail }
        }

        if (node.children) {
            const result = findNodeByPath(node.children, path, node.key, currentTrail)
            if (result) {
                return result
            }
        }
    }
    return null
}

export const Icon = (props: { icon: string }) => {
    const { icon } = props
    const antIcon: { [key: string]: any } = IconsVue
    return createVNode(antIcon[icon])
}
