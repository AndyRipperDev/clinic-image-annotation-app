import * as React from 'react';
import PropTypes from 'prop-types';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Crop32Icon from '@mui/icons-material/Crop32';
import GestureIcon from '@mui/icons-material/Gesture';
import PolylineIcon from '@mui/icons-material/Polyline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import AddIcon from '@mui/icons-material/Add';

const DrawingToolSelector = ({ drawingTools, onChange }): JSX.Element => {
  return (
    <ToggleButtonGroup
      value={drawingTools}
      onChange={onChange}
      aria-label="drawingTools"
    >
      <Tooltip title="Point Circle">
        <ToggleButton value="point" aria-label="point">
          <GpsFixedIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Point Cross">
        <ToggleButton value="pointcross" aria-label="pointcross">
          <AddIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Line">
        <ToggleButton value="line" aria-label="line">
          <LinearScaleIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Freehand">
        <ToggleButton value="freehand" aria-label="freehand">
          <GestureIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Polygon">
        <ToggleButton value="polygon" aria-label="polygon">
          <PolylineIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Rectangle">
        <ToggleButton value="rect" aria-label="rect">
          <Crop32Icon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Circle">
        <ToggleButton value="circle" aria-label="circle">
          <RadioButtonUncheckedIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Ellipse">
        <ToggleButton value="ellipse" aria-label="ellipse">
          <BlurCircularIcon />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
};

DrawingToolSelector.propTypes = {
  drawingTools: PropTypes.array,
  onChange: PropTypes.func,
};

export default DrawingToolSelector;
