"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var directedGraph_1 = require("../directedGraph");
var graph = new directedGraph_1.directedGraph();
graph.addNode([4, 5]);
graph.addNode([2, 5]);
graph.addNode([1, 2]);
graph.drawEdge([2, 5], [1, 2], 5);
graph.drawEdge([2, 5], [1, 2], 6);
graph.drawEdge([1, 2], [2, 5], 5);
graph.drawEdge([2, 5], [4, 5], 10);
graph.drawEdge([1, 2], [4, 5], 1);
var b = graph.makePath([2, 5], [4, 5]);
var a = graph.childNodes.keys();
var loop = false;
while (!loop) {
    var value = a.next();
    console.log(value.value);
    loop = value.done;
}
