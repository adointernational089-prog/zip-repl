const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

export async function uploadProjectImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const dataUrl = ev.target?.result as string;
        const base64 = dataUrl.split(",")[1];
        const token = localStorage.getItem("bishals_hub_token");

        const res = await fetch(`${BASE}/api/upload/image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            base64,
            mimeType: file.type,
            fileName: file.name,
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Upload failed (${res.status})`);
        }

        const { url } = await res.json();
        resolve(url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
