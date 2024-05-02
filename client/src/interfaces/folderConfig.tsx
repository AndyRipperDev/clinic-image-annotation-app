import type IConfigAnnotation from './configAnnotation';

export default interface IFolderConfig {
  drawingTools: string[];
  configAnnotations: IConfigAnnotation[];
}
