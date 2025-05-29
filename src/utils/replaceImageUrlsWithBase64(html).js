export async function replaceImageUrlsWithBase64(html) {
  const container = document.createElement("div");
  container.innerHTML = html;

  const imgs = container.querySelectorAll("img");

  for (const img of imgs) {
    const src = img.getAttribute("src");
    if (!src || src.startsWith("data:")) continue;

    try {
      const res = await fetch(src);
      const blob = await res.blob();

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      img.setAttribute("src", base64);
    } catch (err) {
      console.warn("❌ Erro ao converter imagem:", src, err);
      img.setAttribute("alt", "Erro ao carregar imagem");
    }
  }

  return container.innerHTML;
}
