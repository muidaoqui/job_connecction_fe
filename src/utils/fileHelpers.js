import axios from "axios";

const SERVER_BASE = "http://localhost:8080";

export async function openProtectedFile(filePath, asDownload = false) {
  if (!filePath) return;
  const p = (filePath || "").replace(/\\\\/g, "/");
  const url = p.startsWith("http") ? p : p.startsWith("/") ? `${SERVER_BASE}${p}` : `${SERVER_BASE}/${p}`;
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(url, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      responseType: "blob",
    });

    const contentDisposition = res.headers["content-disposition"] || "";
    let filename = p.split("/").pop() || "file";
    const match = /filename="?([^";]+)"?/.exec(contentDisposition);
    if (match) filename = match[1];

    const blob = new Blob([res.data], { type: res.data.type || "application/octet-stream" });
    const blobUrl = URL.createObjectURL(blob);

    if (asDownload) {
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } else {
      window.open(blobUrl, "_blank");
    }
  } catch (err) {
    console.error("Error opening protected file:", err);
    throw err;
  }
}
