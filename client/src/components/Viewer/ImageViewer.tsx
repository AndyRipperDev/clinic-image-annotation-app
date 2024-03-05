import React, { useEffect } from 'react';
import OpenSeadragon from 'openseadragon';
import PropTypes from 'prop-types';

const ImageViewer = ({ imageSrc, buttonSrc }): JSX.Element => {
  useEffect(() => {
    const viewer = OpenSeadragon({
      id: 'image-viewer',
      prefixUrl: buttonSrc,
      tileSources: imageSrc,
    });

    return () => {
      viewer.destroy();
    };
  }, [imageSrc]);

  return (
    <div id="image-viewer" style={{ width: '100%', height: '100vh' }}></div>
  );
};

ImageViewer.propTypes = {
  imageSrc: PropTypes.string,
  buttonSrc: PropTypes.string,
};

export default ImageViewer;
