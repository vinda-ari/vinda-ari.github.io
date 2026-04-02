// ===== DOM Elements =====
const openingSection = document.getElementById('opening');
const mainContent = document.getElementById('main-content');
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.querySelector('.music-btn');
const musicIcon = document.getElementById('music-icon');

// ===== Global Variables =====
let isPlaying = false;

// ===== Get Guest Name from URL =====
function getGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    
    const guestNameElement = document.getElementById('guest-name');
    const guestNameInline = document.getElementById('guest-name-inline');
    
    if (guestName) {
        const decodedName = decodeURIComponent(guestName);
        guestNameElement.textContent = decodedName;
        guestNameInline.textContent = decodedName;
    } else {
        guestNameElement.textContent = 'Tamu Undangan';
        guestNameInline.textContent = 'Bapak/Ibu/Saudara/i';
    }
}

// ===== Initialize on Page Load =====
window.addEventListener('DOMContentLoaded', () => {
    getGuestName();
});

// ===== Open Invitation =====
function openInvitation() {
    // Hide opening section with fade out
    openingSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    openingSection.style.opacity = '0';
    openingSection.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        openingSection.style.display = 'none';
        mainContent.classList.remove('hidden');
        
        // Fade in main content
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.8s ease';
        
        setTimeout(() => {
            mainContent.style.opacity = '1';
            
            // Initialize animations after content is visible
            initAOS();
            startCountdown();
            
            // Try to play music
            playMusic();
        }, 100);
    }, 800);
}

// ===== Music Control =====
function toggleMusic() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.classList.add('playing');
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-pause');
    }).catch(error => {
        console.log('Autoplay prevented:', error);
        isPlaying = false;
    });
}

function pauseMusic() {
    bgMusic.pause();
    isPlaying = false;
    musicBtn.classList.remove('playing');
    musicIcon.classList.remove('fa-pause');
    musicIcon.classList.add('fa-music');
}

// ===== Countdown Timer =====
function startCountdown() {
    // Set wedding date: May 30, 2026
    const weddingDate = new Date('May 30, 2026 09:00:00').getTime();
    
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update DOM
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        
        // If countdown is finished
        if (distance < 0) {
            clearInterval(countdown);
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
        }
    }, 1000);
}

// ===== Initialize AOS (Animate On Scroll) =====
function initAOS() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay if specified
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
}

// ===== Copy to Clipboard =====
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success notification
        showNotification('Nomor rekening berhasil disalin!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Nomor rekening berhasil disalin!');
    });
}

// ===== Show Notification =====
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #0D5C3D 0%, #064028 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideDown 0.5s ease;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        notification.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== RSVP Form Submission =====
document.addEventListener('DOMContentLoaded', () => {
    const rsvpForm = document.querySelector('.rsvp-form');
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(rsvpForm);
            const name = formData.get('name');
            const attendance = formData.get('attendance');
            const guests = formData.get('guests');
            const message = formData.get('message');
            
            // Validate
            if (!name || !attendance) {
                showNotification('Mohon lengkapi data yang diperlukan');
                return;
            }
            
            // Create wish card
            addWishCard(name, attendance, message);
            
            // Reset form
            rsvpForm.reset();
            
            // Show success notification
            showNotification('Terima kasih atas konfirmasi kehadiran Anda!');
            
            // Scroll to wishes section
            setTimeout(() => {
                document.getElementById('wishes').scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        });
    }
});

// ===== Add Wish Card =====
function addWishCard(name, attendance, message) {
    const wishesContainer = document.getElementById('wishes-container');
    
    const statusText = attendance === 'hadir' ? 'Hadir' : 
                       attendance === 'tidak' ? 'Tidak Hadir' : 'Ragu-ragu';
    const statusClass = attendance === 'hadir' ? 'attending' : 'not-attending';
    
    const wishCard = document.createElement('div');
    wishCard.className = 'wish-card';
    wishCard.style.animation = 'fadeInUp 0.5s ease';
    wishCard.innerHTML = `
        <div class="wish-header">
            <div class="wish-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="wish-info">
                <h4>${escapeHtml(name)}</h4>
                <span class="wish-status ${statusClass}">${statusText}</span>
            </div>
        </div>
        <p class="wish-message">${message ? escapeHtml(message) : 'Tidak ada ucapan'}</p>
    `;
    
    // Insert at the beginning
    wishesContainer.insertBefore(wishCard, wishesContainer.firstChild);
}

// ===== Escape HTML to prevent XSS =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Parallax Effect on Scroll =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax for hero section
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    // Parallax for floating lanterns
    const lanterns = document.querySelector('.floating-lanterns');
    if (lanterns) {
        lanterns.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// ===== Create Floating Stars Animation =====
function createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: #D4AF37;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.5};
            animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        starsContainer.appendChild(star);
    }
}

// Initialize stars on load
createStars();

// ===== Preloader (Optional) =====
window.addEventListener('load', () => {
    // Hide preloader if exists
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// ===== Gallery Lightbox (Simple Implementation) =====
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        // For now, just show a notification
        // You can implement a full lightbox later
        showNotification('Galeri foto akan segera tersedia!');
    });
});

// ===== Touch Events for Mobile =====
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;
    
    // Add scroll indicator animation
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator && diff > 50) {
        scrollIndicator.style.opacity = '0';
    }
}, { passive: true });

// ===== Confetti Effect on Form Submit =====
function createConfetti() {
    const colors = ['#D4AF37', '#0D5C3D', '#F4E4BC', '#1A8A5C'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: ${Math.random() * 0.5 + 0.5};
            transform: rotate(${Math.random() * 360}deg);
            animation: fall ${Math.random() * 3 + 2}s linear forwards;
            z-index: 10000;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
    
    // Add fall animation if not exists
    if (!document.querySelector('#confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes fall {
                to {
                    top: 100vh;
                    opacity: 0;
                    transform: rotate(720deg) translateX(${Math.random() * 200 - 100}px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== Console Easter Egg =====
console.log('%c💒 Wedding Invitation', 'font-size: 24px; font-weight: bold; color: #D4AF37;');
console.log('%cAhmad & Fatimah', 'font-size: 18px; color: #0D5C3D;');
console.log('%cBarakallahu lakuma wa baraka alaikuma', 'font-size: 14px; color: #666;');

// ===== Floating Action Buttons =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function openMaps() {
    // Replace with your actual venue coordinates
    // Format: latitude,longitude
    const latitude = -6.2088; // Example: Jakarta coordinates
    const longitude = 106.8456;
    
    // Open Google Maps with the coordinates
    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapsUrl, '_blank');
    
    // Alternative: Open with place name
    // const placeName = "Gedung Pernikahan Jakarta";
    // const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;
    // window.open(mapsUrl, '_blank');
}

// Show/hide scroll to top button based on scroll position
window.addEventListener('scroll', () => {
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (scrollTopBtn) {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.pointerEvents = 'none';
        }
    }
});
