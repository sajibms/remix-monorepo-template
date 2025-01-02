export default function Loading() {
  return (
    <div className="flex items-center justify-center bg-gray-100 w-[100px] py-2 rounded-lg">
      <div className="relative flex items-center justify-center w-8 h-8">
        <div className="absolute w-full h-full border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute w-4 h-4 border-4 border-t-transparent border-blue-300 rounded-full animate-spin-slower"></div>
      </div>
    </div>
  );
}
