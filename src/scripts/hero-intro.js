// Home hero load-in: the headline rises line by line out of a mask, then the
// subtitle and buttons follow (timings live in styles/pages/_home.scss).
//
// An inline script in index.html adds html.has-intro before first paint (only
// when motion is allowed), which hides the hero text. This script splits the
// headline into words, groups them by the line they render on, and adds
// .is-playing to run the CSS animations. When they finish, the original markup
// is restored, so nothing of the effect is left in the DOM.

const FONT_WAIT_MS = 800; // don't hold the intro back for slow font loads
const TOO_LATE_MS = 2500; // if scripts arrive this late, just show the page
const FAILSAFE_MS = 4000;

export async function playHeroIntro() {
  const root = document.documentElement;
  if (!root.classList.contains('has-intro')) return;

  const title = document.querySelector('[data-intro-title]');
  const finish = () => root.classList.remove('has-intro', 'is-playing');
  if (!title || performance.now() > TOO_LATE_MS) return finish();

  // Lines can only be measured with the final font in place.
  await Promise.race([document.fonts?.ready, wait(FONT_WAIT_MS)]);

  const originalHtml = title.innerHTML;
  title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
  const words = splitIntoWords(title);
  const lineCount = tagLines(words);
  root.style.setProperty('--intro-lines', lineCount);
  root.classList.add('is-playing');

  // Clean up after the last element lands (or a failsafe, e.g. a hidden tab).
  const last = document.querySelector('.home-hero__actions > :last-child');
  const restore = () => {
    title.innerHTML = originalHtml;
    title.removeAttribute('aria-label');
    root.style.removeProperty('--intro-lines');
    finish();
  };
  let restored = false;
  const restoreOnce = () => {
    if (restored) return;
    restored = true;
    restore();
  };
  last?.addEventListener('animationend', restoreOnce, { once: true });
  setTimeout(restoreOnce, FAILSAFE_MS);
}

/** Wrap every word in a mask span, preserving any existing inline elements. */
function splitIntoWords(element) {
  const textNodes = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  const words = [];
  for (const node of textNodes) {
    const fragment = document.createDocumentFragment();
    for (const part of node.textContent.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        fragment.append(' ');
        continue;
      }
      const mask = document.createElement('span');
      const inner = document.createElement('span');
      mask.className = 'intro-word';
      inner.className = 'intro-word__inner';
      inner.textContent = part;
      mask.append(inner);
      fragment.append(mask);
      words.push(mask);
    }
    node.replaceWith(fragment);
  }
  return words;
}

/** Give each word the index of the rendered line it sits on; returns the line count. */
function tagLines(words) {
  let line = -1;
  let lineTop = -Infinity;
  for (const word of words) {
    const top = word.getBoundingClientRect().top;
    if (top - lineTop > 4) {
      line += 1;
      lineTop = top;
    }
    word.style.setProperty('--line', line);
  }
  return line + 1;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
