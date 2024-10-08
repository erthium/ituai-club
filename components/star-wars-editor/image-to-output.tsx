import { useState, useRef, useEffect } from 'react';
import { PromptData } from '@/interfaces/editor/prompt_data';
import { ApiService } from '@/services/api';
import QRCode from 'qrcode.react';
import LoadingLayer from './loading-layer';
import { ImageType } from '@/interfaces/editor/image_type';

interface ImageToOutputProps {
    rawImage: string;
    promptData: PromptData;
    restartCallback: () => Promise<void>;
    goBackCallback: () => Promise<void>;
}

const pageUrl = process.env.NEXT_PUBLIC_VIEW_URL;

const ImageToOutput: React.FC<ImageToOutputProps> = ({ rawImage, promptData, restartCallback, goBackCallback }) => {
  const [shownImage, setShownImage] = useState<string>(rawImage);
  const [imageID, setImageID] = useState<string | undefined>(undefined);
  const [qrUrl, setQrUrl] = useState<string | undefined>(undefined);
  const [waiting, setWaiting] = useState<boolean>(false);
  const [isOnMobile, setIsOnMobile] = useState<boolean>(true);

  useEffect(() => {
    sendImagetoAPI(rawImage);
    //setIsOnMobile(!!navigator.share);
  }, []);

  const sendImagetoAPI = async (image64: string) => {
    if (waiting) return;
    try {
      setWaiting(true);
      const blob = await fetch(image64).then(r => r.blob());
      const imageFile =new File([blob], 'snapshot.png', { type: 'image/png' });
      const response = await ApiService.sendImageRequest(imageFile, promptData);
      console.log(response);
      const imageUrl = 'data:image/png;base64,' + response.artifacts[0].base64;
      setImageID(response.image_id);
      setQrUrl(pageUrl + 'starwars/' + response.image_id);
      setShownImage(imageUrl);
      setWaiting(false);
    }
    catch (error) {
      console.error('Error fetching photos:', error);
      setTimeout(() => {
        sendImagetoAPI(image64);
      }, 400);
    }
  }

  const downloadImage = async () => {
    if (imageID) {
      const requestedImage64 = await ApiService.getImageRequest(imageID, ImageType.StarWars, true, true);
      const imageWithMetaData = 'data:image/png;base64,' + requestedImage64;
      const link = document.createElement('a');
      link.href = imageWithMetaData;
      link.download = 'image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
      <img className="sw-frame" src={shownImage} alt="Image" />
      {qrUrl 
      ?
        <>
          <div className="flex flex-col w-48 items-center justify-center gap-4">
            <div className="flex flex-col gap-4 items-center justify-center">
              <QRCode bgColor={"#00000000"} fgColor={"#FFF"} value={qrUrl}/>
              <p className="font-starjedi text-white text-center text-md">
                Scan the qr to download your image
              </p>
            </div>
            <button className="sw-button"
              onClick={restartCallback}>
              Restart
            </button>
            {isOnMobile &&
              <button className="sw-button"
                onClick={downloadImage}>
                Download
              </button>
            }
            <button className="sw-button"
              onClick={goBackCallback}>
              Select Another Prompt
            </button>          
          </div>
        </>
      :
        <LoadingLayer/>
      }
    </div>
  );
}

export default ImageToOutput;
