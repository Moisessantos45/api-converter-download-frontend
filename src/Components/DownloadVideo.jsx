import { useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import UrlAxios from "../config/UrlAxios";
import { saveAs } from "file-saver";
import JSZip from "jszip";

const toastify = (text, type) => {
  Toastify({
    text: `${text}`,
    duration: 3000,
    newWindow: true,
    // close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: type
        ? "linear-gradient(to right, #00b09b, #96c93d)"
        : "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))",
      borderRadius: "10px",
    },
  }).showToast();
};

const DownloadVideo = () => {
  const [files, setFiles] = useState([]);
  const [urlYoutube, setUrlYoutube] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filesVideo, setFilesVideo] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let compressedFile = urlYoutube;
    console.log(urlYoutube);
    try {
      const response = await UrlAxios.post(
        "descargar",
        { urlYoutube },
        {
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );
      const responseData = response.data !== undefined ? response.data : null;
      if (!responseData) {
        toastify("Archivo no recibido", false);
        return;
      }
      const fileData = new File([responseData], `videoYoutube.mp4`, {
        type: "video/mp4",
      });
      compressedFile = fileData;
    } catch (error) {
      toastify(error.response.data.msg, false);
      return;
    }
    console.log(compressedFile);
    saveAs(compressedFile, compressedFile.name);
    setUploadProgress(((1 + 1) / compressedFile.length) * 100);
    setFilesVideo((prevFilesMusic) => prevFilesMusic.concat(compressedFile));
    setUploadProgress(100);
    toastify("Archivos convetidos", true);
  };

  const downloadFile = (url) => {
    saveAs(url, url.name);
    toastify("Archivo descargado", true);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    console.log(filesVideo);
    if (filesVideo.length === 0) return toastify("No hay archivos", false);
    // Itera sobre cada archivo en filesImages
    for (let i = 0; i < filesVideo.length; i++) {
      const file = filesVideo[i];
      let blobData;
      // Comprueba si el archivo es un Blob
      if (file instanceof Blob) {
        blobData = file;
      } else {
        // Si no es un Blob, asume que es un File y lee su contenido como un Blob
        blobData = await file.arrayBuffer().then((data) => new Blob([data]));
      }

      zip.file(`${file.name.split(".")[0]}.mp4`, blobData); // Asegúrate de usar la extensión de archivo correcta
    }

    // Genera el archivo .zip y lo descarga
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "compressed_files.zip");
    });
    // setFilesImages([]);
    toastify("Archivos descargados", true);
  };

  return (
    <section className="container_upload shadow-md shadow-slate-100">
      <div className="sm:w-[32rem] shadow-blue-100 mx-auto my-10 overflow-hidden rounded-2xl bg-white shadow-lg sm:max-w-lg w-11/12">
        <h1 className="relative bg-blue-600 py-5 sm:pl-8 sm:text-xl text-base font-semibold uppercase tracking-wider text-white text-center">
          Descargar videos
        </h1>
        <form onSubmit={handleSubmit} className="m-5">
          <div className="p-3 m-2">
            <span className="text-gray-600">Archivos</span>
            <span className="float-right text-sm text-gray-400">
              {uploadProgress / 100}MB
            </span>
            <div className="h-1 overflow-hidden rounded-full bg-gray-300">
              <div
                style={{ width: `${uploadProgress}%` }}
                className="bg-blue-500 h-full"
              />
            </div>
          </div>
          <div className="group rounded-md relative border p-1 focus-within:ring-1 focus-within:ring-gray-400 sm:flex-row">
            <input
              type="text"
              name="url"
              placeholder="url"
              className="block w-full bg-transparent px-2 break-all whitespace-break-spaces py-2 placeholder-gray-900 outline-none"
              value={urlYoutube}
              onChange={(e) => setUrlYoutube(e.target.value)}
            />
            <div className="flex sm:absolute sm:inset-y-0 sm:right-0 sm:h-full sm:border-l">
              <button
                type="submit"
                className="inline-flex rounded-md w-full items-center justify-center bg-blue-600 px-2 text-base font-bold text-white outline-none transition-all"
              >
                Descargar
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* {filesVideo.length > 0 && (
        <div
          id="output"
          className="container_url flex items-center rounded-lg bg-white pb-3 pt-2"
        >
          <h2 className="text-xl font-semibold mb-2">Lista de URLs</h2>

          {filesVideo.map((file, index) => (
            <div key={index} className="container_url-links">
              <button
                onClick={() => downloadFile(file)}
                className="copy text-white bg-indigo-600"
              >
                <i className="fa-solid fa-download"></i>
              </button>
              <p className="urlimg text-blue-500 font-semibold text-sm sm:text-base">
                {file.name}
              </p>
            </div>
          ))}
          {filesVideo.length > 1 && (
            <div className=" w-full p-2 flex justify-evenly">
              <button
                className=" rounded-full bg-blue-600 px-5 py-2 font-semibold text-white cursor-pointer"
                onClick={() => downloadZip()}
              >
                Descargar Archivos
              </button>
            </div>
          )}
        </div>
      )} */}
    </section>
  );
};

export default DownloadVideo;
