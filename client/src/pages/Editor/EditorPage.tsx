import React from 'react';
import ImageViewer from '../../components/Viewer/ImageViewer';
import { useNavigate } from 'react-router-dom';

const EditorPage = (): JSX.Element => {
  const navigate = useNavigate();
  const selectedImage = 'output.dzi';
  const fileUUID = localStorage.getItem('fileUUID');
  let parsedFileUUID = '';

  if (fileUUID !== null) {
    parsedFileUUID = JSON.parse(fileUUID);
    console.log(parsedFileUUID);
  } else {
    navigate('/');
  }

  const buttonUrl = `${process.env.BACKEND_API_URL}/viewer/images/`;
  const dziUrl = `${process.env.BACKEND_API_URL}/dzi_images/${parsedFileUUID}/${selectedImage}`;

  return (
    <div className="App App-header">
      <ImageViewer imageSrc={dziUrl} buttonSrc={buttonUrl} />
    </div>
  );
};

export default EditorPage;
