import EditableShape from '@recogito/annotorious/src/tools/EditableShape';
import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';
import {
  drawEmbeddedSVG,
  svgFragmentToShape,
  toSVGTarget,
} from '@recogito/annotorious/src/selectors/EmbeddedSVG';
import {
  format,
  setFormatterElSize,
} from '@recogito/annotorious/src/util/Formatting';

const getPoint = (shape) => {
  const svgPath = shape.getAttribute('d');

  const regex = /M(\S+),(\S+)/;
  const match = svgPath.match(regex);

  if (match) {
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);

    return [x, y + 25];
  }

  return [0, 0];
};

const getBBox = (shape) => {
  return shape.querySelector('.a9s-inner').getBBox();
};

export default class EditablePointcross extends EditableShape {
  constructor(annotation, g, config, env) {
    super(annotation, g, config, env);

    this.svg.addEventListener('mousemove', this.onMouseMove);
    this.svg.addEventListener('mouseup', this.onMouseUp);

    this.containerGroup = document.createElementNS(SVG_NAMESPACE, 'g');

    this.shape = drawEmbeddedSVG(annotation);

    this.elementGroup = document.createElementNS(SVG_NAMESPACE, 'g');
    this.elementGroup.setAttribute('class', 'a9s-annotation editable selected');
    this.elementGroup.appendChild(this.shape);

    this.containerGroup.appendChild(this.elementGroup);
    g.appendChild(this.containerGroup);

    format(this.shape, annotation, config.formatter);

    this.shape
      .querySelector('.a9s-inner')
      .addEventListener('mousedown', this.onGrab(this.shape));

    const { x, y, width, height } = getBBox(this.shape);

    // The grabbed element (handle or entire shape), if any
    this.grabbedElem = null;

    // Mouse grab point
    this.grabbedAt = null;
  }

  setPoint = (point) => {
    const pointX = parseFloat(point[0]);
    const pointY = parseFloat(point[1]);
    const startX = pointX - 25;
    const endX = pointX + 25;
    const startY = pointY - 25;
    const endY = pointY + 25;

    const str =
      'M' +
      pointX +
      ',' +
      startY +
      ' ' +
      'V' +
      endY +
      ' ' +
      'M' +
      startX +
      ',' +
      pointY +
      ' ' +
      'H' +
      endX;

    const inner = this.shape.querySelector('.a9s-inner');
    inner.setAttribute('d', str);

    const outer = this.shape.querySelector('.a9s-outer');
    outer.setAttribute('d', str);

    const { x, y, width, height } = outer.getBBox();

    setFormatterElSize(this.elementGroup, x, y, width, height);
  };

  onGrab = (grabbedElem) => (evt) => {
    this.grabbedElem = grabbedElem;
    const pos = this.getSVGPoint(evt);
    this.grabbedAt = { x: pos.x, y: pos.y };
  };

  onMouseMove = (evt) => {
    const constrain = (coord, delta, max) =>
      coord + delta < 0 ? -coord : coord + delta > max ? max - coord : delta;

    if (this.grabbedElem) {
      const pos = this.getSVGPoint(evt);

      const { x, y, width, height } = getBBox(this.shape);

      if (this.grabbedElem === this.shape) {
        const { naturalWidth, naturalHeight } = this.env.image;

        const dx = constrain(x, pos.x - this.grabbedAt.x, naturalWidth - width);
        const dy = constrain(
          y,
          pos.y - this.grabbedAt.y,
          naturalHeight - height,
        );

        const inner = this.shape.querySelector('.a9s-inner');
        let updatedPoint = getPoint(inner);
        updatedPoint[0] = updatedPoint[0] + dx;
        updatedPoint[1] = updatedPoint[1] + dy;

        this.grabbedAt = pos;

        this.setPoint(updatedPoint);

        this.emit('update', toSVGTarget(this.shape, this.env.image));
      }
    }
  };

  onMouseUp = (evt) => {
    this.grabbedElem = null;
    this.grabbedAt = null;
  };

  get element() {
    return this.elementGroup;
  }

  updateState = (annotation) => {
    const point = getPoint(svgFragmentToShape(annotation));

    this.setPoint(point);
  };

  destroy = () => {
    this.containerGroup.parentNode.removeChild(this.containerGroup);
    super.destroy();
  };
}
