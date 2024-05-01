import React, { type ReactNode, useContext, useEffect, useState } from 'react';
import OpenSeadragon, { SUBPIXEL_ROUNDING_OCCURRENCES } from 'openseadragon';
import PropTypes from 'prop-types';
import * as Annotorious from '@recogito/annotorious-openseadragon';
import ShapeLabelsFormatter from '@recogito/annotorious-shape-labels';
// import SelectorPack from '@recogito/annotorious-selector-pack';
import SelectorPack from '../../plugins/annotorious-selector-pack';
import Alert from '@mui/material/Alert';
import SaveIcon from '@mui/icons-material/Save';
import { Link, useNavigate } from 'react-router-dom';
import { MenuContext } from '../../context/MenuContext';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import {
  Backdrop,
  CircularProgress,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
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
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import type IConfigAnnotation from '../../interfaces/configAnnotation';
import ColorIcon from '../Base/ColorIcon';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const ImageAnnotator = ({
  buttonSrcUrl,
  imageSrcUrl,
  folderName,
  dicomUuid,
  isNewAnnotation,
  folderConfig,
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [annotationCreated, setAnnotationCreated] = useState<boolean>(
    !(isNewAnnotation as boolean),
  );
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotorious | null>(null);
  const [drawingTool, setDrawingTool] = useState<string | null>('freehand');
  const [configAnnotation, setConfigAnnotation] =
    useState<IConfigAnnotation | null>(null);
  const [showLabels, setShowLabels] = useState<boolean>(false);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const navigate = useNavigate();

  const { menuButtons, setMenuButtons } = useContext(MenuContext);

  useEffect(() => {
    const colorFormatter2 = (annotation): string => {
      const tagBodies = annotation?.bodies?.filter((body) => {
        return body?.type === 'TextualBody' && body?.purpose === 'tagging';
      });

      const color = tagBodies[0]?.color as string;
      const availableColors = [
        'red',
        'green',
        'blue',
        'purple',
        'pink',
        'turquoise',
        'orange',
        'yellow',
      ];

      return availableColors.includes(color) ? `dicom-${color}` : 'dicom-red';
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
      formatters: [colorFormatter2],
    };

    const anno = Annotorious(viewer, config);
    SelectorPack(anno);

    // anno.setDrawingEnabled(true);
    anno.setDrawingTool('freehand');

    // anno.on('createAnnotation', async (annotation, overrideId) => {
    //   console.log('create');
    // });

    // anno.on('updateAnnotation', function (annotation, previous) {
    //   console.log('update');
    // });

    // anno.on('deleteAnnotation', function (annotation) {
    //   console.log('delete');
    // });

    if (isNewAnnotation === false) {
      setAnnotationCreated(true);
      anno.loadAnnotations(
        `${process.env.BACKEND_API_URL}/folders/${folderName}/annotations/${dicomUuid}`,
      );
    }

    setAnnotations(anno);

    return () => {
      viewer.destroy();
    };
  }, [imageSrcUrl, isNewAnnotation]);

  useEffect(() => {
    if (folderConfig !== null) {
      setConfigAnnotation(
        folderConfig.configAnnotations[0] as IConfigAnnotation,
      );
    }
    return () => {
      setConfigAnnotation(null);
    };
  }, [folderConfig]);

  const handleSave = async (): Promise<void> => {
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

  const handleShowLabels = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const checked = event.target.checked;

    if (checked) {
      annotations.formatters.push(ShapeLabelsFormatter());
    } else {
      annotations.formatters.pop();
    }

    const annots = annotations.getAnnotations();
    if (annots?.length !== 0) {
      annots?.forEach(async (annot) => {
        annotations.selectAnnotation(annot);
        await annotations.updateSelected(annot);
      });

      annotations.cancelSelected();
    }

    setShowLabels(checked);
  };

  const handleShowAnnotations = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const checked = event.target.checked;
    annotations.setVisible(checked);
    setShowAnnotations(checked);
  };

  const getDrawingToolIcon = (drawingToolName): ReactNode => {
    if (drawingToolName === 'point') {
      return <GpsFixedIcon />;
    } else if (drawingToolName === 'pointcross') {
      return <AddIcon />;
    } else if (drawingToolName === 'line') {
      return <LinearScaleIcon />;
    } else if (drawingToolName === 'freehand') {
      return <GestureIcon />;
    } else if (drawingToolName === 'polygon') {
      return <PolylineIcon />;
    } else if (drawingToolName === 'rect') {
      return <Crop32Icon />;
    } else if (drawingToolName === 'circle') {
      return <RadioButtonUncheckedIcon />;
    } else if (drawingToolName === 'ellipse') {
      return <BlurCircularIcon />;
    } else {
      return <GpsFixedIcon />;
    }
  };

  const getDrawingToolText = (drawingToolName): string => {
    if (drawingToolName === 'point') {
      return 'Point Circle';
    } else if (drawingToolName === 'pointcross') {
      return 'Point Cross';
    } else if (drawingToolName === 'line') {
      return 'Line';
    } else if (drawingToolName === 'freehand') {
      return 'Freehand';
    } else if (drawingToolName === 'polygon') {
      return 'Polygon';
    } else if (drawingToolName === 'rect') {
      return 'Rectangle';
    } else if (drawingToolName === 'circle') {
      return 'Circle';
    } else if (drawingToolName === 'ellipse') {
      return 'Ellipse';
    } else {
      return 'Point';
    }
  };

  useEffect(() => {
    const optionList = (
      <>
        <ListItem>
          <ListItemIcon>
            <GestureIcon />
          </ListItemIcon>
          <ListItemText id="switchShowAnnotations" primary="Show Annotations" />
          <Switch
            edge="end"
            onChange={handleShowAnnotations}
            checked={showAnnotations}
            inputProps={{
              'aria-labelledby': 'switchShowAnnotations',
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <FormatColorTextIcon />
          </ListItemIcon>
          <ListItemText id="switchShowLabels" primary="Show Labels" />
          <Switch
            edge="end"
            onChange={handleShowLabels}
            checked={showLabels}
            inputProps={{
              'aria-labelledby': 'switchShowLabels',
            }}
          />
        </ListItem>
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
            void handleSave();
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
        <ListItemButton component={Link} to={`/folders/${folderName}`}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Exit" />
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
        {folderConfig?.drawingTools?.map((drawingToolItem) => (
          <ListItemButton
            key={drawingToolItem}
            component={ToggleButton}
            value={drawingToolItem}
            sx={{ textTransform: 'none' }}
          >
            <ListItemIcon>{getDrawingToolIcon(drawingToolItem)}</ListItemIcon>
            <ListItemText primary={getDrawingToolText(drawingToolItem)} />
          </ListItemButton>
        ))}
      </ToggleButtonGroup>
    );

    const configAnnotationList = (
      <ToggleButtonGroup
        orientation="vertical"
        value={configAnnotation}
        exclusive
        onChange={handleSetConfigAnnotation}
        sx={{ width: '100%' }}
      >
        {folderConfig?.configAnnotations?.map((configAnnotationItem) => (
          <ListItemButton
            key={configAnnotationItem.name}
            component={ToggleButton}
            value={configAnnotationItem}
            sx={{ textTransform: 'none' }}
          >
            <ListItemIcon>
              <ColorIcon colorName={configAnnotationItem.color} />
            </ListItemIcon>
            <ListItemText primary={configAnnotationItem.name} />
          </ListItemButton>
        ))}
      </ToggleButtonGroup>
    );

    setMenuButtons({ drawingToolList, optionList, configAnnotationList });

    annotations?.on('createSelection', async (selection) => {
      selection.body = [
        {
          type: 'TextualBody',
          purpose: 'tagging',
          value: configAnnotation?.name,
          color: configAnnotation?.color,
        },
      ];

      await annotations.updateSelected(selection);
    });
    return () => {
      setMenuButtons(null);
    };
  }, [
    annotations,
    annotationCreated,
    drawingTool,
    configAnnotation,
    showLabels,
    showAnnotations,
  ]);

  const handleSetDrawingTool = (
    event: React.MouseEvent<HTMLElement>,
    newDrawingTool: string | null,
  ): void => {
    if (newDrawingTool === null) return;

    setDrawingTool(newDrawingTool);

    // annotations.setDrawingEnabled(true);
    annotations.setDrawingTool(newDrawingTool);
  };

  const handleSetConfigAnnotation = (
    event: React.MouseEvent<HTMLElement>,
    newConfigAnnotation: IConfigAnnotation | null,
  ): void => {
    if (newConfigAnnotation === null) return;

    setConfigAnnotation(newConfigAnnotation);
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
  folderConfig: PropTypes.object,
};

export default ImageAnnotator;
