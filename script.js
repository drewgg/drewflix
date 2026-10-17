document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('main');
    const recommendedGrid = document.getElementById('show-grid');
    const hero = document.getElementById('featured-show');
    const heroBg = document.getElementById('hero-bg');
    const heroContentContainer = document.getElementById('hero-content-container');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal');

    // Assign the data directly from data.js
    let showData = localShowData;
    let gridData = [];
    
    // Config fallbacks (in case they are missing from data.js)
    const cycleTime = typeof FEATURED_SHOW_CYCLE_TIME !== 'undefined' ? FEATURED_SHOW_CYCLE_TIME : 5;
    const maxRecommended = typeof MAX_RECOMMENDED_SHOWS !== 'undefined' ? MAX_RECOMMENDED_SHOWS : 10;
    const isRandomized = typeof RANDOMIZE_RECOMMENDED !== 'undefined' ? RANDOMIZE_RECOMMENDED : false;

    // Cycling state
    let currentCycleIndex = 0;
    let cycleInterval;

    initUI(showData);

    function initUI(data) {
        // 1. Setup Hero Section
        let featuredShow = data.find(show => show.featured);
        
        if (!featuredShow) {
            const bannerShows = data.filter(show => show.images?.banner?.src);
            if (bannerShows.length > 0) {
                let recentFeatured = JSON.parse(localStorage.getItem('drewflix_recent_featured') || '[]');

                // Use show.title instead of ID for persistent storage memory
                let availableShows = bannerShows.filter(show => !recentFeatured.includes(show.title));
                
                if (availableShows.length === 0) availableShows = bannerShows;

                const randomIndex = Math.floor(Math.random() * availableShows.length);
                featuredShow = availableShows[randomIndex];

                recentFeatured.push(featuredShow.title);
                if (recentFeatured.length > 2) recentFeatured.shift(); 
                localStorage.setItem('drewflix_recent_featured', JSON.stringify(recentFeatured));
            } else {
                featuredShow = data[0]; 
            }
        }
        
        // 2. Build and shuffle primary grid data
        gridData = [...data];
        if (isRandomized) {
            for (let i = gridData.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [gridData[i], gridData[j]] = [gridData[j], gridData[i]];
            }
        }
        
        currentCycleIndex = gridData.findIndex(s => s === featuredShow);
        if (currentCycleIndex === -1) currentCycleIndex = 0;

        renderHero(featuredShow);
        startHeroCycle();

        // 3. Render "Recommended for You"
        const recommendedShows = gridData.slice(0, maxRecommended);
        recommendedShows.forEach(show => {
            recommendedGrid.appendChild(createCardElement(show));
        });

        // 4. Generate Tag Grids
        const tagsSet = new Set();
        data.forEach(show => {
            if (show.tags && Array.isArray(show.tags)) {
                show.tags.forEach(tag => tagsSet.add(tag));
            }
        });
        
        const uniqueTags = Array.from(tagsSet).sort();
        uniqueTags.forEach(tag => {
            const showsWithTag = data.filter(show => show.tags && show.tags.includes(tag));
            
            if (showsWithTag.length > 0) {
                const section = document.createElement('section');
                section.className = 'browse-section';
                section.innerHTML = `
                    <h2>${tag}</h2>
                    <div class="grid"></div>
                `;
                const tagGrid = section.querySelector('.grid');
                showsWithTag.forEach(show => {
                    tagGrid.appendChild(createCardElement(show));
                });
                mainContainer.appendChild(section);
            }
        });
    }

    // -- Hero Logic --
    function startHeroCycle() {
        if (cycleTime > 0) {
            cycleInterval = setInterval(() => {
                currentCycleIndex = (currentCycleIndex + 1) % gridData.length;
                transitionHero(gridData[currentCycleIndex]);
            }, cycleTime * 1000);
        }
    }

    function transitionHero(nextShow) {
        hero.classList.add('is-fading');
        setTimeout(() => {
            renderHero(nextShow);
            hero.classList.remove('is-fading'); 
        }, 500); 
    }

    function renderHero(show) {
        const imgSrc = show.images?.banner?.src || show.images?.thumbnail?.src;
        const imgPos = show.images?.banner?.layouts?.hero || 'center center';
        
        // Find the absolute original index for the modal reference
        const originalIndex = showData.indexOf(show);

        heroBg.style.backgroundImage = `url('${imgSrc}')`;
        heroBg.style.backgroundPosition = imgPos;
        
        let trailerButtonHtml = '';
        if (show.watchLinks) {
            const trailerLink = show.watchLinks.find(link => link.platform === "Trailer");
            if (trailerLink) {
                trailerButtonHtml = `<button class="btn btn-secondary" onclick="openTrailer('${trailerLink.url}')">Trailer</button>`;
            }
        }
        
        heroContentContainer.innerHTML = `
            <h1 class="hero-title">${show.title}</h1>
            <div class="hero-description">${show.description}</div>
            <button class="btn" onclick="openModal(${originalIndex})">More Info</button>
            ${trailerButtonHtml}
        `;
    }

    // Returns a configured DOM element for a show card
    function createCardElement(show) {
        const article = document.createElement('article');
        article.className = 'show-card';
        
        // Find the absolute original index for the modal reference
        const originalIndex = showData.indexOf(show);
        article.onclick = () => openModal(originalIndex);
        
        const imgSrc = show.images?.thumbnail?.src;
        const imgPos = show.images?.thumbnail?.layouts?.recommended || 'center center';
        
        article.innerHTML = `
            <img src="${imgSrc}" alt="Thumbnail" style="object-position: ${imgPos};">
            <div class="show-card-title">${show.title}</div>
        `;
        return article;
    }

    // -- Modal and Actions --
    window.openModal = (index) => {
        // Look up by original array index instead of ID
        const show = showData[index];
        if (!show) return;

        let linksHtml = '';
        if (show.watchLinks && show.watchLinks.length > 0) {
            linksHtml = show.watchLinks
                .map(link => {
                    const btnClass = link.platform === "Trailer" ? "btn btn-secondary" : "btn";
                    return `<a href="${link.url}" target="_blank" class="${btnClass}">${link.platform}</a>`;
                })
                .join('');
        }
        
        let tagsHtml = '';
        if (show.tags && show.tags.length > 0) {
            tagsHtml = `<div class="modal-tags">
                ${show.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('')}
            </div>`;
        }

        const imgSrc = show.images?.banner?.src || show.images?.thumbnail?.src;
        const imgPos = show.images?.banner?.layouts?.modal || 'center center';

        modalBody.innerHTML = `
            <img src="${imgSrc}" class="modal-header-img" style="object-position: ${imgPos};" alt="Header">
            <div class="modal-details">
                <h2 class="modal-title">${show.title}</h2>
                ${tagsHtml}
                <div class="modal-desc">${show.description}</div>
                
                <div class="watch-section">
                    <h3>How to Watch</h3>
                    ${show.watchDescription ? `<div class="watch-desc">${show.watchDescription}</div>` : ''}
                    <div class="links-container">
                        ${linksHtml}
                    </div>
                </div>
            </div>
        `;
        
        modalOverlay.classList.add('is-open');
        clearInterval(cycleInterval); 
    };

    window.openTrailer = (url) => {
        let videoId = '';
        if (url.includes('v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }

        if (videoId) {
            modalBody.innerHTML = `
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; encrypted-media;" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
            `;
            modalOverlay.classList.add('is-open');
            clearInterval(cycleInterval); 
        } else {
            console.error("Could not parse YouTube ID from provided Trailer link:", url);
        }
    };

    function closeModal() {
        modalOverlay.classList.remove('is-open');
        modalBody.innerHTML = ''; 
        startHeroCycle(); 
    }

    closeModalBtn.addEventListener('click', closeModal);
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
            closeModal();
        }
    });
});