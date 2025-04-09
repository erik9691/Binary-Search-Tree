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

prettyPrint(tree.root);
