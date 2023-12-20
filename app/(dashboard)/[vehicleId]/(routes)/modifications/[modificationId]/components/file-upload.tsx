"use client";

import { useEffect, useState } from "react";
import { CldImage, CldUploadWidget } from "next-cloudinary";

import Image from "next/image";

import { ExternalLink, Trash, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { removeFileFromAlbum } from "@/actions/post-file-to-album";
import { useParams } from "next/navigation";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}

const FileUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const params = useParams();

  const folder = `${params.vehicleId}`;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = async (result: any) => {
    setIsUploading(true);
    try {
      onChange(result.info.secure_url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const onDelete = async (url: string) => {
    const urlParts = url.split("/");
    let filename = urlParts.pop();
    filename = filename?.split(".")[0];
    const formattedString = `${folder}/${filename}`;

    console.log(formattedString);

    await removeFileFromAlbum(formattedString);
    console.log(url);
    onRemove(url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((_, index) => {
          const url = value[index];
          return (
            <div
              key={index}
              className="relative h-80 w-50 border rounded-md overflow-hidden flex items-center justify-center transition-colors dark:hover:border-white hover:border-black"
            >
              <a
                href={url}
                target="_blank"
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
              >
                {url ? (
                  <CldImage
                    src={url}
                    alt="Uploaded file"
                    width="600"
                    height="600"
                  />
                ) : (
                  <CldUploadWidget
                    options={{
                      folder: folder,
                      tags: ["modification"],
                      multiple: false,
                    }}
                    onUpload={onUpload}
                    uploadPreset="k18d0hpm"
                  >
                    {({ open }) => {
                      return (
                        <div
                          className="h-full w-full flex items-center justify-center cursor-pointer"
                          onClick={() => open()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          <span>Upload File</span>
                        </div>
                      );
                    }}
                  </CldUploadWidget>
                )}
              </a>

              {url && (
                <div className="absolute bottom-2 left-2">
                  <Button
                    aria-label="Remove file"
                    type="button"
                    variant="destructive"
                    onClick={() => onDelete(url)}
                    size="sm"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FileUpload;
