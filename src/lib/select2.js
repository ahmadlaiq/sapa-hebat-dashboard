import jQuery from 'jquery';
import 'select2';

/**
 * Svelte Action to initialize Select2 on a select element.
 * Usage: <select use:select2={{ value: selectedValue, placeholder: 'Select...' }} on:select2_change={...}>
 */
export function select2Action(node, options = {}) {
  const $node = jQuery(node);
  
  function init() {
    $node.select2({
      placeholder: options.placeholder || '',
      width: '100%',
      dropdownParent: options.dropdownParent || jQuery(document.body),
      // allowClear: true
    });

    // Set initial value
    if (options.value !== undefined) {
      $node.val(options.value).trigger('change.select2');
    }

    $node.on('change', (e) => {
      node.dispatchEvent(new CustomEvent('select2_change', {
        detail: $node.val()
      }));
    });
  }

  // Use setTimeout to ensure the DOM is ready and any each-blocks are finished
  setTimeout(init, 0);

  return {
    update(newOptions) {
      if (newOptions.value !== undefined && $node.val() !== newOptions.value) {
        $node.val(newOptions.value).trigger('change.select2');
      }
      // Re-initialize if options change significantly if needed
    },
    destroy() {
      if ($node.data('select2')) {
        $node.select2('destroy');
      }
    }
  };
}
