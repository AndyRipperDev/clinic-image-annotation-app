import React, { useState, useEffect } from 'react';
import { ButtonGroup, Divider, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router-dom';
import Title from '../../components/Base/Title';
import type IConfigAnnotation from '../../interfaces/configAnnotation';
import DrawingToolSelector from '../../components/Inputs/DrawingToolSelector';
import AnnotationConfigurationInput from '../../components/Inputs/AnnotationConfigurationInput';
import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined';
import ErrorAlert from '../../components/Feedback/ErrorAlert';
import { LoadingButton } from '@mui/lab';
import ConfigUploader from '../../components/Uploader/ConfigUploader';

const FolderConfigPage = (): JSX.Element => {
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [configAnnotations, setConfigAnnotations] = useState<
    IConfigAnnotation[]
  >([]);

  const [drawingTools, setDrawingTools] = useState(() => [
    'point',
    'pointcross',
    'line',
    'freehand',
    'polygon',
    'rect',
    'circle',
    'ellipse',
  ]);

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      setIsLoading(true);

      void fetch(
        `${process.env.BACKEND_API_URL}/folders/${params.folderName}/config`,
      )
        .then(async (response) => {
          if (response.status === 200) {
            navigate(`/folders/${params.folderName}`);
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

  const handleDrawingTools = (
    event: React.MouseEvent<HTMLElement>,
    newDrawingTools: string[],
  ): void => {
    if (newDrawingTools.length > 0) {
      setDrawingTools(newDrawingTools);
    }
  };

  const handleUploadError = (error: string): void => {
    setErrorMessage(error);
  };

  const handleSaveConfig = async (): Promise<void> => {
    setIsLoading(true);

    if (configAnnotations.length === 0) {
      setIsLoading(false);
      setErrorMessage('Please add at least one annotation configuration');
      return;
    }

    const formData = new URLSearchParams();
    formData.append(
      'config',
      JSON.stringify({ drawingTools, configAnnotations }),
    );

    try {
      const response = await fetch(
        `${process.env.BACKEND_API_URL}/folders/${params.folderName}/config`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (response.ok) {
        navigate(`/folders/${params.folderName}`);
      } else {
        const responseData = await response.json();
        setErrorMessage(responseData.error as string);
      }
    } catch (error) {
      setErrorMessage(error.message as string);
    } finally {
      setIsLoading(false);
    }
  };

  if (params.folderName === null) {
    navigate('/');
  }

  return (
    <div>
      <Title text={`${params.folderName} Configuration`} textAlign={'left'} />

      <Typography
        sx={{
          mt: 2,
          mb: 4,
        }}
      >
        You can configure annotations for this folder manually or you can import
        already created configuration.
      </Typography>

      {errorMessage !== null && (
        <ErrorAlert text={errorMessage} marginTop={4} />
      )}

      <Stack
        component="section"
        direction="row"
        justifyContent="left"
        alignItems="center"
        sx={{
          mt: 4,
          pb: 2,
        }}
      >
        <ButtonGroup variant="outlined">
          <ConfigUploader
            folderName={params.folderName}
            onError={handleUploadError}
          />
          <LoadingButton
            variant="outlined"
            color="primary"
            loading={isLoading}
            startIcon={<DownloadDoneOutlinedIcon />}
            onClick={() => {
              void handleSaveConfig();
            }}
          >
            Save current Configuration
          </LoadingButton>
        </ButtonGroup>
      </Stack>

      <Divider
        sx={{
          mt: 4,
          mb: 4,
        }}
      ></Divider>

      <div>
        <Typography
          variant="h5"
          component="h4"
          sx={{
            fontWeight: '700',
            mt: 4,
            mb: 2,
          }}
        >
          Drawing Tool Selection
        </Typography>
        <Typography
          sx={{
            mb: 2,
          }}
        >
          All tools are selected in default.
        </Typography>

        <DrawingToolSelector
          drawingTools={drawingTools}
          onChange={handleDrawingTools}
        />
      </div>

      <Divider
        sx={{
          mt: 4,
          mb: 4,
        }}
      ></Divider>
      <div>
        <Typography
          variant="h5"
          component="h4"
          sx={{
            fontWeight: '700',
            mb: 2,
          }}
        >
          Annotation Configurations
        </Typography>
        <Typography
          sx={{
            mb: 2,
          }}
        >
          Please add at least one annotation configuration.
        </Typography>
        <AnnotationConfigurationInput
          configAnnotations={configAnnotations}
          setConfigAnnotations={setConfigAnnotations}
        />
      </div>
    </div>
  );
};

export default FolderConfigPage;
