//二叉树BST
  
class Node {
    constructor (data) {
      this.data = data
      this.left = null
      this.right = null
    }
  }

  class BST {
    constructor () {
      this.root = null
    }
    insert (data) {
      let newNode = new Node(data)
      if (!this.root) this.root = newNode
      else {
        this.insertNode(this.root, newNode)
      }
    }
    //插入节点的辅助函数
    insertNode (root, newNode) {
      if (newNode.data < root.data) {
        if (root.left == null) root.left = newNode
        else this.insertNode(root.left, newNode) 
      }else {
        if (root.right == null) root.right = newNode
        else this.insertNode(root.right, newNode)
      }
    }
    //先序遍历 根左右
    preOrderTraverse (callback) {
      this.perOrderTraverseNode(this.root, callback)
    }
    perOrderTraverseNode (node, callback) {
      if (node) {
        callback(node.data)
        this.perOrderTraverseNode(node.left, callback)
        this.perOrderTraverseNode(node.right, callback)
      }
    }
    //中序遍历 左根友
    inOrderTraverse (callback) {
      this.inOrderTraverseNode(this.root, callback)
    }
    inOrderTraverseNode (node,callback) {
      if (node) {
          this.inOrderTraverseNode(node.left, callback)
          callback(node.data)
        // console.log(node.data)
        this.inOrderTraverseNode(node.right, callback)
      }
    }
    //后续遍历 左友根
    postOrderTraverse (callback) {
      this.postOrderTraverseNode(this.root, callback)
    }
    postOrderTraverseNode (node, callback) {
      if (node) {
        this.postOrderTraverseNode(node.left, callback)
        this.postOrderTraverseNode(node.right, callback)
        // console.log(node.data)
        callback(node.data)
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
  function pre() {
    let arr = []
    tree.preOrderTraverse(data => {
      arr.push(data)
    })
    console.log(arr)
  }
  function inorder () {
    let arr = []
    tree.inOrderTraverse(data => {
        arr.push(data)
    })
    console.log(arr)
  }
  function postorder () {
    let arr = []
    tree.postOrderTraverse(data => {
        arr.push(data)
    })
    console.log(arr)
  }
  
pre()
inorder()
postorder()