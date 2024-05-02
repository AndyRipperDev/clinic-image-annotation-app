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
        <span>
          <ToggleButton value="point" aria-label="point" disabled={disabled}>
            <GpsFixedIcon />
          </ToggleButton>
        </span>
      </Tooltip>
      <Tooltip title="Point Cross">
        <span>
          <ToggleButton
            value="pointcross"
            aria-label="pointcross"
            disabled={disabled}
          >
            <AddIcon />
          </ToggleButton>
        </span>
      </Tooltip>
      <Tooltip title="Line">
        <span>
          <ToggleButton value="line" aria-label="line" disabled={disabled}>
            <LinearScaleIcon />
          </ToggleButton>
        </span>
      </Tooltip>
      <Tooltip title="Freehand">
        <span>
          <ToggleButton
            value="freehand"
            aria-label="freehand"
            disabled={disabled}
          >
            <GestureIcon />
          </ToggleButton>
        </span>
      </Tooltip>
      <Tooltip title="Polygon">
        <span>
          <ToggleButton
            value="polygon"
            aria-label="polygon"
            disabled={disabled}
          >
            <PolylineIcon />
          </ToggleButton>
        </span>
      </Tooltip>
      <Tooltip title="Rectangle">
        <span>
          <ToggleButton value="rect" aria-label="rect" disabled={disabled}>
            <Crop32Icon />
          </ToggleButton>
        </span>
      </Tooltip>
      <Tooltip title="Circle">
        <span>
          <ToggleButton value="circle" aria-label="circle" disabled={disabled}>
            <RadioButtonUncheckedIcon />
          </ToggleButton>
        </span>
      </Tooltip>
      <Tooltip title="Ellipse">
        <span>
          <ToggleButton
            value="ellipse"
            aria-label="ellipse"
            disabled={disabled}
          >
            <BlurCircularIcon />
          </ToggleButton>
        </span>
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
