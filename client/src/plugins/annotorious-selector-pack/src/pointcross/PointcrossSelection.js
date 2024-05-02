import { Selection } from '@recogito/annotorious/src/tools/Tool';
import { toSVGTarget } from '@recogito/annotorious/src/selectors/EmbeddedSVG';
import { SVG_NAMESPACE } from '@recogito/annotorious/src/util/SVG';

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

    this.pointcross.appendChild(this.outer);
    this.pointcross.appendChild(this.inner);

    this.group.appendChild(this.pointcross);

    g.appendChild(this.group);
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

    this.outer.setAttribute('d', str);
    this.inner.setAttribute('d', str);
  };

  getBoundingClientRect = () => this.outer.getBoundingClientRect();

  dragTo = (xy) => {
    this.setPoint(xy);
  };

  get element() {
    return this.pointcross;
  }

  destroy = () => {
    this.group.parentNode.removeChild(this.group);
    this.pointcross = null;
    this.group = null;
  };

  toSelection = () =>
    new Selection({
      ...toSVGTarget(this.group, this.env.image),
      renderedVia: {
        name: 'pointcross',
      },
    });
}
