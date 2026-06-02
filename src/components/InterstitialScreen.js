/**
 * InterstitialScreen component.
 * Full-screen overlay that appears before displaying sensitive content,
 * requiring explicit user acknowledgment.
 */

class InterstitialScreen {
  /**
   * @param {Object} options
   * @param {string} options.title - Warning title
   * @param {string} options.description - Detailed description of the content warning
   * @param {string[]} options.categories - Warning categories (e.g. ['violence', 'nudity'])
   * @param {Function} options.onConfirm - Called when user confirms they want to view content
   * @param {Function} options.onCancel - Called when user declines
   * @param {boolean} [options.requireCheckbox=false] - Require explicit checkbox acknowledgment
   */
  constructor(options) {
    this.title = options.title || 'Content Warning';
    this.description = options.description || 'This content may be sensitive.';
    this.categories = options.categories || [];
    this.onConfirm = options.onConfirm || (() => {});
    this.onCancel = options.onCancel || (() => {});
    this.requireCheckbox = options.requireCheckbox ?? false;
    this.overlay = null;
  }

  /**
   * Mounts the interstitial overlay to the document body.
   * Traps focus within the modal for accessibility.
   */
  mount() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'interstitial-overlay';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.setAttribute('aria-labelledby', 'interstitial-title');

    const checkboxHtml = this.requireCheckbox
      ? `<label class="acknowledge-label">
          <input type="checkbox" id="ack-checkbox" class="ack-checkbox">
          I understand this content may be disturbing
        </label>`
      : '';

    this.overlay.innerHTML = `
      <div class="interstitial-card">
        <div class="interstitial-icon">⚠️</div>
        <h2 id="interstitial-title" class="interstitial-title">${this._escapeHtml(this.title)}</h2>
        <p class="interstitial-description">${this._escapeHtml(this.description)}</p>
        ${
          this.categories.length
            ? `<div class="category-chips">
            ${this.categories.map((c) => `<span class="chip">${this._escapeHtml(c)}</span>`).join('')}
          </div>`
            : ''
        }
        ${checkboxHtml}
        <div class="interstitial-actions">
          <button class="btn btn-secondary btn-cancel">Go Back</button>
          <button class="btn btn-primary btn-confirm" ${this.requireCheckbox ? 'disabled' : ''}>
            Continue
          </button>
        </div>
      </div>
    `;

    if (this.requireCheckbox) {
      const checkbox = this.overlay.querySelector('#ack-checkbox');
      const confirmBtn = this.overlay.querySelector('.btn-confirm');
      checkbox.addEventListener('change', () => {
        confirmBtn.disabled = !checkbox.checked;
      });
    }

    this.overlay.querySelector('.btn-confirm').addEventListener('click', () => {
      this.unmount();
      this.onConfirm();
    });

    this.overlay.querySelector('.btn-cancel').addEventListener('click', () => {
      this.unmount();
      this.onCancel();
    });

    // Close on backdrop click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.unmount();
        this.onCancel();
      }
    });

    document.body.appendChild(this.overlay);
    this.overlay.querySelector('.btn-cancel').focus();
  }

  unmount() {
    this.overlay?.remove();
    this.overlay = null;
  }

  _escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(str).replace(/[&<>"']/g, (m) => map[m]);
  }
}

module.exports = { InterstitialScreen };
