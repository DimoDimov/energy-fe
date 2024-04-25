import AWS from "aws-sdk";
import S3, { ObjectList } from "aws-sdk/clients/s3";

const S3_BUCKET = "csv-container-2";
const REGION = "eu-west-2";

// left on purpose for testing
AWS.config.update({
  region: REGION,
  credentials: new AWS.Credentials("", ""),
});

const myBucket = new S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

interface handleFileInputProps {
  file: File;
  setErrorMessage: (error: string) => void;
  setSuccessMessage: (success: string) => void;
  setSelectedFile: (file: File) => void;
}
export const handleFileInput = ({
  file,
  setErrorMessage,
  setSuccessMessage,
  setSelectedFile,
}: handleFileInputProps) => {
  setErrorMessage("");
  setSuccessMessage("");

  const allowedTypes = [
    "text/csv",
    // Add more supported types here
  ];

  const fileSizeLimiter = 300000;

  if (file)
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        `Invalid file type. Allowed file types: ${allowedTypes.join(", ")}`
      );
    }

  if (file.size > fileSizeLimiter) {
    setErrorMessage(
      `Excessive file size. Please limit the file size to ${fileSizeLimiter} bytes`
    );
  }
  setSelectedFile(file);
};

interface uploadSelectedFileProp {
  file: File | null;
  setProgress(progress: number): void;
  setErrorMessage: (error: string) => void;
  setSuccessMessage: (success: string) => void;
}

export const uploadSelectedFile = async ({
  file,
  setProgress,
  setErrorMessage,
  setSuccessMessage,
}: uploadSelectedFileProp) => {
  if (!file) {
    return;
  }

  const params = {
    Bucket: S3_BUCKET,
    Key: file.name,
    Body: file,
  };

  try {
    await myBucket
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .promise();
    setSuccessMessage("File uploaded to S3.");
  } catch (error) {
    console.error(error);
    setErrorMessage("Error uploading file: " + error); // Inform user about the error
  }
};

export const refreshList = async () => {
  let result: ObjectList = [];
  await myBucket
    .listObjectsV2({ Bucket: S3_BUCKET }, (error, data) => {
      if (data) {
        result = (data.Contents as ObjectList) || [];
      }
    })
    .promise();

  return result;
};
