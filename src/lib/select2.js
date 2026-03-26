/**
 * Svelte Action untuk Select2 menggunakan jQuery dari CDN (window.$).
 * jQuery dan Select2 dimuat via CDN di app.html, sehingga window.$ selalu tersedia.
 *
 * Usage: <select use:select2Action={{ value: someVar, placeholder: 'Pilih...' }} on:select2_change={...}>
 */
export function select2Action(node, options = {}) {
  let initialized = false;

  function getJQuery() {
    // Gunakan $ dari CDN (window.$) yang sudah dimuat di app.html
    return window.$;
  }

  function init() {
    const $ = getJQuery();
    if (!$ || typeof $.fn.select2 !== 'function') {
      // CDN belum siap, coba lagi sebentar lagi
      setTimeout(init, 100);
      return;
    }

    const $node = $(node);

    $node.select2({
      placeholder: options.placeholder || '',
      width: '100%',
      dropdownParent: $(document.body),
    });

    // Set initial value
    if (options.value !== undefined && options.value !== null) {
      $node.val(String(options.value)).trigger('change.select2');
    }

    $node.on('change.select2action', () => {
      node.dispatchEvent(new CustomEvent('select2_change', {
        detail: $node.val()
      }));
    });

    initialized = true;
  }

  // Tunggu DOM selesai render sebelum init
  setTimeout(init, 0);

  return {
    update(newOptions) {
      const $ = getJQuery();
      if (!initialized || !$ || typeof $.fn.select2 !== 'function') return;

      const $node = $(node);
      const newVal = newOptions.value !== undefined ? String(newOptions.value) : '';

      if ($node.val() !== newVal) {
        $node.val(newVal).trigger('change.select2');
      }
    },
    destroy() {
      const $ = getJQuery();
      if (!$ || !initialized) return;

      const $node = $(node);
      $node.off('change.select2action');
      if ($node.data('select2')) {
        $node.select2('destroy');
      }
    }
  };
}
