import Tool, { Selection } from '@recogito/annotorious/src/tools/Tool';
import EditablePointcross from './EditablePointcross';
import { toFragment, isPointcross } from './Pointcross';
import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';
import PointcrossSelection from './PointcrossSelection';

// export default class PointcrossTool extends Tool {

//   constructor(g, config, env) {
//     super(g, config, env);
//   }

//   drawPointcross = (x, y) => {
//     const containerGroup = document.createElementNS(SVG_NAMESPACE, 'g');
//     containerGroup.setAttribute('class', 'a9s-inner');

//     const group = document.createElementNS(SVG_NAMESPACE, 'g');

//     const drawLineHorizontal = size => {
//       const xStart = x - size;
//       const xEnd = x + size;

//       const line = document.createElementNS(SVG_NAMESPACE, 'line');
//       line.setAttribute('x1', xStart);
//       line.setAttribute('y1', y);
//       line.setAttribute('x2', xEnd);
//       line.setAttribute('y2', y);
//       line.setAttribute('transform-origin', `${x} ${y}`);
//       return line;
//     }

//     const drawLineVertical = size => {
//       const yStart = y - size;
//       const yEnd = y + size;

//       const line = document.createElementNS(SVG_NAMESPACE, 'line');
//       line.setAttribute('x1', x);
//       line.setAttribute('y1', yStart);
//       line.setAttribute('x2', x);
//       line.setAttribute('y2', yEnd);
//       line.setAttribute('transform-origin', `${x} ${y}`);
//       return line;
//     }

//     // const radius = this.config.handleRadius || 6;

//     const inner = drawLineHorizontal(100);
//     inner.setAttribute('class', 'a9s-handle-inner')

//     const outer = drawLineVertical(100);
//     outer.setAttribute('class', 'a9s-handle-outer')

//     group.appendChild(outer);
//     group.appendChild(inner);

//     containerGroup.appendChild(group);
//     return containerGroup;
//   }

//   startDrawing = (x, y, _, evt) => {
//     // The top-most existing annotation at this position (if any)
//     // const annotation = evt.target.closest('.a9s-annotation')?.annotation;

//     // The point drawing tool will ALWAYS create a point annotation,
//     // regardless of whether there's already an annotation underneath.
//     // UNLESS the annotation underneath is itself a point!
//     // if (!annotation || !isPointcross(annotation)) {
//       // const element = this.drawPointcross(x, y);
//       // this.scaleHandle(element);

//       // this.g.appendChild(element);

//       console.log('here')
//       this.pointcrossSelection = new PointcrossSelection(x, y , this.g, this.env);

//       console.log('here2')
//       // const shape = this.pointcrossSelection.element;
//       const shape = this.pointcrossSelection.element;
//       shape.annotation = this.pointcrossSelection.toSelection();
//       this.emit('complete', shape);

//       console.log('here3')

//       // element.annotation = new Selection(toFragment(x, y, this.env.image, this.config.fragmentUnit));

//       // this.emit('complete', element);
//     // } else {
//       // this.emit('cancel')
//     // }
//   }

//   stop = () => {
//     // Nothing to do
//   }

//   get isDrawing() {
//     // Point selection is an instant action - the
//     // tool is never an 'drawing' state
//     return false;
//   }

//   createEditableShape = annotation =>
//     new EditablePointcross(annotation, this.g, this.config, this.env);

// }

// PointcrossTool.identifier = 'pointcross';

// PointcrossTool.supports = annotation => {
//   // Not needed, since the target.renderedVia property will be evaluated first
//   return false;
// }

// // PointcrossTool.supports = annotation => {
// //   const selector = annotation.selector('SvgSelector');
// //   if (selector)
// //     return selector.value?.match(/^<svg.*<line/g);
// // }

/**
 * A rubberband selector for freehand fragments.
 */
export default class PointcrossTool extends Tool {
  constructor(g, config, env) {
    super(g, config, env);
  }

  startDrawing = (x, y) => {
    // this._isDrawing = true;

    // this.attachListeners({
    //   mouseMove: this.onMouseMove,
    //   mouseUp: this.onMouseUp,
    //   dblClick: this.onDblClick
    // });

    // this.rubberband = new RubberbandFreehand([ x, y ], this.g, this.env);

    // console.log('here')
    this.pointcrossSelection = new PointcrossSelection(
      [x, y],
      this.g,
      this.env,
    );

    // console.log('here2')
    // const shape = this.pointcrossSelection.element;
    const shape = this.pointcrossSelection.element;
    shape.annotation = this.pointcrossSelection.toSelection();
    this.emit('complete', shape);

    // console.log('here3')
  };

  stop = () => {};

  get isDrawing() {
    return false;
  }

  createEditableShape = (annotation) =>
    new EditablePointcross(annotation, this.g, this.config, this.env);
}

PointcrossTool.identifier = 'pointcross';

PointcrossTool.supports = (annotation) => {
  const selector = annotation.selector('SvgSelector');
  if (selector)
    return (
      selector.value.match(/^<svg.*<path*/g) &&
      !selector.value.toUpperCase().includes('Z')
    );
};

// PointcrossTool.supports = annotation => {
//   // Not needed, since the target.renderedVia property will be evaluated first
//   return true;
// }

// PointcrossTool.supports = annotation => {
//   const selector = annotation.selector('SvgSelector');
//   if (selector)
//     return (selector.value.match(/^<svg.*<path*/g) && !selector.value.toUpperCase().includes('Z'));
// }
