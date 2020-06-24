class Node {
    constructor (data){
        this.data = data
        this.left = null
        this.right = null
    }
}
class BST {
    constructor () {
        this.root = null
    }
    insert(data){
        let newNode = new Node(data) // 构造函数
        if (this.root) this.insertNode(this.root,newNode) // 如果root为空，初始化一个节点，不为空就插入一个新节点
        else this.root = newNode
    }
    insertNode(root,newNode){
        if(newNode.data<root.data){ // 判断当前的节点的根是否大于要插入的新值，是 跟左子树作比较
            if(root.left === null) root.left = newNode // 判断当前节点是否有左子树 ，是 就以左子树作为新节点的根节点
            else this.insertNode(root.left,newNode)
        } else {
            if(root.right === null) root.right = newNode
            else this.insertNode(root.right,newNode)
        }
    }
}
let tree = new BST()
tree.insert(11)
tree.insert(5)
tree.insert(15)
tree.insert(10)
tree.insert(16)
tree.insert(18)
tree.insert(8)
tree.insert(7)
//   tree.insert(11)
tree.insert(14)
tree.insert(6)
function preorder (root,arr=[]) {
    if(root){
        arr.push(root.data)
        preorder(root.left,arr)
        preorder(root.right,arr)
    }
    return arr
}
function inorder (root,arr=[]) {
    if(root) {
        inorder(root.left,arr)
        arr.push(root.data)
        inorder(root.right,arr)
    }
    return arr
}
function postOrder (root,arr=[]){
    if(root) {
        postOrder(root.left,arr)
        postOrder(root.right,arr)
        arr.push(root.data)
    }
    return arr
}
// let result = []
console.log('先序遍历',preorder(tree.root))
console.log('中序遍历',inorder(tree.root))
console.log('后序遍历',postOrder(tree.root))