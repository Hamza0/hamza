// Assemble the address only when the visitor activates the contact control.
export async function copyContactEmail(): Promise<boolean> {
  const email = ["hamza", "codedsquare.com"].join("@");

  try {
    await navigator.clipboard.writeText(email);
    return true;
  } catch {
    // Older browsers and restricted clipboard contexts still support selection copying.
  }

  const focused = document.activeElement;
  const selection = window.getSelection();
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange())
    : [];
  const field = document.createElement("textarea");
  field.value = email;
  field.readOnly = true;
  field.tabIndex = -1;
  field.setAttribute("aria-hidden", "true");
  field.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none;font-size:16px";

  try {
    document.body.appendChild(field);
    field.select();
    field.setSelectionRange(0, email.length);
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    field.remove();
    if (focused instanceof HTMLElement) focused.focus({ preventScroll: true });
    if (selection) {
      selection.removeAllRanges();
      ranges.forEach(range => selection.addRange(range));
    }
  }
}
