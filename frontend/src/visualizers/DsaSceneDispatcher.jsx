import React from 'react';
import ArrayVisualizer3D from './ArrayVisualizer3D';
import MatrixVisualizer3D from './MatrixVisualizer3D';
import LinkedListVisualizer3D from './LinkedListVisualizer3D';
import StackVisualizer3D from './StackVisualizer3D';
import QueueVisualizer3D from './QueueVisualizer3D';
import TreeVisualizer3D from './TreeVisualizer3D';
import SortingVisualizer3D from './SortingVisualizer3D';
import RecursionVisualizer3D from './RecursionVisualizer3D';

export default function DsaSceneDispatcher({ dataStructureState }) {
  if (!dataStructureState) return null;

  const type = dataStructureState.type ? dataStructureState.type.toLowerCase() : 'array';

  switch (type) {
    case 'matrix':
    case '2d-array':
      return <MatrixVisualizer3D dataStructureState={dataStructureState} />;
    case 'linkedlist':
    case 'linked-list':
      return <LinkedListVisualizer3D dataStructureState={dataStructureState} />;
    case 'stack':
      return <StackVisualizer3D dataStructureState={dataStructureState} />;
    case 'queue':
      return <QueueVisualizer3D dataStructureState={dataStructureState} />;
    case 'tree':
    case 'bst':
      return <TreeVisualizer3D dataStructureState={dataStructureState} />;
    case 'sorting':
    case 'searching':
      return <SortingVisualizer3D dataStructureState={dataStructureState} />;
    case 'recursion':
      return <RecursionVisualizer3D dataStructureState={dataStructureState} />;
    case 'array':
    default:
      return <ArrayVisualizer3D dataStructureState={dataStructureState} />;
  }
}
