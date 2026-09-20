import React from 'react';
import ArrayVisualizer3D from './ArrayVisualizer3D';
import MatrixVisualizer3D from './MatrixVisualizer3D';
import LinkedListVisualizer3D from './LinkedListVisualizer3D';
import StackVisualizer3D from './StackVisualizer3D';
import QueueVisualizer3D from './QueueVisualizer3D';
import TreeVisualizer3D from './TreeVisualizer3D';
import SortingVisualizer3D from './SortingVisualizer3D';
import RecursionVisualizer3D from './RecursionVisualizer3D';
import GraphVisualizer3D from './GraphVisualizer3D';
import HashTableVisualizer3D from './HashTableVisualizer3D';

export default function DsaSceneDispatcher({ dataStructureState }) {
  if (!dataStructureState) return null;

  const type = dataStructureState.type ? dataStructureState.type.toLowerCase() : 'array';

  switch (type) {
    case 'hash-table':
    case 'hashtable':
    case 'hashmap':
    case 'hashing':
    case 'two-sum':
    case 'map':
      return <HashTableVisualizer3D dataStructureState={dataStructureState} />;
    case 'graph':
    case 'graphs':
    case 'graph-bfs':
    case 'graph-dfs':
    case 'dijkstra':
      return <GraphVisualizer3D dataStructureState={dataStructureState} />;
    case 'matrix':
    case '2d-array':
    case 'dp-table':
    case 'lcs':
      return <MatrixVisualizer3D dataStructureState={dataStructureState} />;
    case 'linkedlist':
    case 'linked-list':
    case 'doubly-linked-list':
    case 'circular-linked-list':
    case 'cycle-detection':
      return <LinkedListVisualizer3D dataStructureState={dataStructureState} />;
    case 'stack':
    case 'parentheses-stack':
      return <StackVisualizer3D dataStructureState={dataStructureState} />;
    case 'queue':
    case 'circular-queue':
    case 'deque':
      return <QueueVisualizer3D dataStructureState={dataStructureState} />;
    case 'tree':
    case 'bst':
    case 'avl':
    case 'avl-tree':
    case 'trie':
      return <TreeVisualizer3D dataStructureState={dataStructureState} />;
    case 'sorting':
    case 'searching':
    case 'bubble-sort':
    case 'insertion-sort':
    case 'merge-sort':
    case 'quick-sort':
    case 'binary-search':
      return <SortingVisualizer3D dataStructureState={dataStructureState} />;
    case 'recursion':
    case 'callstack':
    case 'call-stack':
    case 'factorial':
      return <RecursionVisualizer3D dataStructureState={dataStructureState} />;
    case 'kadane':
    case 'subarray':
    case 'array':
    case 'sliding-window':
    case 'two-pointer':
    default:
      return <ArrayVisualizer3D dataStructureState={dataStructureState} />;
  }
}
