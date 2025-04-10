class Node {
	constructor(value) {
		this.value = value;
	}
	leftChild = null;
	rightChild = null;
}

class Tree {
	constructor(inputArray) {
		this.root = this.buildTree(this.removeDuplicates(this.mergeSort(inputArray)));
	}

	mergeSort(unsortedArray) {
		if (unsortedArray.length === 1) {
			return unsortedArray;
		}

		const leftHalf = unsortedArray.slice(0, unsortedArray.length / 2);
		const rightHalf = unsortedArray.slice(unsortedArray.length / 2, unsortedArray.length);

		const leftSorted = this.mergeSort(leftHalf);
		const rightSorted = this.mergeSort(rightHalf);

		const mergedHalves = [];
		while (true) {
			if (rightSorted[0] === undefined && leftSorted[0] === undefined) {
				return mergedHalves;
			} else if (rightSorted[0] < leftSorted[0] || leftSorted[0] === undefined) {
				mergedHalves.push(rightSorted.shift());
			} else {
				mergedHalves.push(leftSorted.shift());
			}
		}
	}
	removeDuplicates(dirtyArray) {
		let prevNum;
		const cleanArray = [];
		dirtyArray.forEach((num) => {
			if (num != prevNum) {
				cleanArray.push(num);
			}
			prevNum = num;
		});
		return cleanArray;
	}

	buildTree(array) {
		const endIndex = array.length - 1;
		if (endIndex === -1) {
			return null;
		}
		const startIndex = 0;
		const midIndex = Math.floor((startIndex + endIndex) / 2);

		const midValue = array[midIndex];
		const newNode = new Node(midValue);

		newNode.leftChild = this.buildTree(array.slice(startIndex, midIndex));
		newNode.rightChild = this.buildTree(array.slice(midIndex + 1));

		return newNode;
	}
	insert(value, node = this.root) {
		if (value <= node.value) {
			if (node.leftChild === null) {
				node.leftChild = new Node(value);
			} else {
				this.insert(value, node.leftChild);
			}
		} else {
			if (node.rightChild === null) {
				node.rightChild = new Node(value);
			} else {
				this.insert(value, node.rightChild);
			}
		}
	}
	delete(value, node = this.root) {
		if (node === null) {
			throw new Error("Node not found!");
		} else if (value === node.value) {
			replaceWithNextBiggest(node);
		} else if (value < node.value) {
			if (node.leftChild === null) {
				throw new Error("Node not found!");
			} else if (value === node.leftChild.value) {
				if (node.leftChild.leftChild === null && node.leftChild.rightChild === null) {
					node.leftChild = null;
				} else if (node.leftChild.leftChild !== null && node.rightChild.rightChild === null) {
					node.leftChild = node.leftChild.leftChild;
				} else if (node.leftChild.leftChild === null && node.rightChild.rightChild !== null) {
					node.leftChild = node.leftChild.rightChild;
				} else {
					replaceWithNextBiggest(node.leftChild);
				}
			} else {
				this.delete(value, node.leftChild);
			}
		} else if (value > node.value) {
			if (node.rightChild === null) {
				throw new Error("Node not found!");
			} else if (value === node.rightChild.value) {
				if (node.rightChild.leftChild === null && node.rightChild.rightChild === null) {
					node.rightChild = null;
				} else if (node.rightChild.leftChild !== null && node.rightChild.rightChild === null) {
					node.rightChild = node.rightChild.leftChild;
				} else if (node.rightChild.leftChild === null && node.rightChild.rightChild !== null) {
					node.rightChild = node.rightChild.rightChild;
				} else {
					replaceWithNextBiggest(node.rightChild);
				}
			} else {
				this.delete(value, node.rightChild);
			}
		}

		const replaceWithNextBiggest = (node) => {
			let parentOfNewNode = node.rightChild;
			if (parentOfNewNode.leftChild === null) {
				let newNodeValue = parentOfNewNode.value;
				this.delete(parentOfNewNode.value);
				node.value = newNodeValue;
			} else {
				while (parentOfNewNode.leftChild.leftChild !== null) {
					parentOfNewNode = parentOfNewNode.leftChild;
				}
				let newNodeValue = parentOfNewNode.leftChild.value;
				this.delete(parentOfNewNode.leftChild.value);
				node.value = newNodeValue;
			}
		};
	}
	find(value, node = this.root) {
		if (node === null) {
			return null;
		} else if (value === node.value) {
			return node;
		} else if (value < node.value) {
			return this.find(value, node.leftChild);
		} else {
			return this.find(value, node.rightChild);
		}
	}
	levelOrder(callback, nodeQueue = [this.root], resArray = []) {
		if (nodeQueue.length > 0) {
			if (nodeQueue[0].leftChild !== null) {
				nodeQueue.push(nodeQueue[0].leftChild);
			}
			if (nodeQueue[0].rightChild !== null) {
				nodeQueue.push(nodeQueue[0].rightChild);
			}
			resArray.push(callback(nodeQueue[0]));
			nodeQueue.splice(0, 1);
			if (nodeQueue.length > 0) {
				this.levelOrder(callback, nodeQueue, resArray);
			}
			return resArray;
		}
	}
	preOrder(callback, node = this.root) {
		const leftTree = node.leftChild;
		const rightTree = node.rightChild;
		callback(node);
		if (leftTree !== null) {
			this.preOrder(callback, leftTree);
		}
		if (rightTree !== null) {
			this.preOrder(callback, rightTree);
		}
	}
	inOrder(callback, node = this.root) {
		const leftTree = node.leftChild;
		const rightTree = node.rightChild;
		if (leftTree !== null) {
			this.inOrder(callback, leftTree);
		}
		callback(node);
		if (rightTree !== null) {
			this.inOrder(callback, rightTree);
		}
	}
	postOrder(callback, node = this.root) {
		const leftTree = node.leftChild;
		const rightTree = node.rightChild;
		if (leftTree !== null) {
			this.postOrder(callback, leftTree);
		}
		if (rightTree !== null) {
			this.postOrder(callback, rightTree);
		}
		callback(node);
	}
	height(value) {
		const node = this.find(value);
		if (node === null) {
			return null;
		}
		const getHeight = (node) => {
			if (node === null) return -1; // height of null is -1
			const leftHeight = getHeight(node.leftChild);
			const rightHeight = getHeight(node.rightChild);
			return Math.max(leftHeight, rightHeight) + 1;
		};
		return getHeight(node);
	}
	depth(value, node = this.root, depthValue = 0) {
		if (node === null) {
			return null;
		} else if (value === node.value) {
			return depthValue;
		} else if (value < node.value) {
			return this.depth(value, node.leftChild, depthValue + 1);
		} else {
			return this.depth(value, node.rightChild, depthValue + 1);
		}
	}
	isBalanced() {
		const getBalance = (node) => {
			let leftHeight = 0;
			let rightHeight = 0;
			if (node.leftChild !== null) {
				leftHeight = this.height(node.leftChild.value);
			}
			if (node.rightChild !== null) {
				rightHeight = this.height(node.rightChild.value);
			}
			if (Math.abs(leftHeight - rightHeight) <= 1) {
				return true;
			} else {
				return false;
			}
		};
		let isBalanced = true;
		this.levelOrder(getBalance).forEach((returnValue) => {
			if (!returnValue) {
				isBalanced = false;
			}
		});
		return isBalanced;
	}
	rebalance() {
		const returnNodeValues = (node) => {
			return node.value;
		};
		const nodeArray = this.levelOrder(returnNodeValues);
		this.root = this.buildTree(this.removeDuplicates(this.mergeSort(nodeArray)));
	}
}

const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

const prettyPrint = (node, prefix = "", isLeft = true) => {
	if (node === null) {
		return;
	}
	if (node.right !== null) {
		prettyPrint(node.rightChild, `${prefix}${isLeft ? "│   " : "    "}`, false);
	}
	console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
	if (node.left !== null) {
		prettyPrint(node.leftChild, `${prefix}${isLeft ? "    " : "│   "}`, true);
	}
};

tree.insert(10);
tree.insert(11);
prettyPrint(tree.root);
console.log(tree.isBalanced());
tree.rebalance();
prettyPrint(tree.root);
console.log(tree.isBalanced());
