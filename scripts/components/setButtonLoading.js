export function setButtonLoading(button, loadingText) {
  button.disabled = true;
  button.innerHTML = `
    <span class="flex items-center justify-center gap-2">
      <span class="spinner"></span>
      <span>${loadingText}</span>
    </span>
  `;
}