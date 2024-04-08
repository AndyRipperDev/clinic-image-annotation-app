import React, { useEffect, useState } from 'react';
import OpenSeadragon, { SUBPIXEL_ROUNDING_OCCURRENCES } from 'openseadragon';
import PropTypes from 'prop-types';
import * as Annotorious from '@recogito/annotorious-openseadragon';
import ShapeLabelsFormatter from '@recogito/annotorious-shape-labels';
import Toolbar from '@recogito/annotorious-toolbar';
import SelectorPack from '@recogito/annotorious-selector-pack';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';

const ImageAnnotator = ({
  buttonSrcUrl,
  imageSrcUrl,
  imageUuid,
  isNewAnnotation,
}): JSX.Element => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotorious | null>(null);
  const navigate = useNavigate();

  console.log(isNewAnnotation);

  useEffect(() => {
    console.log('a');
    const colorFormatter = (annotation): string => {
      return 'dicom-annotation';
    };

    const viewer = OpenSeadragon({
      id: 'image-annotator',
      prefixUrl: buttonSrcUrl,
      tileSources: imageSrcUrl,
      subPixelRoundingForTransparency: SUBPIXEL_ROUNDING_OCCURRENCES.ALWAYS,
      maxZoomPixelRatio: 2,
    });

    const config = {
      allowEmpty: true,
      formatters: [ShapeLabelsFormatter(), colorFormatter],
    }; // Optional plugin config options

    const anno = Annotorious(viewer, config);
    SelectorPack(anno);
    Toolbar(anno, document.getElementById('image-annotator-toolbar-container'));

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

    console.log(isNewAnnotation);

    if (isNewAnnotation === false) {
      anno.loadAnnotations(
        `${process.env.BACKEND_API_URL}/annotations/${imageUuid}`,
      );
    }

    setAnnotations(anno);

    return () => {
      viewer.destroy();
    };
  }, [imageSrcUrl]);

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);

    const annotationData = annotations.getAnnotations();
    console.log(JSON.stringify(annotationData));

    if (isNewAnnotation === true) {
      console.log('post');

      // const formData = new FormData();
      // formData.append('test', 'w');
      // formData.append(
      //   'annotations',
      //   JSON.stringify(annotations.getAnnotations()),
      // );
      // console.log(formData);
      try {
        const response = await fetch(
          `${process.env.BACKEND_API_URL}/annotations/`,
          // {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(annotationData),
          // },
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              imageUuid,
              annotations: JSON.stringify(annotationData),
            }),
            // body: JSON.stringify(annotationData),
          },
        );

        if (response.ok) {
          // const responseData = await response.json();
          navigate(`/`);
        } else {
          setErrorMessage('File upload failed');
        }
      } catch (error) {
        setErrorMessage(`Error uploading file: ${error}`);
      } finally {
        setIsSaving(false);
      }
    } else {
      console.log('put');
      setIsSaving(false);
    }
    console.log(annotations.getAnnotations());
    // setIsSaving(false);
  };

  return (
    <>
      <LoadingButton
        onClick={() => {
          void handleSave();
        }}
        loading={isSaving}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="contained"
      >
        {isSaving ? 'Saving...' : 'Save'}
      </LoadingButton>
      {errorMessage !== null && <Alert severity="error">{errorMessage}</Alert>}
      <div id="image-annotator-toolbar-container"></div>
      <div id="image-annotator" style={{ width: '100%', height: '90vh' }}></div>
    </>
  );
};

ImageAnnotator.propTypes = {
  buttonSrcUrl: PropTypes.string,
  imageSrcUrl: PropTypes.string,
  imageUuid: PropTypes.string,
  isNewAnnotation: PropTypes.bool,
};

export default ImageAnnotator;
