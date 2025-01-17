// Function to convert to kebab-case
function toKebabCase(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Function to replace markdown links with HTML links
function replaceMarkdownLinks() {
  const markdownBody = document.querySelector('.markdown-body');
  if (!markdownBody) return;

  const regex = /\[\[(#?.+?)\]\]/g;
  markdownBody.innerHTML = markdownBody.innerHTML.replace(regex, (match, p1) => {
    if (p1.startsWith('#')) {
      // It's a section link
      const sectionName = p1.substring(1); // Remove the leading #
      const kebabCaseSection = toKebabCase(sectionName);
      return `<a href="#${kebabCaseSection}">${p1.slice(1)}</a>`;
    } else {
      // It's a file link
      const encodedFilename = encodeURIComponent(p1).replace(/%2F/g, '/'); // Keep forward slashes for subdirectories
      return `<a href="${encodedFilename}.md">${p1}</a>`;
    }
  });
}

// Function to initialize the MutationObserver
function initMutationObserver() {
  const targetNode = document.body;
  const observerOptions = {
    childList: true,
    subtree: true
  };

  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const addedNodes = mutation.addedNodes;
        for (let node of addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('markdown-body')) {
            replaceMarkdownLinks();
            return;
          }
        }
      }
    }
  });

  observer.observe(targetNode, observerOptions);
}

// Run on initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMutationObserver);
} else {
  initMutationObserver();
}

// Also run immediately in case the DOM has already loaded
replaceMarkdownLinks();
