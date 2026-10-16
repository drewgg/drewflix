document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('show-grid');
    const hero = document.getElementById('featured-show');
    const heroBg = document.getElementById('hero-bg');
    const heroContentContainer = document.getElementById('hero-content-container');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal');

    // Assign the data directly from data.js
    let showData = localShowData;
    let gridData = [];
    
    // Cycling state
    let currentCycleIndex = 0;
    let cycleInterval;

    initUI(showData);

    function initUI(data) {
        // 1. Try to find an explicitly featured show
        let featuredShow = data.find(show => show.featured);
        
        // 2. Fallback: pick a random show that has a banner image
        if (!featuredShow) {
            const bannerShows = data.filter(show => show.images?.banner?.src);
            
            if (bannerShows.length > 0) {
                let recentFeatured = JSON.parse(localStorage.getItem('drewflix_recent_featured') || '[]');
                let availableShows = bannerShows.filter(show => !recentFeatured.includes(show.id));
                
                if (availableShows.length === 0) {
                    availableShows = bannerShows;
                }

                const randomIndex = Math.floor(Math.random() * availableShows.length);
                featuredShow = availableShows[randomIndex];

                recentFeatured.push(featuredShow.id);
                if (recentFeatured.length > 2) {
                    recentFeatured.shift(); 
                }
                localStorage.setItem('drewflix_recent_featured', JSON.stringify(recentFeatured));
            } else {
                // 3. Final fallback: just use the very first show
                featuredShow = data[0]; 
            }
        }
        
        // Build and shuffle grid data
        gridData = [...data];
        if (RANDOMIZE_RECOMMENDED) {
            for (let i = gridData.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [gridData[i], gridData[j]] = [gridData[j], gridData[i]];
            }
        }
        
        // Synchronize cycle start index with the initial featured show
        currentCycleIndex = gridData.findIndex(s => s.id === featuredShow.id);
        if (currentCycleIndex === -1) currentCycleIndex = 0;

        renderHero(featuredShow);
        gridData.forEach(show => renderCard(show));
        
        startHeroCycle();
    }

    // -- Hero Cycling Logic --
    function startHeroCycle() {
        if (FEATURED_SHOW_CYCLE_TIME > 0) {
            cycleInterval = setInterval(() => {
                currentCycleIndex = (currentCycleIndex + 1) % gridData.length;
                transitionHero(gridData[currentCycleIndex]);
            }, FEATURED_SHOW_CYCLE_TIME * 1000);
        }
    }

    function transitionHero(nextShow) {
        // Add CSS class to fade to black
        hero.classList.add('is-fading');
        
        // Wait for the CSS transition (0.5s) to complete before swapping content
        setTimeout(() => {
            renderHero(nextShow);
            hero.classList.remove('is-fading'); // Fade back in
        }, 500); 
    }

    function renderHero(show) {
        const imgSrc = show.images?.banner?.src || show.images?.thumbnail?.src;
        const imgPos = show.images?.banner?.layouts?.hero || 'center center';

        heroBg.style.backgroundImage = `url('${imgSrc}')`;
        heroBg.style.backgroundPosition = imgPos;
        
        // Determine if there is a trailer link
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
            <button class="btn" onclick="openModal('${show.id}')">More Info</button>
            ${trailerButtonHtml}
        `;
    }

    function renderCard(show) {
        const article = document.createElement('article');
        article.className = 'show-card';
        article.onclick = () => openModal(show.id);
        
        const imgSrc = show.images?.thumbnail?.src;
        const imgPos = show.images?.thumbnail?.layouts?.recommended || 'center center';
        
        article.innerHTML = `
            <img src="${imgSrc}" alt="Thumbnail" style="object-position: ${imgPos};">
            <div class="show-card-title">${show.title}</div>
        `;
        grid.appendChild(article);
    }

    // -- Modal and Actions --
    window.openModal = (id) => {
        const show = showData.find(s => String(s.id) === String(id));
        if (!show) return;

        let linksHtml = '';
        if (show.watchLinks && show.watchLinks.length > 0) {
            // Keep all links, including the trailer. Apply the secondary button style to the trailer for consistency.
            linksHtml = show.watchLinks
                .map(link => {
                    const btnClass = link.platform === "Trailer" ? "btn btn-secondary" : "btn";
                    return `<a href="${link.url}" target="_blank" class="${btnClass}">${link.platform}</a>`;
                })
                .join('');
        }

        const imgSrc = show.images?.banner?.src || show.images?.thumbnail?.src;
        const imgPos = show.images?.banner?.layouts?.modal || 'center center';

        modalBody.innerHTML = `
            <img src="${imgSrc}" class="modal-header-img" style="object-position: ${imgPos};" alt="Header">
            <div class="modal-details">
                <h2 class="modal-title">${show.title}</h2>
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
        clearInterval(cycleInterval); // Pause cycle while modal is open
    };

    window.openTrailer = (url) => {
        // Extract standard video ID from watch link or youtu.be shortlink
        let videoId = '';
        if (url.includes('v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }

        if (videoId) {
            // Re-use the existing modal but swap the internal layout for an iframe
            modalBody.innerHTML = `
                <div class="video-container">
                    <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; encrypted-media;" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
            `;
            modalOverlay.classList.add('is-open');
            clearInterval(cycleInterval); // Pause cycle
        } else {
            console.error("Could not parse YouTube ID from provided Trailer link:", url);
        }
    };

    function closeModal() {
        modalOverlay.classList.remove('is-open');
        // Clear iframe or data so video stops playing immediately
        modalBody.innerHTML = ''; 
        startHeroCycle(); // Resume cycle
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