import { Selection } from '@recogito/annotorious/src/tools/Tool';
import { toSVGTarget } from '@recogito/annotorious/src/selectors/EmbeddedSVG';
import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';

// /**
//  * A 'rubberband' selection tool for creating Line drawing by
//  * clicking and dragging.
//  */
// export default class PointcrossSelection {
// //     drawLineHorizontal = (x, y, size, strokeWidth) => {
// //         const xStart = x - size;
// //         const xEnd = x + size;

// //         const line = document.createElementNS(SVG_NAMESPACE, 'line');
// //         line.setAttribute('x1', xStart);
// //         line.setAttribute('y1', y);
// //         line.setAttribute('x2', xEnd);
// //         line.setAttribute('y2', y);
// //         line.setAttribute('transform-origin', `${x} ${y}`);
// //         return line;
// //       }

// //       drawLineVertical = (x, y, size, strokeWidth) => {
// //         const yStart = y - size;
// //         const yEnd = y + size;

// //         const line = document.createElementNS(SVG_NAMESPACE, 'line');
// //         line.setAttribute('x1', x);
// //         line.setAttribute('y1', yStart);
// //         line.setAttribute('x2', x);
// //         line.setAttribute('y2', yEnd);
// //         line.setAttribute('transform-origin', `${x} ${y}`);
// //         return line;
// //       }

// //   constructor(x, y, g, env) {
// //     this.env = env;

// //     this.group = document.createElementNS(SVG_NAMESPACE, 'g');

// //     this.cross = document.createElementNS(SVG_NAMESPACE, 'g');
// //     this.cross.setAttribute('class', 'a9s-selection');

// //     const inner = this.drawLineHorizontal(x, y, 50, 4);
// //     inner.setAttribute('class', 'a9s-inner');

// //     const outer = this.drawLineVertical(x, y, 50, 4);
// //     outer.setAttribute('class', 'a9s-inner');

// //     this.cross.appendChild(outer);
// //     this.cross.appendChild(inner);

// //     this.group.appendChild(this.cross);

// //     g.appendChild(this.group);
// //   }

//   drawLineHorizontal = (x, y, size, strokeWidth) => {
//     const xStart = x - size;
//     const xEnd = x + size;

//     const line = document.createElementNS(SVG_NAMESPACE, 'line');
//     line.setAttribute('x1', xStart);
//     line.setAttribute('y1', y);
//     line.setAttribute('x2', xEnd);
//     line.setAttribute('y2', y);
//     line.setAttribute('stroke-width', strokeWidth);
//     line.setAttribute('center-x', x);
//     line.setAttribute('center-y', y);
//     line.setAttribute('transform-origin', `${x} ${y}`);
//     return line;
//   }

//   drawLineVertical = (x, y, size, strokeWidth) => {
//     const yStart = y - size;
//     const yEnd = y + size;

//     const line = document.createElementNS(SVG_NAMESPACE, 'line');
//     line.setAttribute('x1', x);
//     line.setAttribute('y1', yStart);
//     line.setAttribute('x2', x);
//     line.setAttribute('y2', yEnd);
//     line.setAttribute('stroke-width', strokeWidth);
//     line.setAttribute('center-x', x);
//     line.setAttribute('center-y', y);
//     line.setAttribute('transform-origin', `${x} ${y}`);
//     return line;
//   }

// constructor(x, y, g, env) {
// this.env = env;

// this.group = document.createElementNS(SVG_NAMESPACE, 'g');
// this.group.setAttribute('class', 'a9s-selection');

// // this.cross = document.createElementNS(SVG_NAMESPACE, 'g');

// const inner = document.createElementNS(SVG_NAMESPACE, 'g');
// inner.setAttribute('class', 'a9s-inner');

// const lineHorizontal = this.drawLineHorizontal(x, y, 25, 4);
// lineHorizontal.setAttribute('class', 'a9s-pointcross-h');

// const lineVertical = this.drawLineVertical(x, y, 25, 4);
// lineVertical.setAttribute('class', 'a9s-pointcross-v');

// inner.appendChild(lineHorizontal);
// inner.appendChild(lineVertical);

// // const outer = this.drawLineVertical(x, y, 50, 4);
// const outer = document.createElementNS(SVG_NAMESPACE, 'g');
// outer.setAttribute('class', 'a9s-outer');

// outer.appendChild(lineHorizontal);
// outer.appendChild(lineVertical);

// this.group.appendChild(inner);
// this.group.appendChild(outer);

// // this.group.appendChild(this.cross);

// g.appendChild(this.group);
// }

//   get element() {
//     return this.group;
//   }

//   destroy = () => {
//     this.group.parentNode.removeChild(this.group);
//     // this.cross = null;
//     this.group = null;
//   }

//   toSelection = () =>
//     new Selection({
//       ...toSVGTarget(this.group, this.env.image),
//       renderedVia: {
//         name: 'pointcross'
//       }
//     });

// }

// TODO optional: mask to dim the outside area
//import Mask from './FreehandMask';

/**
 * A 'rubberband' selection tool for creating freehand drawing by
 * clicking and dragging.
 */
export default class PointcrossSelection {
  constructor(anchor, g, env) {
    this.point = anchor;

    this.env = env;

    this.group = document.createElementNS(SVG_NAMESPACE, 'g');

    this.pointcross = document.createElementNS(SVG_NAMESPACE, 'g');
    this.pointcross.setAttribute('class', 'a9s-selection');

    this.outer = document.createElementNS(SVG_NAMESPACE, 'path');
    this.outer.setAttribute('class', 'a9s-outer');

    this.inner = document.createElementNS(SVG_NAMESPACE, 'path');
    this.inner.setAttribute('class', 'a9s-inner');

    this.setPoint(this.point);

    // TODO optional: mask to dim the outside area
    // this.mask = new Mask(env.image, this.inner);

    this.pointcross.appendChild(this.outer);
    this.pointcross.appendChild(this.inner);

    // Additionally, selection remains hidden until
    // the user actually moves the mouse
    // this.group.style.display = 'none';

    // TODO optional: mask to dim the outside area
    // this.group.appendChild(this.mask.element);
    this.group.appendChild(this.pointcross);

    g.appendChild(this.group);

    // console.log('hey')
  }

  setPoint = (point) => {
    this.group.style.display = null;
    const x = parseFloat(point[0]);
    const y = parseFloat(point[1]);
    const startX = x - 25;
    const endX = x + 25;
    const startY = y - 25;
    const endY = y + 25;

    const str =
      'M' +
      x +
      ',' +
      startY +
      ' ' +
      'V' +
      endY +
      ' ' +
      'M' +
      startX +
      ',' +
      y +
      ' ' +
      'H' +
      endX;

    // 'M0,-1 V1 M-1,0 H1'

    this.outer.setAttribute('d', str);
    this.inner.setAttribute('d', str);
  };

  getBoundingClientRect = () => this.outer.getBoundingClientRect();

  dragTo = (xy) => {
    // Make visible
    // console.log(xy)
    // this.group.style.display = null;

    //TODO optional: edge smoothing

    this.setPoint(xy);

    // TODO optional: mask to dim the outside area
    // this.mask.redraw();
  };

  get element() {
    // console.log('hey2')
    return this.pointcross;
  }

  destroy = () => {
    // console.log('8');
    this.group.parentNode.removeChild(this.group);
    this.pointcross = null;
    this.group = null;
  };

  //   toSelection = () => {
  //     // new Selection({
  //     //     ...toSVGTarget(this.group, this.env.image),
  //     //     renderedVia: {
  //     //       name: 'pointcross'
  //     //     }
  //     //   });

  //     console.log('hey3')
  //     return new Selection(toSVGTarget(this.group, this.env.image));
  //   }

  toSelection = () =>
    new Selection({
      ...toSVGTarget(this.group, this.env.image),
      renderedVia: {
        name: 'pointcross',
      },
    });
}
