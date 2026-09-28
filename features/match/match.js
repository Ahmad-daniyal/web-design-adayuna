import { injectStyle } from '../../js/utils/styleLoader.js';

injectStyle('features/match/css/match.css');

export function renderMatch() { return `
<section class="match-page pt-10 md:pt-12 pb-6">
  <div class="max-w-4xl mx-auto px-4 sm:px-6">
    <div id="matchRoot"></div>
  </div>
</section>
`; }
