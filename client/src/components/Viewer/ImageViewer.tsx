import React, { useEffect } from 'react';
import OpenSeadragon from 'openseadragon';
import PropTypes from 'prop-types';
import * as Annotorious from '@recogito/annotorious-openseadragon';
import ShapeLabelsFormatter from '@recogito/annotorious-shape-labels';
import Toolbar from '@recogito/annotorious-toolbar';
import SelectorPack from '@recogito/annotorious-selector-pack';

const ImageViewer = ({ imageSrc, buttonSrc }): JSX.Element => {
  useEffect(() => {
    const colorFormatter = (annotation): string => {
      //   const label = annotation.bodies.find((b) => b.purpose === 'tagging');

      return 'testing';
    };

    const viewer = OpenSeadragon({
      id: 'image-viewer',
      prefixUrl: buttonSrc,
      tileSources: imageSrc,
    });

    const config = {
      allowEmpty: true,
      formatters: [ShapeLabelsFormatter(), colorFormatter],
    }; // Optional plugin config options

    const anno = Annotorious(viewer, config);
    SelectorPack(anno);
    Toolbar(anno, document.getElementById('my-toolbar-container'));

    anno.setDrawingTool('rect');

    anno.on('createAnnotation', async (annotation, overrideId) => {
      console.log('create');
      console.log(annotation);
      // POST to the server and receive a new ID
      // const newId = await server.createAnnotation(annotation);

      // Inject that ID into RecogitoJS
      // overrideId(newId);
    });

    anno.on('updateAnnotation', function (annotation, previous) {
      console.log('update');
      console.log(annotation);
      console.log(anno.getAnnotations());
    });

    anno.on('deleteAnnotation', function (annotation) {
      console.log('delete');
      console.log(annotation);
    });

    anno.loadAnnotations(`${process.env.BACKEND_API_URL}/annotations`);

    return () => {
      viewer.destroy();
    };
  }, [imageSrc]);

  return (
    <>
      <div id="my-toolbar-container"></div>
      <div id="image-viewer" style={{ width: '100%', height: '90vh' }}></div>
    </>
  );
};

ImageViewer.propTypes = {
  imageSrc: PropTypes.string,
  buttonSrc: PropTypes.string,
};

export default ImageViewer;
