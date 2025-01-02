import {
  unstable_parseMultipartFormData,
  UploadHandlerPart,
  json,
  ActionFunctionArgs,
} from '@remix-run/node';
import { convertDataToBuffer, generateFileURL, uploadFile } from '@acme/R2/server';
import { UploadedFile } from '@acme/R2';

export const imageUploadAction = async ({ request }: ActionFunctionArgs) => {
  const uploadedFiles: Record<string, UploadedFile> = {};

  const uploadHandler = async ({ name, data, filename }: UploadHandlerPart) => {
    if (name === 'file') {
      if (!data) {
        console.error('No file data received');
        return null;
      }

      try {
        // Convert file to buffer
        const bufferFile = await convertDataToBuffer(data);

        // Upload to R2
        const result = await uploadFile(filename, bufferFile);

        if (!result) {
          console.error(`File upload failed for ${filename}`);
          return null;
        }

        // Generate and return file URL
        const fileUrl = generateFileURL(uploadedFiles, filename, name);

        return fileUrl;
      } catch (error) {
        console.error('Upload handler error:', error);
        return null;
      }
    }

    return null;
  };

  try {
    // Parse multipart form data
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler
    );

    // Get the uploaded file URL
    const fileUrl = formData.get('file');

    if (!fileUrl) {
      return json({
        success: false,
        message: 'No file URL generated',
      });
    }

    return json({
      success: true,
      fileUrl,
    });
  } catch (error) {
    console.error('Action function error:', error);
    return json({
      success: false,
      message: error.message,
    });
  }
};
