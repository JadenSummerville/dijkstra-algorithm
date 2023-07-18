"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.directedGraph = void 0;
//import PriorityQueue from '../PriorityQueue/PriorityQueue';
var HashSet_1 = require("../HashSet/HashSet");
var PriorityQueue_1 = require("../PriorityQueue/PriorityQueue");
var equals_1 = require("../PriorityQueue/Tools/equals");
var hashCode_1 = require("../PriorityQueue/Tools/hashCode");
var directedGraph = /** @class */ (function () {
    function directedGraph() {
        this.childNodes = new Map();
        this.childNodesWeight = new Map;
        this.parentNodes = new Map();
        this.parentNodesWeight = new Map;
    }
    directedGraph.prototype.addNode = function (node) {
        if (this.childNodes.has((0, hashCode_1.hashCode)(node))) {
            return false;
        }
        this.childNodes.set((0, hashCode_1.hashCode)(node), new HashSet_1.HashSet());
        this.parentNodes.set((0, hashCode_1.hashCode)(node), new HashSet_1.HashSet());
        this.childNodesWeight.set((0, hashCode_1.hashCode)(node), new Map());
        this.parentNodesWeight.set((0, hashCode_1.hashCode)(node), new Map());
        return true;
    };
    directedGraph.prototype.drawEdge = function (startNode, endNode, weight) {
        if (weight <= 0) {
            throw new Error("Weight must be positive");
        }
        if (!(this.childNodes.has((0, hashCode_1.hashCode)(startNode)) && this.childNodes.has((0, hashCode_1.hashCode)(endNode)))) {
            return false;
        }
        var startNodeToWeights = this.childNodesWeight.get((0, hashCode_1.hashCode)(startNode));
        var endNodeToWeights = this.parentNodesWeight.get((0, hashCode_1.hashCode)(endNode));
        var startChildNodes = this.childNodes.get((0, hashCode_1.hashCode)(startNode));
        var endParentNodes = this.parentNodes.get((0, hashCode_1.hashCode)(endNode));
        if (startNodeToWeights == undefined) {
            throw new Error("startNodeToWeights is undifined");
        }
        if (endNodeToWeights == undefined) {
            throw new Error("endNodeToWeights is undifined");
        }
        if (startChildNodes == undefined) {
            throw new Error("startChildNodes is undifined");
        }
        if (endParentNodes == undefined) {
            throw new Error("endParentNodes is undifined");
        }
        var goal = startNodeToWeights.get((0, hashCode_1.hashCode)(endNode)) != null;
        startNodeToWeights.set((0, hashCode_1.hashCode)(endNode), weight);
        endNodeToWeights.set((0, hashCode_1.hashCode)(startNode), weight);
        startChildNodes.add(endNode);
        endParentNodes.add(startNode);
        return goal;
    };
    directedGraph.prototype.drawEdges = function (node_1, node_2, weight) {
        this.drawEdge(node_1, node_2, weight);
        this.drawEdge(node_2, node_1, weight);
    };
    directedGraph.prototype.popEdge = function (parent, child) {
        var edge = this.getEdge(parent, child);
        if (edge == undefined) {
            return false;
        }
        var children = this.childNodes.get((0, hashCode_1.hashCode)(parent));
        var parents = this.parentNodes.get((0, hashCode_1.hashCode)(child));
        if (children == undefined) {
            throw Error("children was undefined even though an edge from parent to child exists.");
        }
        if (parents == undefined) {
            throw Error("parents was undefined even though an edge from child to parent exists.");
        }
        children.remove(child);
        parents.remove(parent);
        var childEdges = this.childNodesWeight.get((0, hashCode_1.hashCode)(parent));
        var parentEdges = this.parentNodesWeight.get((0, hashCode_1.hashCode)(child));
        if (childEdges == undefined) {
            throw Error("childEdges was undefined even though an edge from parent to child exists.");
        }
        if (parentEdges == undefined) {
            throw Error("parentEdges was undefined even though an edge from child to parent exists.");
        }
        childEdges.delete((0, hashCode_1.hashCode)(child));
        parentEdges.delete((0, hashCode_1.hashCode)(parent));
        return true;
    };
    directedGraph.prototype.popChildEdges = function (parent) {
        var childNodes = this.getChildNodes(parent);
        var childNodesList = childNodes.list();
        for (var i = 0; i != childNodesList.length; i++) {
            this.popEdge(parent, childNodesList[i]);
        }
    };
    directedGraph.prototype.popParentEdges = function (child) {
        var parentNodes = this.getParentNodes(child);
        var parentNodesList = parentNodes.list();
        for (var i = 0; i != parentNodesList.length; i++) {
            this.popEdge(parentNodesList[i], child);
        }
    };
    directedGraph.prototype.popEdges = function (node) {
        this.popChildEdges(node);
        this.popParentEdges(node);
    };
    directedGraph.prototype.popNode = function (node) {
        if (!this.childNodes.has((0, hashCode_1.hashCode)(node))) {
            return false;
        }
        this.popEdges(node);
        this.childNodes.delete((0, hashCode_1.hashCode)(node));
        this.childNodesWeight.delete((0, hashCode_1.hashCode)(node));
        this.parentNodes.delete((0, hashCode_1.hashCode)(node));
        this.parentNodesWeight.delete((0, hashCode_1.hashCode)(node));
        return true;
    };
    directedGraph.prototype.getChildNodes = function (parent) {
        var goal = this.childNodes.get((0, hashCode_1.hashCode)(parent));
        if (goal == undefined) {
            return new HashSet_1.HashSet;
        }
        return goal;
    };
    directedGraph.prototype.getParentNodes = function (parent) {
        var goal = this.parentNodes.get((0, hashCode_1.hashCode)(parent));
        if (goal == undefined) {
            return new HashSet_1.HashSet;
        }
        return goal;
    };
    directedGraph.prototype.getEdge = function (parentNode, childNode) {
        var parentNodeChildEdges = this.childNodesWeight.get((0, hashCode_1.hashCode)(parentNode));
        if (parentNodeChildEdges == undefined) {
            return parentNodeChildEdges;
        }
        var goal = parentNodeChildEdges.get((0, hashCode_1.hashCode)(childNode));
        return goal;
    };
    directedGraph.prototype.getPathCost = function (path) {
        if (path.length < 2) {
            return 0;
        }
        var goal = 0;
        for (var i = path.length - 1; i != 0; i--) {
            var start = path[i - 1];
            var end = path[i];
            var street = this.getEdge(start, end);
            if (street == undefined) {
                throw new Error("No path from ".concat(start, " to ").concat(end, " found."));
            }
            goal += street;
        }
        return goal;
    };
    directedGraph.prototype.makePath = function (start, end) {
        if (!this.childNodes.has((0, hashCode_1.hashCode)(start))) {
            return undefined;
        }
        var visited = new HashSet_1.HashSet;
        var goal = new Array;
        var func = function (item) {
            return -item.distance;
        };
        var priorityQueue = new PriorityQueue_1.PriorityQueue(func);
        priorityQueue.push({ value: start, distance: 0, prev: undefined });
        while (!priorityQueue.isEmpty()) {
            var item = priorityQueue.pop();
            if ((0, equals_1.equals)(item.value, end)) {
                while (item.prev != undefined) {
                    goal.push(item.value);
                    item = item.prev;
                }
                goal.push(item.value);
                return goal;
            }
            if (!visited.contains(item.value)) {
                visited.add(item.value);
                var children = this.getChildNodes(item.value);
                var childrenList = children.list();
                for (var i = 0; i != childrenList.length; i++) {
                    var distance = this.getEdge(item.value, childrenList[i]);
                    if (distance == undefined) {
                        throw new Error("Distance is undefined even though it is a child edge.");
                    }
                    priorityQueue.push({ value: childrenList[i], distance: item.distance + distance, prev: item });
                }
            }
        }
        return undefined;
    };
    return directedGraph;
}());
exports.directedGraph = directedGraph;
