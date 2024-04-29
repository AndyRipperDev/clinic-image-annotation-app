import React, { useContext, useEffect, useState } from 'react';
import OpenSeadragon, { SUBPIXEL_ROUNDING_OCCURRENCES } from 'openseadragon';
import PropTypes from 'prop-types';
import * as Annotorious from '@recogito/annotorious-openseadragon';
import ShapeLabelsFormatter from '@recogito/annotorious-shape-labels';
import Toolbar from '@recogito/annotorious-toolbar';
// import SelectorPack from '@recogito/annotorious-selector-pack';
import SelectorPack from '../../plugins/annotorious-selector-pack';
import Alert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import { MenuContext } from '../../context/MenuContext';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import {
  Backdrop,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import SnackbarAlert from '../Feedback/SnackbarAlert';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Crop32Icon from '@mui/icons-material/Crop32';
import GestureIcon from '@mui/icons-material/Gesture';
import PolylineIcon from '@mui/icons-material/Polyline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import AddIcon from '@mui/icons-material/Add';

const ImageAnnotator = ({
  buttonSrcUrl,
  imageSrcUrl,
  folderName,
  dicomUuid,
  isNewAnnotation,
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [annotationCreated, setAnnotationCreated] = useState<boolean>(
    !(isNewAnnotation as boolean),
  );
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotorious | null>(null);
  const [drawingTool, setDrawingTool] = useState<string | null>('freehand');
  const navigate = useNavigate();

  const { menuButtons, setMenuButtons } = useContext(MenuContext);

  console.log(isNewAnnotation);
  console.log(`is new:${isNewAnnotation}`);
  console.log(`is newsda:${annotationCreated}`);

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
      gestureSettingsMouse: {
        clickToZoom: false,
      },
    });

    const config = {
      allowEmpty: true,
      disableEditor: true,
      // gigapixelMode: true,
      formatters: [ShapeLabelsFormatter(), colorFormatter],
    }; // Optional plugin config options

    const anno = Annotorious(viewer, config);
    SelectorPack(anno);
    // Toolbar(anno, document.getElementById('image-annotator-toolbar-container'));

    // anno.setDrawingEnabled(true);
    anno.setDrawingTool('freehand');

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
        `${process.env.BACKEND_API_URL}/folders/${folderName}/annotations/${dicomUuid}`,
      );
    }

    setAnnotations(anno);

    return () => {
      viewer.destroy();
    };
  }, [imageSrcUrl]);

  const handleSave = async (): Promise<void> => {
    setIsLoading(true);

    const annotationData = annotations.getAnnotations();
    console.log(JSON.stringify(annotationData));

    if (!annotationCreated) {
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
          `${process.env.BACKEND_API_URL}/folders/${folderName}/annotations`,
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
              dicomUuid,
              annotationData: JSON.stringify(annotationData),
            }),
            // body: JSON.stringify(annotationData),
          },
        );

        if (response.ok) {
          // const responseData = await response.json();
          navigate(`/`);
          setAnnotationCreated(true);
        } else {
          setErrorMessage('File upload failed');
        }
      } catch (error) {
        setErrorMessage(`Error uploading file: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('put');
      setIsLoading(false);
    }
    console.log(annotations.getAnnotations());
    // setIsLoading(false);
  };

  const handleSaveNew = async (): Promise<void> => {
    setIsLoading(true);

    const annotationData = annotations.getAnnotations();

    try {
      let response = new Response();
      if (!annotationCreated) {
        response = await fetch(
          `${process.env.BACKEND_API_URL}/folders/${folderName}/annotations`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              dicomUuid,
              annotationData: JSON.stringify(annotationData),
            }),
          },
        );
      } else {
        response = await fetch(
          `${process.env.BACKEND_API_URL}/folders/${folderName}/annotations/${dicomUuid}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              annotationData: JSON.stringify(annotationData),
            }),
          },
        );
      }

      if (response.ok) {
        setAnnotationCreated(true);
        setSnackbarOpen(true);
      } else {
        setErrorMessage('File upload failed');
      }
    } catch (error) {
      setErrorMessage(`Error uploading file: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndExit = async (): Promise<void> => {
    setIsLoading(true);

    const annotationData = annotations.getAnnotations();

    try {
      let response = new Response();
      if (!annotationCreated) {
        response = await fetch(
          `${process.env.BACKEND_API_URL}/folders/${folderName}/annotations`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              dicomUuid,
              annotationData: JSON.stringify(annotationData),
            }),
          },
        );
      } else {
        response = await fetch(
          `${process.env.BACKEND_API_URL}/folders/${folderName}/annotations/${dicomUuid}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              annotationData: JSON.stringify(annotationData),
            }),
          },
        );
      }

      if (response.ok) {
        navigate(`/folders/${folderName}`);

        setAnnotationCreated(true);
      } else {
        setErrorMessage('File upload failed');
      }
    } catch (error) {
      setErrorMessage(`Error uploading file: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/folders/${folderName}/annotations/${dicomUuid}`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        navigate(`/folders/${folderName}`);
      } else {
        const data = await response.json();
        setErrorMessage(data?.error as string);
      }
    } catch (error) {
      setErrorMessage(error.message as string);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = (): void => {
    annotations.clearAnnotations();
  };

  useEffect(() => {
    const optionList = (
      <>
        <ListItemButton
          onClick={() => {
            void handleSaveAndExit();
          }}
        >
          <ListItemIcon>
            <ContentPasteGoIcon />
          </ListItemIcon>
          <ListItemText primary={'Save and Exit'} />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            void handleSaveNew();
          }}
        >
          <ListItemIcon>
            <SaveIcon />
          </ListItemIcon>
          <ListItemText primary={'Save'} />
        </ListItemButton>
        <ListItemButton onClick={handleClear}>
          <ListItemIcon>
            <LayersClearIcon />
          </ListItemIcon>
          <ListItemText primary={'Clear'} />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            void handleDelete();
          }}
        >
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
          <ListItemText primary={'Delete'} />
        </ListItemButton>
      </>
    );

    const drawingToolList = (
      <ToggleButtonGroup
        orientation="vertical"
        value={drawingTool}
        exclusive
        onChange={handleSetDrawingTool}
        sx={{ width: '100%' }}
      >
        <ListItemButton
          component={ToggleButton}
          value={'point'}
          sx={{ textTransform: 'none' }}
        >
          <ListItemIcon>
            <GpsFixedIcon />
          </ListItemIcon>
          <ListItemText primary={'Point Circle'} />
        </ListItemButton>
        <ListItemButton
          component={ToggleButton}
          value={'pointcross'}
          sx={{ textTransform: 'none' }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary={'Point Cross'} />
        </ListItemButton>
        <ListItemButton
          component={ToggleButton}
          value={'line'}
          sx={{ textTransform: 'none' }}
        >
          <ListItemIcon>
            <LinearScaleIcon />
          </ListItemIcon>
          <ListItemText primary={'Line'} />
        </ListItemButton>
        <ListItemButton
          component={ToggleButton}
          value={'freehand'}
          sx={{ textTransform: 'none' }}
        >
          <ListItemIcon>
            <GestureIcon />
          </ListItemIcon>
          <ListItemText primary={'Freehand'} />
        </ListItemButton>
        <ListItemButton
          component={ToggleButton}
          value={'polygon'}
          sx={{ textTransform: 'none' }}
        >
          <ListItemIcon>
            <PolylineIcon />
          </ListItemIcon>
          <ListItemText primary={'Polygon'} />
        </ListItemButton>
        <ListItemButton
          component={ToggleButton}
          value={'rect'}
          sx={{ textTransform: 'none' }}
        >
          <ListItemIcon>
            <Crop32Icon />
          </ListItemIcon>
          <ListItemText primary={'Rectangle'} />
        </ListItemButton>
        <ListItemButton
          component={ToggleButton}
          value={'circle'}
          sx={{ textTransform: 'none' }}
        >
          <ListItemIcon>
            <RadioButtonUncheckedIcon />
          </ListItemIcon>
          <ListItemText primary={'Circle'} />
        </ListItemButton>
        <ListItemButton
          component={ToggleButton}
          value={'ellipse'}
          sx={{ textTransform: 'none' }}
        >
          <ListItemIcon>
            <BlurCircularIcon />
          </ListItemIcon>
          <ListItemText primary={'Ellipse'} />
        </ListItemButton>
      </ToggleButtonGroup>
    );

    setMenuButtons({ drawingToolList, optionList });
    return () => {
      setMenuButtons(null);
    };
  }, [annotations, annotationCreated, drawingTool]);

  const handleSetDrawingTool = (
    event: React.MouseEvent<HTMLElement>,
    newDrawingTool: string | null,
  ): void => {
    if (newDrawingTool === null) return;

    setDrawingTool(newDrawingTool);

    // annotations.setDrawingEnabled(true);
    annotations.setDrawingTool(newDrawingTool);
  };

  return (
    <>
      {errorMessage !== null && (
        <Alert variant="outlined" severity="error">
          {errorMessage}
        </Alert>
      )}
      <SnackbarAlert
        text={'Saved'}
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        id="image-annotator"
        style={{ width: '100%', height: '100vh' }}
      ></div>
    </>
  );
};

ImageAnnotator.propTypes = {
  buttonSrcUrl: PropTypes.string,
  imageSrcUrl: PropTypes.string,
  folderName: PropTypes.string,
  dicomUuid: PropTypes.string,
  isNewAnnotation: PropTypes.bool,
};

export default ImageAnnotator;
