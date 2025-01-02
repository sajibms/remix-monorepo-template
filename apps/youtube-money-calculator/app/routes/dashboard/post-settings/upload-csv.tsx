import { json, useFetcher } from "@remix-run/react";
import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { createPostSettingInBulk } from "~/models/postSetting/postSetting.services";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const dataString = formData.get("data") as string;
  const data = JSON.parse(dataString);
  const result = await createPostSettingInBulk(data);

  return json({
    success: true,
    message: result?.message,
  });
};
const UploadCSVPost = () => {
  const [file, setFile] = useState<File | null>(null); // Store the selected file
  const [data, setData] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher();

  // Handle file selection
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (fetcher?.data?.success) {
      setFile(null);
      setData(null);
      //  * define success message
      if (!toast.isActive("success-bp-toast")) {
        toast.success(fetcher?.data?.message || "Operation Successfully", {
          toastId: "success-bp-toast",
        });
      }
      // * Set fetcher data to null
      fetcher.data = null;
    }
  }, [fetcher.data]);

  // Handle file change
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);

    if (selectedFile) {
      Papa.parse(selectedFile, {
        header: true, // Automatically map the first row as keys
        skipEmptyLines: true, // Skip empty rows
        complete: (results) => {
          setData(results.data as Array);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };

  // Simulate upload to database
  const handleUploadToDatabase = () => {
    if (data) {
      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      fetcher.submit(formData, {
        method: "post",
        encType: "multipart/form-data",
      });
    } else if (!toast.isActive("error-bp-toast")) {
      toast.error("Please select a file first.", {
        toastId: "error-bp-toast",
      });
    }
  };  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-7xl">
        {/* Step 1: Upload CSV */}
        <div
          onClick={handleFileSelect}
          className="cursor-pointer rounded-lg border-2 border-dashed p-8 text-center text-gray-500 hover:border-gray-700"
        >
          <p className="text-lg">Click to upload CSV file</p>
          <p className="mt-2 text-sm text-gray-400">Accepted format: .csv</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          className="hidden"
          onChange={handleOnChange}
        />

        {/* Step 2: Preview CSV Data */}
        {data && (
          <div className="mt-6">
            <h2 className="mb-4 text-lg font-bold">Preview Data</h2>
            <div className="overflow-x-auto rounded-lg bg-gray-100 p-4 shadow-lg">
              <table className="w-full border-collapse border border-gray-200 text-left">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="border border-gray-200 px-4 py-2">Title</th>
                    <th className="border border-gray-200 px-4 py-2">
                      Meta Title
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Meta Description
                    </th>
                    <th className="border border-gray-200 px-4 py-2">Slug</th>
                    <th className="border border-gray-200 px-4 py-2">
                      Thumbnail
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Alt Text
                    </th>
                    <th className="border border-gray-200 px-4 py-2">
                      Content
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="border border-gray-200 px-4 py-2">
                        {item.title}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {item.metaTitle}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {item.metaDescription}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {item.slug}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="size-14 rounded-md"
                        />
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {item.altText}
                      </td>
                      <td
                        className="border border-gray-200 px-4 py-2"
                        title={item.content} // Tooltip with full content
                      >
                        {item.content.length > 20
                          ? `${item.content.substring(0, 20)}...`
                          : item.content}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 3: Upload Data to Database */}
        {data && (
          <button
            onClick={handleUploadToDatabase}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Upload to Database
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadCSVPost;
