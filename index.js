class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    const sortedArray = [...new Set(array)].sort((a, b) => a - b);
    this.root = this.buildTree(sortedArray, 0, sortedArray.length - 1);
  }

  buildTree(array, start, end) {
    if (start > end) {
      return null;
    }
    const mid = Math.floor((start + end) / 2);
    const node = new Node(array[mid]);
    node.left = this.buildTree(array, start, mid - 1);
    node.right = this.buildTree(array, mid + 1, end);
    return node;
  }

  insert(value) {
    this.root = this._insertRec(this.root, value);
  }

  _insertRec(root, value) {
    if (root === null) {
      return new Node(value);
    }

    if (value < root.data) {
      root.left = this._insertRec(root.left, value);
    } else if (value > root.data) {
      root.right = this._insertRec(root.right, value);
    }

    return root;
  }

  deleteItem(value) {
    this.root = this._deleteRec(this.root, value);
  }

  _deleteRec(root, value) {
    if (root === null) {
      return root;
    }

    if (value < root.data) {
      root.left = this._deleteRec(root.left, value);
    } else if (value > root.data) {
      root.right = this._deleteRec(root.right, value);
    } else {
      // Node with only one child or no child
      if (root.left === null) {
        return root.right;
      } else if (root.right === null) {
        return root.left;
      }
      // Node with two children: Get the inorder successor (smallest in the right subtree)
      root.data = this._minValue(root.right);
      // Delete the inorder successor
      root.right = this._deleteRec(root.right, root.data);
    }
    return root;
  }

  _minValue(node) {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current.data;
  }

  find(value) {
    return this._findRec(this.root, value);
  }

  _findRec(root, value) {
    if (root === null || root.data === value) {
      return root;
    }
   
    if (root.data < value) {
      return this._findRec(root.right, value);
    }
   
    return this._findRec(root.left, value);
  }

  levelOrder(callback) {
    if (!this.root) return [];

    const queue = [this.root];
    const result = [];

    while (queue.length > 0) {
      const node = queue.shift();
      if (callback) {
        callback(node);
      } else {
        result.push(node.data);
      }
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    return callback ? undefined : result;
  }

  levelOrderRec(callback) {
    if (!this.root) return [];

    const queue = [this.root];
    const result = [];

    const processQueue = (queue) => {
      if (queue.length === 0) return;

      const node = queue.shift();
      if (callback) {
        callback(node);
      } else {
        result.push(node.data);
      }
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);

      processQueue(queue);
    };

    processQueue(queue);
    return callback ? undefined : result;
  }

  inOrder(callback) {
    const result = [];
    const traverse = (node) => {
      if (node !== null) {
        traverse(node.left);
        if (callback) {
          callback(node);
        } else {
          result.push(node.data);
        }
        traverse(node.right);
      }
    };
    traverse(this.root);
    return callback ? undefined : result;
  }

  preOrder(callback) {
    const result = [];
    const traverse = (node) => {
      if (node !== null) {
        if (callback) {
          callback(node);
        } else {
          result.push(node.data);
        }
        traverse(node.left);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return callback ? undefined : result;
  }

  postOrder(callback) {
    const result = [];
    const traverse = (node) => {
      if (node !== null) {
        traverse(node.left);
        traverse(node.right);
        if (callback) {
          callback(node);
        } else {
          result.push(node.data);
        }
      }
    };
    traverse(this.root);
    return callback ? undefined : result;
  }

  height(node) {
    if (node === null) {
      return -1;
    }

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node) {
    const depthRec = (currentNode, targetNode, currentDepth) => {
      if (currentNode === null) {
        return -1;
      }
      if (currentNode === targetNode) {
        return currentDepth;
      }
      
      let leftDepth = depthRec(currentNode.left, targetNode, currentDepth + 1);
      if (leftDepth !== -1) {
        return leftDepth;
      }
      
      let rightDepth = depthRec(currentNode.right, targetNode, currentDepth + 1);
      return rightDepth;
    };

    return depthHelper(this.root, node, 0);
  }

  isBalanced() {
    const checkBalance = (node) => {
      if (node === null) {
        return 0;
      }
      const leftHeight = checkBalance(node.left);
      if (leftHeight === -1) {
        return -1;
      }
      const rightHeight = checkBalance(node.right);
      if (rightHeight === -1) {
        return -1;
      }
      if (Math.abs(leftHeight - rightHeight) > 1) {
        return -1;
      }
      return Math.max(leftHeight, rightHeight) + 1;
    };

    return checkBalance(this.root) !== -1;
  }

  rebalance() {
    const nodesArray = this.inOrder();
    this.root = this.buildTree(nodesArray, 0, nodesArray.length - 1);
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

const array = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const tree = new Tree(array);
prettyPrint(tree.root);
