import React, { useState, useEffect } from 'react';
import ImageAnnotator from '../../components/Annotator/ImageAnnotator';
import { useNavigate, useParams } from 'react-router-dom';
import type IFolderConfig from '../../interfaces/folderConfig';
import CircularLoading from '../../components/Loadings/CircularLoading';

const AnnotationPage = (): JSX.Element => {
  const navigate = useNavigate();
  const params = useParams();
  const [isNewAnnotation, setIsNewAnnotation] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasDziImagesReady, setHasDziImagesReady] = useState<boolean>(false);
  const [folderConfig, setFolderConfig] = useState<IFolderConfig | null>(null);

  const selectedImage = 'output.dzi';

  if (params.folderName === null || params.dicomUuid === null) {
    navigate('/');
  }

  const buttonUrl = `${process.env.BACKEND_API_URL}/viewer/images/`;
  const dziUrl = `${process.env.BACKEND_API_URL}/dzi_images/${params.dicomUuid}/${selectedImage}`;

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      setIsLoading(true);

      void fetch(
        `${process.env.BACKEND_API_URL}/folders/${params.folderName}/annotations/${params.dicomUuid}`,
      ).then(async (response) => {
        if (response.status !== 404) {
          setIsNewAnnotation(false);
        }

        return await response.json();
      });

      void fetch(
        `${process.env.BACKEND_API_URL}/folders/${params.folderName}/config`,
      ).then(async (response) => {
        if (response.status === 200) {
          const config = await response.json();
          setFolderConfig(config as IFolderConfig);
        }
      });

      void fetch(
        `${process.env.BACKEND_API_URL}/folders/${params.folderName}/dicom/${params.dicomUuid}/dzi`,
      )
        .then(async (response) => {
          if (response.status === 200) {
            setHasDziImagesReady(true);
          }
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
      {isLoading || !hasDziImagesReady ? (
        <CircularLoading />
      ) : (
        <ImageAnnotator
          buttonSrcUrl={buttonUrl}
          imageSrcUrl={dziUrl}
          folderName={params.folderName}
          dicomUuid={params.dicomUuid}
          isNewAnnotation={isNewAnnotation}
          folderConfig={folderConfig}
        />
      )}
    </div>
  );
};

export default AnnotationPage;
