
import parse from "html-react-parser";

// Accepts htmlString and optional className. Injects className into the root element if provided, returns React nodes.
export function parseHtml(htmlString, className) {
  if (!htmlString) return null;
  if (!className) return parse(htmlString);
  // Inject className into the first tag
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    const el = div.querySelector(`.${className}`);
    if (el) {
      return parse(el.innerHTML);
    }
    // fallback: parse the whole html if class not found
    return parse(htmlString);
}
