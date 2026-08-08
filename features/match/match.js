import { injectStyle } from '../../js/utils/styleLoader.js';

injectStyle('features/match/css/match.css');

export function renderMatch() { return `
<section class="pt-16 md:pt-20 pb-10">
  <div class="max-w-4xl mx-auto px-4 sm:px-6">
    <div id="matchRoot"></div>
  </div>
</section>
`; }
