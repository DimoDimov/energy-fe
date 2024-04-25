import { ObjectList } from "aws-sdk/clients/s3";
import { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";

interface ListUploadedFilesProps {
  fileList: ObjectList;
  failedFileList: ObjectList;
}

export const ListUploadedFiles = ({
  fileList,
  failedFileList,
}: ListUploadedFilesProps) => {
  const [sortDirectionDesc, setSortDirectionDesc] = useState(true);
  return (
    <div className="mb-5 pt-4 block text-xl content-center font-semibold text-[#07074D]">
      <div>
        <div
          className="content-center rounded-xl hover:bg-slate-100 flex"
          onClick={() => setSortDirectionDesc(!sortDirectionDesc)}
        >
          <div className="cursor-pointer content-center p-2 ">List Files</div>

          <div className="pt-3">
            {sortDirectionDesc ? (
              <ArrowUpIcon className="h-5 w-5" />
            ) : (
              <ArrowDownIcon className="h-5 w-5" />
            )}
          </div>
        </div>
      </div>

      <ul>
        {[...fileList, ...failedFileList]
          // .slice(0, 10)
          .sort((a, b) =>
            sortDirectionDesc
              ? (b?.LastModified ? b?.LastModified?.getTime() : 0) -
                (a?.LastModified ? a?.LastModified?.getTime() : 0)
              : (a?.LastModified ? a?.LastModified?.getTime() : 0) -
                (b?.LastModified ? b?.LastModified?.getTime() : 0)
          )
          .map((file) => (
            <li>
              <div>
                <span>{file.Key}</span> -{" "}
                <span>
                  {file.LastModified?.toLocaleDateString()} at{" "}
                  {file.LastModified?.toLocaleTimeString()}
                </span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};
