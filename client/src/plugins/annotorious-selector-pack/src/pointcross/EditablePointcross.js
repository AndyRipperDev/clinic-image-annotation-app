import EditableShape from '@recogito/annotorious/src/tools/EditableShape';
import { parseRectFragment } from '@recogito/annotorious/src/selectors/RectFragment';
import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';
import { toFragment } from './Pointcross';
import { drawEmbeddedSVG, svgFragmentToShape, toSVGTarget } from '@recogito/annotorious/src/selectors/EmbeddedSVG';
import { format, setFormatterElSize } from '@recogito/annotorious/src/util/Formatting';

// export default class EditablePointcross extends EditableShape {

//   drawPointcross = (x, y) => {
//     const containerGroup = document.createElementNS(SVG_NAMESPACE, 'g');
//     containerGroup.setAttribute('class', 'a9s-handle');

//     const group = document.createElementNS(SVG_NAMESPACE, 'g');

//     const drawLineHorizontal = size => {
//       const xStart = x - size;
//       const xEnd = x + size;
      
//       const line = document.createElementNS(SVG_NAMESPACE, 'line');
//       line.setAttribute('x1', xStart);
//       line.setAttribute('y1', y);
//       line.setAttribute('x2', xEnd);
//       line.setAttribute('y2', y);
//       line.setAttribute('stroke-width', 4);
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
//       line.setAttribute('stroke-width', 4);
//       line.setAttribute('transform-origin', `${x} ${y}`);
//       return line;
//     }

//     // const radius = this.config.handleRadius || 6;

//     const inner = drawLineHorizontal(25);
//     inner.setAttribute('class', 'a9s-handle-inner')

//     const outer = drawLineVertical(25);
//     outer.setAttribute('class', 'a9s-handle-outer')

//     group.appendChild(outer);
//     group.appendChild(inner);

//     containerGroup.appendChild(group);
//     return containerGroup;
//   }

//   // setPointcrossXY = (pointcross, x, y) => {
//   //   const inners = pointcross.querySelectorAll('.a9s-inner');

//   //   for (let i = 0; i < inners.length; i++) {
//   //    if (i===0) {
//   //     inners[i].setAttribute('x1', x - 25);
//   //     inners[i].setAttribute('y1', y);
//   //     inners[i].setAttribute('x2', x + 25);
//   //     inners[i].setAttribute('y2', y);
//   //     inners[i].setAttribute('center-x', x);
//   //     inners[i].setAttribute('center-y', y);
//   //     inners[i].setAttribute('transform-origin', `${x} ${y}`);
//   //    } else {
//   //     inners[i].setAttribute('x1', x);
//   //     inners[i].setAttribute('y1', y - 25);
//   //     inners[i].setAttribute('x2', x);
//   //     inners[i].setAttribute('y2', y + 25);
//   //     inners[i].setAttribute('center-x', x);
//   //     inners[i].setAttribute('center-y', y);
//   //     inners[i].setAttribute('transform-origin', `${x} ${y}`);
//   //    }
//   //   }
//   // }

//   setPointcrossXY = (pointcross, x, y) => {
//     const inner = pointcross.querySelector('.a9s-inner');
    
//     const lineHorizontal = inner.querySelector('.a9s-pointcross-h');
//     lineHorizontal.setAttribute('x1', x - 25);
//     lineHorizontal.setAttribute('y1', y);
//     lineHorizontal.setAttribute('x2', x + 25);
//     lineHorizontal.setAttribute('y2', y);
//     lineHorizontal.setAttribute('center-x', x);
//     lineHorizontal.setAttribute('center-y', y);
//     lineHorizontal.setAttribute('transform-origin', `${x} ${y}`);

//     const lineVertical = inner.querySelector('.a9s-pointcross-v');
//     lineVertical.setAttribute('x1', x);
//     lineVertical.setAttribute('y1', y - 25);
//     lineVertical.setAttribute('x2', x);
//     lineVertical.setAttribute('y2', y + 25);
//     lineVertical.setAttribute('center-x', x);
//     lineVertical.setAttribute('center-y', y);
//     lineVertical.setAttribute('transform-origin', `${x} ${y}`);

//     const outer = handle.querySelector('.a9s-outer');

//     const lineHorizontalOut = outer.querySelector('.a9s-pointcross-h');
//     lineHorizontalOut.setAttribute('x1', x - 25);
//     lineHorizontalOut.setAttribute('y1', y);
//     lineHorizontalOut.setAttribute('x2', x + 25);
//     lineHorizontalOut.setAttribute('y2', y);
//     lineHorizontalOut.setAttribute('center-x', x);
//     lineHorizontalOut.setAttribute('center-y', y);
//     lineHorizontalOut.setAttribute('transform-origin', `${x} ${y}`);

//     const lineVerticalOut = outer.querySelector('.a9s-pointcross-v');
//     lineVerticalOut.setAttribute('x1', x);
//     lineVerticalOut.setAttribute('y1', y - 25);
//     lineVerticalOut.setAttribute('x2', x);
//     lineVerticalOut.setAttribute('y2', y + 25);
//     lineVerticalOut.setAttribute('center-x', x);
//     lineVerticalOut.setAttribute('center-y', y);
//     lineVerticalOut.setAttribute('transform-origin', `${x} ${y}`);
//   }

//   constructor(annotation, g, config, env) {
//     // super(annotation, g, config, env);

//     // console.log(annotation)

//     // console.log('hey')
//     // this.svg.addEventListener('mousemove', this.onMouseMove);
//     // this.svg.addEventListener('mouseup', this.onMouseUp);

//     // const { x, y } = parseRectFragment(annotation, env.image);

//     // console.log('hey2')
//     // this.container = document.createElementNS(SVG_NAMESPACE, 'g');

//     // console.log('hey3')
//     // this.elementGroup = document.createElementNS(SVG_NAMESPACE, 'g');
//     // this.elementGroup.setAttribute('class', 'a9s-annotation editable selected');

//     // console.log('hey4')
//     // this.pointcross = this.drawPointcross(x, y);
//     // this.pointcross.addEventListener('mousedown', this.onGrab);
    
//     // console.log('hey5')
//     // this.elementGroup.appendChild(this.pointcross);

//     // console.log('hey6')
//     // this.container.appendChild(this.elementGroup);
//     // g.appendChild(this.container);

//     // console.log('hey7')
//     // // true if te mouse has grabbed the point
//     // this.isGrabbed = false;







//     super(annotation, g, config, env);

//     console.log(annotation)

//     console.log('hey')
//     this.svg.addEventListener('mousemove', this.onMouseMove);
//     this.svg.addEventListener('mouseup', this.onMouseUp);

//     // this.container = document.createElementNS(SVG_NAMESPACE, 'g');

//     this.shape = drawEmbeddedSVG(annotation);
//     this.shape.querySelector('.a9s-inner')
//       .addEventListener('mousedown', this.onGrab(this.shape));

      
//     // this.innerShapes = this.shape.querySelectorAll('.a9s-inner');
//     //   for (let i = 0; i < this.innerShapes.length; i++) {
//     //     this.innerShapes[i].addEventListener('mousedown', this.onGrab(this.shape));
//     // }

//       this.elementGroup = document.createElementNS(SVG_NAMESPACE, 'g');
//       this.elementGroup.setAttribute('class', 'a9s-annotation editable selected');
//       this.elementGroup.setAttribute('data-id', annotation.id);
//       this.elementGroup.appendChild(this.shape);
  
//       // this.container.appendChild(this.elementGroup);
//       g.appendChild(this.elementGroup);
  
//       format(this.shape, annotation, config.formatters);
  
//       this.isGrabbed = false;
//   }

//   // onScaleChanged = () => 
//   //   this.scaleHandle(this.pointcross);

//   get element() {
//     return this.elementGroup;
//   }

//   onGrab = () => {
//     this.isGrabbed = true;
//   }

//   onMouseMove = evt => {
//     if (evt.button !== 0) return;  // left click

//     if (this.isGrabbed) {
//       const {x, y} = this.getSVGPoint(evt);

//       // this.setPointcrossXY(this.pointcross, x, y);
//       this.setPointcrossXY(this.shape, x, y);

//       // const target = toFragment(x, y, this.env.image, this.config.fragmentUnit);
      
//       this.emit('update', toSVGTarget(this.shape, this.env.image));
//       // this.emit('update', target);
//     }
//   }

//   onMouseUp = () => {
//     this.isGrabbed = false;
//   }

//   updateState = annotation => {
//     // const { x, y } = parseRectFragment(annotation, this.env.image);
//     // this.setPointcrossXY(this.pointcross, x, y);
//   }

//   destroy() {
//     this.svg.removeEventListener('mousemove', this.onMouseMove);
//     this.svg.removeEventListener('mouseup', this.onMouseUp);

//     this.elementGroup.parentNode.removeChild(this.elementGroup);
//     super.destroy();
//   }

// }



















const getPoint = shape => {
  console.log('8');
  const svgPath = shape.getAttribute('d');

  const regex = /M(\S+),(\S+)/;
  const match = svgPath.match(regex);
  
  if (match) {
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);

    console.log(`x: ${x}, y: ${y}`)
    
    return [x, y + 25]
  } 

  console.log('rip')
  return [0, 0]
}

const getBBox = shape => {
  console.log('7');
  return shape.querySelector('.a9s-inner').getBBox();
}

/**
 * An editable freehand drawing.
 */
export default class EditablePointcross extends EditableShape {

  constructor(annotation, g, config, env) {
    
    console.log('6');
    super(annotation, g, config, env);

    this.svg.addEventListener('mousemove', this.onMouseMove);
    this.svg.addEventListener('mouseup', this.onMouseUp);

    // SVG markup for this class looks like this:
    // 
    // <g>
    //   <path class="a9s-selection mask"... />
    //   <g> <-- return this node as .element
    //     <polygon class="a9s-outer" ... />
    //     <polygon class="a9s-inner" ... />
    //     <g class="a9s-handle" ...> ... </g>
    //     <g class="a9s-handle" ...> ... </g>
    //     <g class="a9s-handle" ...> ... </g>
    //     ...
    //   </g> 
    // </g>

    // 'g' for the editable free drawing compound shape
    this.containerGroup = document.createElementNS(SVG_NAMESPACE, 'g');

    this.shape = drawEmbeddedSVG(annotation);

   // TODO optional: mask to dim the outside area
   // this.mask = new Mask(env.image, this.shape.querySelector('.a9s-inner'));
    
   // this.containerGroup.appendChild(this.mask.element);

    this.elementGroup = document.createElementNS(SVG_NAMESPACE, 'g');
    this.elementGroup.setAttribute('class', 'a9s-annotation editable selected');
    this.elementGroup.appendChild(this.shape);

    this.containerGroup.appendChild(this.elementGroup);
    g.appendChild(this.containerGroup);

    format(this.shape, annotation, config.formatter);

    this.shape.querySelector('.a9s-inner')
      .addEventListener('mousedown', this.onGrab(this.shape));

    const { x, y, width, height } = getBBox(this.shape);

    // TODO optional: handles to stretch the shape
/*    this.handles = [
      [ x, y ], 
      [ x + width, y ], 
      [ x + width, y + height ], 
      [ x, y + height ]
    ].map(t => { 
      const [ x, y ] = t;
      const handle = this.drawHandle(x, y);

      handle.addEventListener('mousedown', this.onGrab(handle));
      this.elementGroup.appendChild(handle);

      return handle;
    });*/

    // The grabbed element (handle or entire shape), if any
    this.grabbedElem = null;

    // Mouse grab point
    this.grabbedAt = null;
  }

  setPoint = (point) => {
    console.log('5');
    const pointX = parseFloat(point[0]);
    const pointY = parseFloat(point[1]);
    const startX = pointX - 25;
    const endX = pointX + 25;
    const startY = pointY - 25;
    const endY = pointY + 25;

    const str = 'M' + pointX + ',' + startY + ' ' + 'V' + endY + ' ' + 'M' + startX + ',' + pointY + ' ' + 'H' + endX;


    // // Not using .toFixed(1) because that will ALWAYS
    // // return one decimal, e.g. "15.0" (when we want "15")
    // const round = num => Math.round(10 * num) / 10;

    // var str = points.map(pt => `L${round(pt.x)} ${round(pt.y)}`).join(' ');
    // str = 'M' + str.substring(1);

    const inner = this.shape.querySelector('.a9s-inner');
    inner.setAttribute('d', str);

    const outer = this.shape.querySelector('.a9s-outer');
    outer.setAttribute('d', str);

    const { x, y, width, height } = outer.getBBox();

    // TODO optional: mask to dim the outside area
    // this.mask.redraw();

    // TODO optional: handles to stretch the shape
/*    const [ topleft, topright, bottomright, bottomleft] = this.handles;

    this.setHandleXY(topleft, x, y);
    this.setHandleXY(topright, x + width, y);
    this.setHandleXY(bottomright, x + width, y + height);
    this.setHandleXY(bottomleft, x, y + height);*/

    setFormatterElSize(this.elementGroup, x, y, width, height);
  }

    // TODO optional: handles to stretch the shape
/*  stretchCorners = (draggedHandleIdx, anchorHandle, mousePos) => {
    const anchor = this.getHandleXY(anchorHandle);
  }*/

  onGrab = grabbedElem => evt => {
    console.log('grabbed1');
    this.grabbedElem = grabbedElem;
    const pos = this.getSVGPoint(evt);
    this.grabbedAt = { x: pos.x, y: pos.y };
  }



  onMouseMove = evt => {
    console.log('4');
    const constrain = (coord, delta, max) =>
      coord + delta < 0 ? -coord : (coord + delta > max ? max - coord : delta);

      console.log('11');
    if (this.grabbedElem) {
      const pos = this.getSVGPoint(evt);

      const { x, y, width, height } = getBBox(this.shape);

      if (this.grabbedElem === this.shape) {

        console.log('grabbed');
        const { naturalWidth, naturalHeight } = this.env.image;

        const dx = constrain(x, pos.x - this.grabbedAt.x, naturalWidth - width);
        const dy = constrain(y, pos.y - this.grabbedAt.y, naturalHeight - height);

        const inner = this.shape.querySelector('.a9s-inner');
        let updatedPoint = getPoint(inner);
        updatedPoint[0] = updatedPoint[0] + dx
        updatedPoint[1] = updatedPoint[1] + dy


        this.grabbedAt = pos;

        this.setPoint(updatedPoint);
        console.log(updatedPoint)

        this.emit('update', toSVGTarget(this.shape, this.env.image));
      }
      // TODO optional: handles to stretch the shape
      /* else {
        const handleIdx = this.handles.indexOf(this.grabbedElem);
        const oppositeHandle = handleIdx < 2 ? 
          this.handles[handleIdx + 2] : this.handles[handleIdx - 2];

        this.stretchCorners(handleIdx, oppositeHandle, pos);

        this.emit('update', toSVGTarget(this.shape, this.env.image));
      }*/
    }
  }

  onMouseUp = evt => {
    console.log('2');
    this.grabbedElem = null;
    this.grabbedAt = null;
  }

  get element() {
    console.log('1');
    return this.elementGroup;
  }

  updateState = annotation => {
    console.log('uuuuupdated1');
    const point = getPoint(svgFragmentToShape(annotation));
    
    console.log('uuuuupdated');
    this.setPoint(point);
  }

  destroy = () => {
    console.log('3');
    
    this.containerGroup.parentNode.removeChild(this.containerGroup);
    super.destroy();
  }

}




