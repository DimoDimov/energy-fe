import { FileUploader } from "./components/file-uploader";

function App() {
  return (
    <div className="h-screen w-screen bg-gradient-to-tl from-lime-200 via-sky-500 to-violet-500">
      <h1 className="text-3xl font-bold underline text-center pt-10 text-lime-500">
        Energise You Future!
      </h1>
      <FileUploader></FileUploader>
    </div>
  );
}

export default App;
