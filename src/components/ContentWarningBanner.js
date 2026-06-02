/**
 * ContentWarningBanner component.
 * Displays a dismissible banner for content warnings before showing potentially
 * sensitive content.
 */

class ContentWarningBanner {
  /**
   * @param {Object} options
   * @param {string[]} options.warnings - List of content warning labels
   * @param {string} options.severity - 'low' | 'medium' | 'high' | 'critical'
   * @param {Function} options.onDismiss - Callback when user dismisses the banner
   * @param {Function} options.onBlock - Callback when user chooses to not view content
   */
  constructor(options) {
    this.warnings = options.warnings || [];
    this.severity = options.severity || 'medium';
    this.onDismiss = options.onDismiss || (() => {});
    this.onBlock = options.onBlock || (() => {});
    this.element = null;
  }

  /**
   * Renders the banner HTML and appends it to a container element.
   * @param {HTMLElement} container
   */
  render(container) {
    const banner = document.createElement('div');
    banner.className = `content-warning-banner severity-${this.severity}`;
    banner.setAttribute('role', 'alert');
    banner.setAttribute('aria-live', 'polite');

    const iconMap = {
      low: '⚠️',
      medium: '🔶',
      high: '🔴',
      critical: '🚨',
    };

    banner.innerHTML = `
      <div class="banner-icon">${iconMap[this.severity] || '⚠️'}</div>
      <div class="banner-content">
        <h3 class="banner-title">Content Warning</h3>
        <ul class="warning-list">
          ${this.warnings.map((w) => `<li>${this._escapeHtml(w)}</li>`).join('')}
        </ul>
        <p class="banner-message">
          This content may be sensitive. Do you want to continue?
        </p>
      </div>
      <div class="banner-actions">
        <button class="btn btn-primary btn-dismiss" aria-label="View content anyway">
          View Anyway
        </button>
        <button class="btn btn-secondary btn-block" aria-label="Do not view content">
          Don't Show
        </button>
      </div>
    `;

    banner.querySelector('.btn-dismiss').addEventListener('click', () => {
      this.dismiss();
    });

    banner.querySelector('.btn-block').addEventListener('click', () => {
      this.block();
    });

    this.element = banner;
    container.appendChild(banner);
  }

  dismiss() {
    this.element?.classList.add('banner-dismissed');
    this.onDismiss();
  }

  block() {
    this.element?.remove();
    this.onBlock();
  }

  /**
   * Escapes HTML special characters to prevent XSS.
   * @param {string} str
   * @returns {string}
   */
  _escapeHtml(str) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return String(str).replace(/[&<>"']/g, (m) => map[m]);
  }
}

module.exports = { ContentWarningBanner };
