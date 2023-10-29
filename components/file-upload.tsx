import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ExternalLink, Trash, Upload } from "lucide-react";

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 items-center gap-4">
        {value.map((url) => {
          const isImage = /\.(jpg|jpeg|png|gif)$/i.test(url);
          const filename = url.split("/").pop();

          const formattedFilename =
            filename && filename.length > 15
              ? `${filename.slice(0, 23)}...`
              : filename;

          return (
            <div
              key={url}
              className="relative h-[400px] rounded-md overflow-hidden"
            >
              <>
                <a href={url} target="_blank" className="truncate underline">
                  {formattedFilename}{" "}
                  <ExternalLink size={14} className="inline-block" />
                </a>
              </>
              <div className="z-10 absolute bottom-2 right-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => onRemove(url)}
                  size="sm"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              {isImage ? (
                <>
                  <Image
                    className="mt-2"
                    src={url}
                    alt="Uploaded image"
                    width={400}
                    height={400}
                    objectFit="cover"
                  />
                </>
              ) : (
                <>
                  <embed
                    src={url}
                    type="application/pdf"
                    className="w-full h-full mt-2"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="k18d0hpm">
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default FileUpload;
