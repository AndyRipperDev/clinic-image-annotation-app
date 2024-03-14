import React, { useState, useEffect } from 'react';
import ImageAnnotator from '../../components/Annotator/ImageAnnotator';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';

const AnnotationPage = (): JSX.Element => {
  const navigate = useNavigate();
  const params = useParams();
  const [isNewAnnotation, setIsNewAnnotation] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  console.log('is new');
  console.log(isNewAnnotation);

  const selectedImage = 'output.dzi';

  if (params.imageUuid === null) {
    navigate('/');
  } else {
    console.log(params.imageUuid);
  }

  const buttonUrl = `${process.env.BACKEND_API_URL}/viewer/images/`;
  const dziUrl = `${process.env.BACKEND_API_URL}/dzi_images/${params.imageUuid}/${selectedImage}`;

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      setIsLoading(true);

      void fetch(
        `${process.env.BACKEND_API_URL}/annotations/${params.imageUuid}`,
      )
        .then(async (response) => {
          if (response.status !== 404) {
            setIsNewAnnotation(false);
          }
          // if (!response.ok) {
          //   setErrorMessage('Error');
          // }

          return await response.json();
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="App App-header">
      {!isLoading && (
        <>
          {errorMessage !== null ? (
            <Alert severity="error">{errorMessage}</Alert>
          ) : (
            <ImageAnnotator
              buttonSrcUrl={buttonUrl}
              imageSrcUrl={dziUrl}
              imageUuid={params.imageUuid}
              isNewAnnotation={isNewAnnotation}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AnnotationPage;
