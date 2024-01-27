"use server";

import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function removeFilesFromAlbum(fileUrls: string[]) {
  // Get the public IDs of the files
  const publicIds = fileUrls.map((url) => {
    const segments = new URL(url).pathname.split("/");
    const publicId = segments.slice(5, segments.length).join("/");
    // Remove file extension
    console.log(publicId);
    return publicId.replace(/\.[^/.]+$/, "");
  });

  await Promise.all(
    publicIds.map((publicId) =>
      cloudinary.v2.api.delete_resources([publicId], {
        type: "upload",
        resource_type: "image",
      })
    )
  );
}

export async function removeVehicleFolder(folderName: string) {
  try {
    const folders = await cloudinary.v2.api.sub_folders("/");
    const folderExists = folders.folders.some(
      (folder: { path: string }) => folder.path === folderName
    );

    if (folderExists) {
      const response = await cloudinary.v2.api.delete_folder(folderName);
      return response;
    } else {
      console.log(`Folder does not exist: ${folderName}`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to remove folder: ${folderName}`, error);
    throw error;
  }
}
