import { useEffect, useState } from "react";
import { formatBytes } from "../../helpers";
import {
  handleFileInput,
  refreshList,
  uploadSelectedFile,
} from "./upload-file.service";
import { ObjectList, Object as S3Object } from "aws-sdk/clients/s3";

interface UploadFileProps {
  setFileList: (value: React.SetStateAction<ObjectList>) => void;
  setFailedFileList: (value: React.SetStateAction<ObjectList>) => void;
  failedFileList: ObjectList;
}

export const UploadFile = ({
  setFileList,
  setFailedFileList,
  failedFileList,
}: UploadFileProps) => {
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      setFailedFileList([
        ...failedFileList,
        {
          Key: `${selectedFile?.name}-failed`,
          LastModified: new Date(),
        },
      ]);
    }
  }, [errorMessage]);

  const processFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProgress(0);
      handleFileInput({
        file: e.target.files[0],
        setErrorMessage,
        setSuccessMessage,
        setSelectedFile,
      });
    }
  };

  const processSelectedFile = (file: File | null) => {
    if (errorMessage) {
      return;
    }
    uploadSelectedFile({
      file,
      setProgress,
      setErrorMessage,
      setSuccessMessage,
    });
  };

  const clearSelection = () => {
    console.log("clearSelection");
    setErrorMessage("");
    setSuccessMessage("");
    setSelectedFile(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setFileList(await refreshList());
    };
    fetchData();
  }, []);

  let refreshIProgress = false;
  useEffect(() => {
    if (progress === 100 && !refreshIProgress) {
      const fetchData = async () => {
        refreshIProgress = true;
        setFileList(await refreshList());
        refreshIProgress = false;
      };
      fetchData();
    }
  }, [progress]);

  return (
    <>
      <div className="mb-6 pt-4">
        <label className="mb-5 block text-xl font-semibold text-[#07074D]">
          Upload File
        </label>

        <div className="mb-8">
          <input
            type="file"
            name="file"
            id="file"
            className="sr-only"
            onChange={processFileInput}
          />

          <label
            htmlFor="file"
            className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
          >
            <div>
              <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                Drop files here
              </span>
              <span className="mb-2 block text-base font-medium text-[#6B7280]">
                Or
              </span>
              <span className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                Browse
              </span>
            </div>
          </label>
        </div>

        <section>
          File details:
          <ul>
            <li>Type: {selectedFile?.type}</li>
            <li>Size: {selectedFile ? formatBytes(selectedFile.size) : ""}</li>
          </ul>
        </section>

        {selectedFile && (
          <div className="rounded-md bg-[#F5F7FB] py-4 px-8">
            <div className="flex items-center justify-between">
              <span className="truncate pr-3 text-base font-medium text-[#07074D]">
                {selectedFile.name}
              </span>
              <button
                onClick={() => clearSelection()}
                className="text-[#07074D]"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.279337 0.279338C0.651787 -0.0931121 1.25565 -0.0931121 1.6281 0.279338L9.72066 8.3719C10.0931 8.74435 10.0931 9.34821 9.72066 9.72066C9.34821 10.0931 8.74435 10.0931 8.3719 9.72066L0.279337 1.6281C-0.0931125 1.25565 -0.0931125 0.651788 0.279337 0.279338Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.279337 9.72066C-0.0931125 9.34821 -0.0931125 8.74435 0.279337 8.3719L8.3719 0.279338C8.74435 -0.0931127 9.34821 -0.0931123 9.72066 0.279338C10.0931 0.651787 10.0931 1.25565 9.72066 1.6281L1.6281 9.72066C1.25565 10.0931 0.651787 10.0931 0.279337 9.72066Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <div className="relative mt-5 h-[6px] w-full rounded-lg bg-[#E2E5EF]">
              <div
                className={`absolute left-0 right-0 h-full w-[${
                  progress + "%"
                }] rounded-lg bg-[#6A64F1]`}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div>
        <button
          disabled={!selectedFile && !errorMessage}
          onClick={(e) => {
            processSelectedFile(selectedFile);

            e.preventDefault();
          }}
          className={`hover:shadow-form w-full rounded-md py-3 px-8 text-center text-base font-semibold text-white outline-none ${
            selectedFile && !errorMessage
              ? "cursor-pointer bg-[#6A64F1]"
              : "cursor-not-allowed bg-slate-200"
          }`}
        >
          Save File
        </button>

        {errorMessage && (
          <div
            className="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400"
            role="alert"
          >
            <span className="font-medium">Warning:</span> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            className="p-4 my-4 text-sm text-green-800 rounded-lg bg-green-50 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">Success: </span> {successMessage}
          </div>
        )}
      </div>
    </>
  );
};
