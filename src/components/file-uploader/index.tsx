import { useState } from "react";
import { ListUploadedFiles, UploadFile } from "../upload-file";
import { ObjectList } from "aws-sdk/clients/s3";

export const FileUploader = () => {
  const [fileList, setFileList] = useState<ObjectList>([]);
  const [failedFileList, setFailedFileList] = useState<ObjectList>([]);

  return (
    <div className="flex items-center justify-between">
      <div className="mx-auto  bg-white mt-20 rounded-3xl">
        <div className="py-4 px-9">
          <UploadFile
            setFileList={setFileList}
            setFailedFileList={setFailedFileList}
            failedFileList={failedFileList}
          ></UploadFile>
        </div>
      </div>
      <div className="mx-auto min-w-[232px] min-h-[480px] bg-white mt-20 rounded-3xl">
        <div className="py-4 px-9 ">
          <ListUploadedFiles
            fileList={fileList}
            failedFileList={failedFileList}
          ></ListUploadedFiles>
        </div>
      </div>
    </div>
  );
};
