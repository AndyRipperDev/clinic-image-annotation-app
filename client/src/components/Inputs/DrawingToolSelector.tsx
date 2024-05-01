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

const DrawingToolSelector = ({
  drawingTools,
  onChange,
  disabled = false,
}): JSX.Element => {
  return (
    <ToggleButtonGroup
      value={drawingTools}
      onChange={onChange}
      aria-label="drawingTools"
    >
      <Tooltip title="Point Circle">
        <ToggleButton value="point" aria-label="point" disabled={disabled}>
          <GpsFixedIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Point Cross">
        <ToggleButton
          value="pointcross"
          aria-label="pointcross"
          disabled={disabled}
        >
          <AddIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Line">
        <ToggleButton value="line" aria-label="line" disabled={disabled}>
          <LinearScaleIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Freehand">
        <ToggleButton
          value="freehand"
          aria-label="freehand"
          disabled={disabled}
        >
          <GestureIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Polygon">
        <ToggleButton value="polygon" aria-label="polygon" disabled={disabled}>
          <PolylineIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Rectangle">
        <ToggleButton value="rect" aria-label="rect" disabled={disabled}>
          <Crop32Icon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Circle">
        <ToggleButton value="circle" aria-label="circle" disabled={disabled}>
          <RadioButtonUncheckedIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Ellipse">
        <ToggleButton value="ellipse" aria-label="ellipse" disabled={disabled}>
          <BlurCircularIcon />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
};

DrawingToolSelector.propTypes = {
  drawingTools: PropTypes.array,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default DrawingToolSelector;
