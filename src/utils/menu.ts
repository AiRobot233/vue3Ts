import {createVNode} from 'vue'
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
    key: string
    parKey: string | null
    nameTrail: string[]
    siblings?: TreeNode[]   // 新增：上级的 children
}

export function findNodeByPath(
    tree: TreeNode[],
    path: string,
    parentKey: string | null = null,
    nameTrail: string[] = [],
    siblings: TreeNode[] | null = null
): Result | null {
    for (const node of tree) {
        const currentTrail = [...nameTrail, node.title]
        if (node.path === path) {
            return {
                key: node.key,
                parKey: parentKey,
                nameTrail: currentTrail,
                siblings: siblings || tree  // 返回父级的 children
            }
        }
        if (node.children) {
            const result = findNodeByPath(node.children, path, node.key, currentTrail, node.children)
            if (result) {
                return result
            }
        }
    }
    return null
}

export const Icon = (props: { icon: string }) => {
    const {icon} = props
    const antIcon: { [key: string]: any } = IconsVue
    return createVNode(antIcon[icon])
}

// 递归获取最深子节点
export function getDeepestNode(node: any): any {
    if (!node.children || node.children.length === 0) {
        return node
    }
    // 如果有多子节点，可以取第一个深层
    return getDeepestNode(node.children[0])
}
