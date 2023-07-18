//import PriorityQueue from '../PriorityQueue/PriorityQueue';
import {HashSet} from '../HashSet/HashSet';
import {PriorityQueue} from '../PriorityQueue/PriorityQueue';
import { equals } from '../PriorityQueue/Tools/equals';
import { hashCode } from '../PriorityQueue/Tools/hashCode';
export class directedGraph<T>{
    // Takes node and gets the nodes it points to.
    childNodes: Map<number, HashSet<T>>;
    childNodesWeight: Map<number, Map<number, number>>;
    parentNodes: Map<number, HashSet<T>>;
    parentNodesWeight: Map<number, Map<number, number>>;
    constructor(){
        this.childNodes = new Map<number, HashSet<T>>();
        this.childNodesWeight = new Map<number, Map<number, number>>;
        this.parentNodes = new Map<number, HashSet<T>>();
        this.parentNodesWeight = new Map<number, Map<number, number>>;
    }
    public addNode(node: T): boolean{
        if(this.childNodes.has(hashCode(node))){
            return false;
        }
        this.childNodes.set(hashCode(node), new HashSet<T>());
        this.parentNodes.set(hashCode(node), new HashSet<T>());
        this.childNodesWeight.set(hashCode(node), new Map<number, number>());
        this.parentNodesWeight.set(hashCode(node), new Map<number, number>());
        return true;
    }
    public drawEdge(startNode: T, endNode: T, weight: number): boolean{
        if(weight <= 0){
            throw new Error("Weight must be positive");
        }if(!(this.childNodes.has(hashCode(startNode)) && this.childNodes.has(hashCode(endNode)))){
            return false;
        }
        var startNodeToWeights: Map<number, number> | undefined = this.childNodesWeight.get(hashCode(startNode));
        var endNodeToWeights: Map<number, number> | undefined = this.parentNodesWeight.get(hashCode(endNode));
        var startChildNodes: HashSet<T> | undefined = this.childNodes.get(hashCode(startNode));
        var endParentNodes: HashSet<T> | undefined = this.parentNodes.get(hashCode(endNode));
        if(startNodeToWeights == undefined){
            throw new Error("startNodeToWeights is undifined");
        }if(endNodeToWeights == undefined){
            throw new Error("endNodeToWeights is undifined");
        }if(startChildNodes == undefined){
            throw new Error("startChildNodes is undifined");
        }if(endParentNodes == undefined){
            throw new Error("endParentNodes is undifined");
        }
        var goal: boolean = startNodeToWeights.get(hashCode(endNode)) != null;
        startNodeToWeights.set(hashCode(endNode), weight);
        endNodeToWeights.set(hashCode(startNode), weight);
        startChildNodes.add(endNode);
        endParentNodes.add(startNode);

        return goal;
    }
    public drawEdges(node_1: T, node_2: T, weight: number): void{
        this.drawEdge(node_1, node_2, weight);
        this.drawEdge(node_2, node_1, weight);
    }
    public popEdge(parent: T, child: T): boolean{
        var edge: undefined | number = this.getEdge(parent, child);
        if(edge == undefined){
            return false;
        }
        var children: HashSet<T> | undefined = this.childNodes.get(hashCode(parent));
        var parents: HashSet<T> | undefined = this.parentNodes.get(hashCode(child));
        if(children == undefined){
            throw Error("children was undefined even though an edge from parent to child exists.");
        }if(parents == undefined){
            throw Error("parents was undefined even though an edge from child to parent exists.");
        }
        children.remove(child);
        parents.remove(parent);

        var childEdges: Map<number, number> | undefined = this.childNodesWeight.get(hashCode(parent));
        var parentEdges: Map<number, number> | undefined = this.parentNodesWeight.get(hashCode(child));
        if(childEdges == undefined){
            throw Error("childEdges was undefined even though an edge from parent to child exists.");
        }if(parentEdges == undefined){
            throw Error("parentEdges was undefined even though an edge from child to parent exists.");
        }
        childEdges.delete(hashCode(child));
        parentEdges.delete(hashCode(parent));
        return true;
    }
    public popChildEdges(parent: T): void{
        var childNodes: HashSet<T> = this.getChildNodes(parent);
        var childNodesList: T[] = childNodes.list();
        for(var i: number = 0; i != childNodesList.length; i++){
            this.popEdge(parent, childNodesList[i]);
        }
    }
    public popParentEdges(child: T): void{
        var parentNodes: HashSet<T> = this.getParentNodes(child);
        var parentNodesList: T[] = parentNodes.list();
        for(var i: number = 0; i != parentNodesList.length; i++){
            this.popEdge(parentNodesList[i], child);
        }
    }
    public popEdges(node: T): void{
        this.popChildEdges(node);
        this.popParentEdges(node);
    }
    public popNode(node: T): boolean{
        if(!this.childNodes.has(hashCode(node))){
            return false;
        }
        this.popEdges(node);
        this.childNodes.delete(hashCode(node));
        this.childNodesWeight.delete(hashCode(node));
        this.parentNodes.delete(hashCode(node));
        this.parentNodesWeight.delete(hashCode(node));
        return true;
    }
    public getChildNodes(parent: T): HashSet<T>{
        var goal: undefined | HashSet<T> = this.childNodes.get(hashCode(parent));
        if(goal == undefined){
            return new HashSet<T>;
        }
        return goal;
    }
    public getParentNodes(parent: T): HashSet<T>{
        var goal: undefined | HashSet<T> = this.parentNodes.get(hashCode(parent));
        if(goal == undefined){
            return new HashSet<T>;
        }
        return goal;
    }
    public getEdge(parentNode: T, childNode: T): undefined | number{
        var parentNodeChildEdges: Map<number, number> | undefined = this.childNodesWeight.get(hashCode(parentNode));
        if(parentNodeChildEdges == undefined){
            return parentNodeChildEdges;
        }
        var goal: number | undefined = parentNodeChildEdges.get(hashCode(childNode));
        return goal;
    }
    public getPathCost(path: T[]): number{
        if(path.length < 2){
            return 0;
        }
        var goal: number = 0;
        for(var i: number = path.length - 1; i != 0; i--){
            var start: T = path[i - 1];
            var end: T = path[i];
            var street: number | undefined = this.getEdge(start, end);
            if(street == undefined){
                throw new Error(`No path from ${start} to ${end} found.`);
            }
            goal += street;
        }
        return goal;
    }
    public makePath(start: T, end: T): T[] | undefined{
        if(!this.childNodes.has(hashCode(start))){
            return undefined;
        }
        var visited: HashSet<T> = new HashSet<T>;
        var goal: T[] = new Array<T>;
        var func = (item: {value: T, distance: number, prev: any})=>{
            return -item.distance;
        }
        var priorityQueue: PriorityQueue<{value: T, distance: number, prev: any}> = new PriorityQueue<{value: T, distance: number, prev: any}>(func);
        priorityQueue.push({value: start, distance: 0, prev: undefined})
        while(!priorityQueue.isEmpty()){
            var item: {value: T, distance: number, prev: any} = priorityQueue.pop();
            if(equals(item.value, end)){
                while(item.prev != undefined){
                    goal.push(item.value);
                    item = item.prev;
                }
                goal.push(item.value);
                return goal;
            }
            if(!visited.contains(item.value)){
                visited.add(item.value);
                var children: HashSet<T> = this.getChildNodes(item.value);
                var childrenList: T[] = children.list();
                for(var i: number = 0; i != childrenList.length; i++){
                    var distance: number | undefined = this.getEdge(item.value, childrenList[i]);
                    if(distance == undefined){
                        throw new Error("Distance is undefined even though it is a child edge.");
                    }
                    priorityQueue.push({value: childrenList[i], distance: item.distance + distance, prev: item});
                }
            }
        }
        return undefined;
    }
}