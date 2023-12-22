"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import { cn } from "@/lib/utils";
import { removeFilesFromAlbum } from "@/actions/post-file-to-album";
import { useParams } from "next/navigation";

import { ExternalLink, Trash, Upload } from "lucide-react";

import { CldImage, CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  hasInitialData: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const FileUpload: React.FC<ImageUploadProps> = ({
  hasInitialData,
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const params = useParams();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const folder = `${params.vehicleId}`;

  const onUpload = async (result: any) => {
    try {
      onChange(result.info.secure_url);
      if (hasInitialData) {
        axios.post(
          `/api/${params.vehicleId}/modifications/${params.modificationId}/file`,
          { url: result.info.secure_url }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async (url: string) => {
    await removeFilesFromAlbum([url]);
    axios.delete(
      `/api/${params.vehicleId}/modifications/${params.modificationId}/file`,
      { data: { url: url } }
    );
    onRemove(url);
  };

  if (!isMounted) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[0, 1, 2].map((_, index) => {
        const url = value[index];
        return (
          <div key={index} className="relative">
            {url ? (
              <div
                className={cn(
                  "relative border rounded-lg overflow-hidden flex items-center justify-center",
                  disabled
                    ? "opacity-50"
                    : "transition-colors dark:hover:border-white hover:border-black"
                )}
              >
                <a
                  href={disabled ? undefined : url}
                  target="_blank"
                  className="w-full h-full p-2 flex items-center justify-center"
                >
                  <CldImage
                    src={url}
                    alt="Uploaded file"
                    width="600"
                    height="600"
                    className="rounded-md"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 hover:bg-opacity-70 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <span className="text-white text-lg items-center inline-flex">
                      Open in New Tab <ExternalLink className="w-4 h-4 ml-2" />
                    </span>
                  </div>
                </a>
              </div>
            ) : (
              index === value.length &&
              !disabled && (
                <CldUploadWidget
                  options={{
                    folder: folder,
                    tags: ["modification"],
                    multiple: false,
                  }}
                  onUpload={onUpload}
                  uploadPreset="k2e4toj9"
                >
                  {({ open }) => {
                    return (
                      <>
                        {value.length >= 1 ? (
                          <div className="flex h-full w-full items-center ml-4">
                            <div
                              onClick={() => open()}
                              className="border-dashed border-2 rounded-full p-4 hover:bg-muted cursor-pointer w-25 h-14 flex items-center justify-center"
                            >
                              File {index + 1}
                              <Upload className="h-4 w-4 ml-2" />
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => open && open()}
                            className="border-dashed border-2 max-w-[100px] h-12 rounded-full hover:bg-muted cursor-pointer flex items-center justify-center"
                          >
                            File 1
                            <Upload className="h-4 w-4 ml-2" />
                          </div>
                        )}
                      </>
                    );
                  }}
                </CldUploadWidget>
              )
            )}
            {url && (
              <div className="absolute top-4 right-4">
                <Button
                  aria-label="Remove file"
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={disabled}
                  onClick={() => onDelete(url)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FileUpload;
