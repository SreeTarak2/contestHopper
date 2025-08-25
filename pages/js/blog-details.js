document.addEventListener('DOMContentLoaded', () => {

    // --- 1. READING PROGRESS BAR (UX Enhancement) ---
    const progressBar = document.getElementById('readingProgressBar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = (window.pageYOffset / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        });
    }

    // --- 2. DYNAMIC TABLE OF CONTENTS (Advanced Enhancement) ---
    const tocList = document.getElementById('toc-list');
    const articleBody = document.querySelector('.article-body');
    const tocContainer = document.querySelector('.table-of-contents');

    if (tocList && articleBody && tocContainer) {
        const headings = articleBody.querySelectorAll('h2, h3');
        
        if (headings.length > 0) {
            headings.forEach((heading, index) => {
                // Create a clean ID for the heading
                const id = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                heading.id = id;

                // Create the list item for the TOC
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = `#${id}`;
                link.textContent = heading.textContent;
                
                // Indent H3s for hierarchy
                if (heading.tagName === 'H3') {
                    listItem.classList.add('toc-h3');
                }

                listItem.appendChild(link);
                tocList.appendChild(listItem);
            });
        } else {
            tocContainer.style.display = 'none';
        }
    }
    const tocLinks = document.querySelectorAll('.table-of-contents a');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    document.documentElement.style.scrollBehavior = 'smooth';
});