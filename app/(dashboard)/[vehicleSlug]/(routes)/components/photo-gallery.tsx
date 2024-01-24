"use client";

import { useState } from "react";
import axios from "axios";
import { removeFilesFromAlbum } from "@/app/actions/cloudinary-api";

import { CldImage, CldUploadWidget } from "next-cloudinary";

import { Trash, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PhotoGalleryProps {
  vehicleId: string;
  initialData: string[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  vehicleId,
  initialData,
}) => {
  const [images, setImages] = useState<string[]>(initialData);

  const folder = `${vehicleId}/images`;

  const onUpload = async (result: any) => {
    try {
      setImages((prevImages) => [...prevImages, result.info.secure_url]);
      axios.post(`/api/${vehicleId}/images`, {
        url: result.info.secure_url,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async (url: string) => {
    try {
      await removeFilesFromAlbum([url]);
      setImages((prevImages) => prevImages.filter((image) => image !== url));
      axios.delete(`/api/${vehicleId}/images`, { data: { url: url } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Carousel
      opts={{
        align: "start",
      }}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => {
          const url = images[index];
          return (
            <CarouselItem
              key={index}
              className="md:basis-1/2 lg:basis-1/2 overflow-hidden"
            >
              {url ? (
                <Card>
                  <CardContent className="p-4 flex items-center justify-center relative group">
                    <div className="rounded-md">
                      <CldImage
                        src={url}
                        alt={`Image ${index + 1}`}
                        width="600"
                        height="400"
                        crop="fill"
                        className="rounded-md"
                      />
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        aria-label="Remove file"
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(url)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="border rounded-lg h-full w-full flex items-center justify-center">
                  <CldUploadWidget
                    options={{
                      folder: folder,
                      multiple: false,
                      clientAllowedFormats: ["png", "jpeg", "jpg"],
                      sources: [
                        "local",
                        "url",
                        "camera",
                        "dropbox",
                        "google_drive",
                      ],
                    }}
                    onUpload={onUpload}
                    uploadPreset="k2e4toj9"
                  >
                    {({ open }) => {
                      return (
                        <div className="h-full w-full min-h-[300px] flex items-center justify-center">
                          <Button variant="outline" onClick={() => open()}>
                            Upload Image
                            <Upload className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      );
                    }}
                  </CldUploadWidget>
                </div>
              )}
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default PhotoGallery;
