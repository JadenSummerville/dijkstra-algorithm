import { directedGraph } from "../directedGraph";

let graph: directedGraph<number[]> = new directedGraph<number[]>();
graph.addNode([4,5]);
graph.addNode([2,5]);
graph.addNode([1,2]);
graph.drawEdge([2,5],[1,2],5);
graph.drawEdge([2,5],[1,2],6);
graph.drawEdge([1,2],[2,5],5);
graph.drawEdge([2,5],[4,5],1);
graph.drawEdge([1,2],[4,5],1);
var b: number[][] | undefined = graph.makePath([2,5], [4,5]);
let a: IterableIterator<number> = graph.childNodes.keys();

var loop: boolean | undefined = false;
while(!loop) {
    var value = a.next();
    console.log(value.value);
    loop = value.done;
}