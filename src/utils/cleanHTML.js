export const cleanHTML = (html) => {
  if (!html) return "";

  return html
    .replace(/<p[^>]*>/g, "<p>")
    .replace(/<\/?span[^>]*>/g, "")
    .replace(/<\/?div[^>]*>/g, "")
    .replace(/ class="[^"]*"/g, "")
    .replace(/ style="[^"]*"/g, "")
    .replace(/ target="[^"]*"/g, "")
    .replace(/ rel="[^"]*"/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n/g, "")
    .trim();
};
