export async function convertImagesToDataURL(container) {
  const images = container.querySelectorAll("img");
  const promises = Array.from(images).map(async (img) => {
    const src = img.src;

    if (src.startsWith("data:")) return;

    try {
      const response = await fetch(src, { mode: 'cors' });
      const blob = await response.blob();

      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          img.src = reader.result;
          resolve();
        };
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("Erro ao converter imagem:", src, err);
    }
  });

  await Promise.all(promises);
}
