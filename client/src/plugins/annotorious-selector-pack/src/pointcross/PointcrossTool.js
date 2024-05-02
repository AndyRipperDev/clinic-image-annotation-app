import Tool from '@recogito/annotorious/src/tools/Tool';
import EditablePointcross from './EditablePointcross';
import PointcrossSelection from './PointcrossSelection';

export default class PointcrossTool extends Tool {
  constructor(g, config, env) {
    super(g, config, env);
  }

  startDrawing = (x, y) => {
    this.pointcrossSelection = new PointcrossSelection(
      [x, y],
      this.g,
      this.env,
    );

    const shape = this.pointcrossSelection.element;
    shape.annotation = this.pointcrossSelection.toSelection();
    this.emit('complete', shape);
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
