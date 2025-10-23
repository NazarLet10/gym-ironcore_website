// Основний JavaScript код для сайту IronCore

// Функція для ініціалізації сайту
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт IronCore завантажено успішно!');
    
    // Ініціалізація основних функцій
    initNavigation();
    initScrollEffects();
    initHeroSlider();
    initGallerySlider();
    initAnimations();
    initBookingModal();
    initTrainersSection();
    initSaleTimer();
    
    // Додаткові функції
    updateCurrentYear();
    trackSocialClicks();
});

// Функція для обробки навігації
function initNavigation() {
    const navLinks = document.querySelectorAll('.main-nav a, .footer-nav a');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    // Обробка кліків по посиланнях
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Додаємо клас активної сторінки
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Закриваємо мобільне меню після кліку
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
            
            // Плавний скрол для якорних посилань
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Обробка мобільного меню
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }
    
    // Закриття меню при кліку поза ним
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.main-nav') && !e.target.closest('.mobile-menu-btn')) {
            mainNav.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            }
        }
    });
}

// Функція для ефектів при скролі
function initScrollEffects() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        // Ефект зміни шапки при скролі
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(9, 85, 115, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.padding = '15px 0';
            header.style.background = 'var(--accent-blue)';
            header.style.backdropFilter = 'none';
        }
        
        // Анімація елементів при скролі (виключаємо статистику)
        const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .section-header');
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
        
        lastScrollY = window.scrollY;
    });
}

// Функція для слайдера герой-секції
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!slides.length) {
        console.warn('Слайди не знайдені');
        return;
    }

    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        // Перевірка коректності індексу
        if (index < 0 || index >= slides.length) return;
        
        // Приховати всі слайди
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Деактивувати всі точки
        if (dots.length) {
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Активувати поточну точку
            if (dots[index]) {
                dots[index].classList.add('active');
            }
        }
        
        // Показати поточний слайд
        slides[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        goToSlide(nextIndex);
    }

    // Додаємо обробники кліків для точок
    if (dots.length) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
        });
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000); // Зміна кожні 5 секунд
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // Ініціалізація
    goToSlide(0);
    startAutoSlide();
    
    // Зупинка авто-прокрутки при наведенні
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', stopAutoSlide);
        heroSlider.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Перезапуск слайдера при видимості сторінки
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoSlide();
        } else {
            startAutoSlide();
        }
    });
    
    // Додаємо контроль висоти
    function adjustHeroHeight() {
        const hero = document.querySelector('.hero');
        const heroSlider = document.querySelector('.hero-slider');
        const windowHeight = window.innerHeight;
        const headerHeight = document.querySelector('header').offsetHeight;
        
        // Встановлюємо мінімальну висоту для герой-секції
        hero.style.minHeight = windowHeight + 'px';
        heroSlider.style.minHeight = (windowHeight - headerHeight - 200) + 'px';
    }
    
    // Викликаємо при завантаженні та зміні розміру вікна
    adjustHeroHeight();
    window.addEventListener('resize', adjustHeroHeight);
}

// Функція для слайдера галереї
function initGallerySlider() {
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    let currentSlide = 0;
    
    // Створюємо точки для галереї
    const galleryDots = document.querySelector('.gallery-dots');
    if (galleryDots) {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `gallery-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToGallerySlide(index));
            galleryDots.appendChild(dot);
        });
    }
    
    function goToGallerySlide(index) {
        slides[currentSlide].classList.remove('active');
        slides[index].classList.add('active');
        
        // Оновлюємо активну точку
        const dots = document.querySelectorAll('.gallery-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    function nextGallerySlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        goToGallerySlide(nextIndex);
    }
    
    function prevGallerySlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }
        goToGallerySlide(prevIndex);
    }
    
    // Додаємо обробники подій для кнопок
    if (nextBtn) {
        nextBtn.addEventListener('click', nextGallerySlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevGallerySlide);
    }
    
    // Автоматична зміна слайдів галереї кожні 6 секунд
    let galleryInterval = setInterval(nextGallerySlide, 6000);
    
    // Зупиняємо автоматичну зміну при взаємодії з користувачем
    const galleryContainer = document.querySelector('.gallery-slider');
    if (galleryContainer) {
        galleryContainer.addEventListener('mouseenter', () => {
            clearInterval(galleryInterval);
        });
        
        galleryContainer.addEventListener('mouseleave', () => {
            galleryInterval = setInterval(nextGallerySlide, 6000);
        });
    }
}

// Функція для анімації лічильників
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Відразу робимо числа видимими
    statNumbers.forEach(number => {
        number.style.opacity = '1';
        number.style.transform = 'translateY(0)';
        number.style.transition = 'none';
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                const duration = 2000;
                const step = count / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= count) {
                        current = count;
                        clearInterval(timer);
                    }
                    target.textContent = Math.floor(current);
                }, 16);
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.3 });
    
    statNumbers.forEach(number => {
        observer.observe(number);
    });
}

// Функція для додаткових анімацій
function initAnimations() {
    // Анімація карток особливостей при наведенні
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Анімація кнопок
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px)';
        });
    });
    
    // Анімація карток відгуків
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    testimonialCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        
        // Затримка для кожного елемента
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * index);
        
        // Ефект при наведенні
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Виправлена функція для секції тренерів
// Виправлена функція для секції тренерів
function initTrainersSection() {
    const track = document.getElementById('trainers-track');
    const prevBtn = document.querySelector('.trainers-prev');
    const nextBtn = document.querySelector('.trainers-next');
    const cards = document.querySelectorAll('.trainer-card-slide');
    const dots = document.querySelectorAll('.trainers-dot');
    
    if (!track || !prevBtn || !nextBtn || cards.length === 0) {
        console.log('Елементи слайдера тренерів не знайдені');
        return;
    }
    
    let currentPosition = 0;
    let currentSlide = 0;
    const cardWidth = cards[0].offsetWidth + 30;
    const visibleCards = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const maxPosition = -((cards.length - visibleCards) * cardWidth);
    const totalSlides = Math.ceil(cards.length / visibleCards);
    
    console.log('Ініціалізація слайдера тренерів:', {
        cards: cards.length,
        visibleCards,
        cardWidth,
        maxPosition,
        totalSlides
    });
    
    // Гарантуємо видимість стрілок
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
    
    function updateSlider() {
        track.style.transform = `translateX(${currentPosition}px)`;
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        // Оновлюємо стан кнопок
        const isAtStart = currentPosition >= 0;
        const isAtEnd = currentPosition <= maxPosition;
        
        prevBtn.style.opacity = isAtStart ? '0.5' : '1';
        prevBtn.style.cursor = isAtStart ? 'not-allowed' : 'pointer';
        prevBtn.disabled = isAtStart;
        
        nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
        nextBtn.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
        nextBtn.disabled = isAtEnd;
        
        // Оновлюємо точки
        updateDots();
        
        console.log('Поточна позиція:', currentPosition, 'Поточний слайд:', currentSlide);
    }
    
    function updateDots() {
        const activeDot = Math.floor(Math.abs(currentPosition) / (cardWidth * visibleCards));
        
        dots.forEach((dot, index) => {
            const isActive = index === activeDot;
            dot.classList.toggle('active', isActive);
            dot.style.opacity = isActive ? '1' : '0.5';
        });
    }
    
    function nextSlide() {
        if (currentPosition > maxPosition) {
            currentPosition -= cardWidth * visibleCards;
            currentSlide++;
            updateSlider();
        }
    }
    
    function prevSlide() {
        if (currentPosition < 0) {
            currentPosition += cardWidth * visibleCards;
            currentSlide--;
            updateSlider();
        }
    }
    
    function goToSlide(slideIndex) {
        const newPosition = -(slideIndex * cardWidth * visibleCards);
        if (newPosition >= maxPosition && newPosition <= 0) {
            currentPosition = newPosition;
            currentSlide = slideIndex;
            updateSlider();
        }
    }
    
    // Додаємо обробники подій для кнопок
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Додаємо обробники для точок
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Обробка розгортання деталей тренера
    const toggleButtons = document.querySelectorAll('.toggle-details');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.trainer-card-slide');
            const details = card.querySelector('.trainer-details');
            const isVisible = details.style.display === 'block';
            
            // Закриваємо всі інші відкриті деталі
            document.querySelectorAll('.trainer-details').forEach(d => {
                d.style.display = 'none';
            });
            document.querySelectorAll('.toggle-details').forEach(btn => {
                btn.textContent = 'Дізнатись більше';
            });
            
            if (!isVisible) {
                details.style.display = 'block';
                this.textContent = 'Згорнути';
                
                // Прокручуємо до картки при відкритті деталей
                setTimeout(() => {
                    card.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 300);
            }
        });
    });
    
    // Ініціалізація
    updateSlider();
    
    // Обробка зміни розміру вікна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newVisibleCards = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
            const newMaxPosition = -((cards.length - newVisibleCards) * cardWidth);
            
            // Коригуємо поточну позицію
            if (currentPosition < newMaxPosition) {
                currentPosition = newMaxPosition;
            }
            if (currentPosition > 0) {
                currentPosition = 0;
            }
            
            currentSlide = Math.floor(Math.abs(currentPosition) / (cardWidth * newVisibleCards));
            updateSlider();
        }, 250);
    });
    
    // Автоматичне гортання (опціонально)
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (currentPosition > maxPosition) {
                nextSlide();
            } else {
                // Повертаємо до початку
                currentPosition = 0;
                currentSlide = 0;
                updateSlider();
            }
        }, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Запускаємо автоматичне гортання
    startAutoSlide();
    
    // Зупиняємо при наведенні
    const trainersSlider = document.querySelector('.trainers-slider');
    if (trainersSlider) {
        trainersSlider.addEventListener('mouseenter', stopAutoSlide);
        trainersSlider.addEventListener('mouseleave', startAutoSlide);
    }
    
    console.log('Слайдер тренерів успішно ініціалізовано');
}

// Функція для модального вікна запису
function initBookingModal() {
    const modal = document.getElementById('booking-modal');
    const openButtons = document.querySelectorAll('.open-booking');
    const closeButton = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('booking-form');
    const timeSlots = document.querySelectorAll('.time-slot');
    let selectedTime = '';
    let currentTrainerName = '';

    // Відкриття модального вікна
    openButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentTrainerName = this.getAttribute('data-trainer');
            
            console.log('Відкриваємо модалку для тренера:', currentTrainerName);
            
            // Оновлюємо відображення обраного тренера
            const trainerDisplay = document.getElementById('selected-trainer-display');
            if (trainerDisplay) {
                trainerDisplay.textContent = currentTrainerName;
            }
            
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
            
            // Скидаємо форму
            if (bookingForm) {
                bookingForm.reset();
            }
            
            selectedTime = '';
            timeSlots.forEach(slot => slot.classList.remove('selected'));
        });
    });
    
    // Закриття модального вікна
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Закриття при кліку поза модального вікна
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Обробка вибору часу
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            selectedTime = this.getAttribute('data-time');
        });
    });
    
    // Обробка відправки форми
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Перевірка обов'язкових полів
            const clientSurname = document.getElementById('client-surname').value;
            const clientName = document.getElementById('client-name').value;
            const clientPhone = document.getElementById('client-phone').value;
            const trainingDate = document.getElementById('training-date').value;
            
            if (!clientSurname || !clientName || !clientPhone || !trainingDate || !selectedTime) {
                alert('Будь ласка, заповніть всі обов\'язкові поля та оберіть дату і час тренування.');
                return;
            }
            
            // Тут буде код для відправки форми на сервер
            const formData = {
                surname: clientSurname,
                name: clientName,
                phone: clientPhone,
                email: document.getElementById('client-email').value,
                trainer: currentTrainerName,
                date: trainingDate,
                time: selectedTime
            };
            
            console.log('Дані форми для відправки:', formData);
            
            // Імітація успішної відправки
            alert('Дякуємо за запис на тренування до ' + formData.trainer + '! Ми зв\'яжемося з вами найближчим часом для підтвердження.');
            
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            
            // Очищення форми
            bookingForm.reset();
            selectedTime = '';
            timeSlots.forEach(slot => slot.classList.remove('selected'));
            currentTrainerName = '';
        });
    }
}

// Функція для таймера акцій
function initSaleTimer() {
    console.log('Ініціалізація таймера...');
    
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const scrollButton = document.querySelector('.scroll-to-membership');

    // Перевірка елементів
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        console.error('Елементи таймера не знайдені!');
        return;
    }

    console.log('Всі елементи таймера знайдені');

    // Встановлюємо дату закінчення акції на 9 днів від поточного моменту
    const saleEndDate = new Date();
    saleEndDate.setDate(saleEndDate.getDate() + 9);
    saleEndDate.setHours(23, 59, 59, 999);

    console.log('Поточна дата:', new Date());
    console.log('Акція закінчується:', saleEndDate);

    function updateTimer() {
        const now = new Date().getTime();
        const distance = saleEndDate - now;

        // Додаємо перевірку на NaN
        if (isNaN(distance)) {
            console.error('Помилка у розрахунку часу!');
            return;
        }

        if (distance < 0) {
            // Акція закінчилася
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            
            // Оновлюємо текст
            const timerText = document.querySelector('.timer-text p:last-child');
            if (timerText) {
                timerText.textContent = 'Акція завершилася!';
                timerText.style.color = '#FF6B35';
                timerText.style.fontWeight = '700';
            }
            
            return;
        }

        // Розраховуємо час
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        console.log(`Залишилось: ${days} днів ${hours} годин ${minutes} хвилин ${seconds} секунд`);

        // Оновлюємо відображення
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }

    // Обробник для кнопки прокрутки
    if (scrollButton) {
        scrollButton.addEventListener('click', function(e) {
            e.preventDefault();
            const membershipSection = document.querySelector('.membership-section');
            if (membershipSection) {
                membershipSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Запускаємо таймер
    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    
    // Додаємо очистку інтервалу при розвантаженні сторінки (опціонально)
    window.addEventListener('beforeunload', function() {
        clearInterval(timerInterval);
    });

    console.log('Таймер акцій успішно ініціалізовано на 9 днів');
}

// Функція для відображення поточного року у футері
function updateCurrentYear() {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
}

// Функція для обробки кліків на соціальні посилання
function trackSocialClicks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.querySelector('span').textContent;
            console.log(`Клік на соціальну мережу: ${platform}`);
        });
    });
}

// Обробка зміни розміру вікна
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const nav = document.querySelector('.main-nav');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
            if (menuBtn) {
                menuBtn.querySelector('i').classList.add('fa-bars');
                menuBtn.querySelector('i').classList.remove('fa-times');
            }
        }
    }
});

// JavaScript для сторінки послуг
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сторінка послуг завантажена');
    
    initGroupStudiesSection();
    initLearnMoreButton();
    initMembershipModal();
});

// Ініціалізація секції групових студій
function initGroupStudiesSection() {
    // Анімації для карток
    const studyCards = document.querySelectorAll('.study-type-card');
    const features = document.querySelectorAll('.feature');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Додаємо анімації для карток
    studyCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });
    
    // Додаємо анімації для особливостей
    features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-20px)';
        feature.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(feature);
    });

    // Анімація для додаткового блоку
    const additionalBlock = document.querySelector('.photo-additional');
    if (additionalBlock) {
        additionalBlock.style.opacity = '0';
        additionalBlock.style.transform = 'translateY(20px)';
        additionalBlock.style.transition = 'all 0.6s ease 0.8s';
        
        const additionalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        additionalObserver.observe(additionalBlock);
    }
}

// Ініціалізація кнопки "Дізнатись більше"
function initLearnMoreButton() {
    const learnMoreBtn = document.getElementById('learn-more-btn');
    const moreInfoSection = document.getElementById('more-info');
    
    if (learnMoreBtn && moreInfoSection) {
        learnMoreBtn.addEventListener('click', function() {
            if (moreInfoSection.style.display === 'none' || !moreInfoSection.style.display) {
                // Показуємо секцію
                moreInfoSection.style.display = 'block';
                
                // Додаємо невелику затримку для анімації
                setTimeout(() => {
                    moreInfoSection.style.opacity = '0';
                    moreInfoSection.style.transform = 'translateY(20px)';
                    
                    // Анімація появи
                    setTimeout(() => {
                        moreInfoSection.style.opacity = '1';
                        moreInfoSection.style.transform = 'translateY(0)';
                        moreInfoSection.style.transition = 'all 0.5s ease';
                    }, 50);
                }, 10);
                
                // Плавна прокрутка до секції
                setTimeout(() => {
                    moreInfoSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
                
                // Змінюємо текст кнопки
                this.textContent = 'Згорнути';
            } else {
                // Ховаємо секцію
                moreInfoSection.style.opacity = '0';
                moreInfoSection.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    moreInfoSection.style.display = 'none';
                    this.textContent = 'Дізнатись більше';
                }, 500);
            }
        });
    }
}

// Функція для модального вікна абонементів
function initMembershipModal() {
    const modal = document.getElementById('membership-modal');
    if (!modal) {
        console.log('Модальне вікно абонементів не знайдено');
        return;
    }
    
    const openButtons = document.querySelectorAll('.open-membership-form');
    const closeButton = modal.querySelector('.close-modal');
    const membershipForm = document.getElementById('membership-form');
    const confirmationMessage = document.getElementById('confirmation-message');

    console.log('Знайдено кнопок абонементів:', openButtons.length);

    // Відкриття модального вікна
    openButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Кнопка абонементу натиснута');
            const plan = this.getAttribute('data-plan');
            const price = this.getAttribute('data-price');
            
            // Оновлюємо інформація про обраний план
            const selectedPlan = document.getElementById('selected-plan');
            const selectedPrice = document.getElementById('selected-price');
            
            if (selectedPlan) selectedPlan.textContent = plan;
            if (selectedPrice) selectedPrice.textContent = `${price} грн`;
            
            // Показуємо модальне вікно
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Скидаємо форму та ховаємо повідомлення про підтвердження
            if (membershipForm) {
                membershipForm.reset();
                membershipForm.style.display = 'block';
            }
            if (confirmationMessage) {
                confirmationMessage.style.display = 'none';
            }
        });
    });
    
    // Закриття модального вікна
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Закриття при кліку поза модального вікна
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Обробка відправки форми
    if (membershipForm) {
        membershipForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Отримуємо дані форми
            const formData = {
                name: document.getElementById('member-name')?.value,
                surname: document.getElementById('member-surname')?.value,
                email: document.getElementById('member-email')?.value,
                phone: document.getElementById('member-phone')?.value,
                plan: document.getElementById('selected-plan')?.textContent,
                price: document.getElementById('selected-price')?.textContent
            };
            
            // Перевірка заповнення полів
            if (!formData.name || !formData.surname || !formData.email || !formData.phone) {
                alert('Будь ласка, заповніть всі обов\'язкові поля.');
                return;
            }
            
            console.log('Дані реєстрації абонемента:', formData);
            
            // Показуємо повідомлення про підтвердження
            if (membershipForm) membershipForm.style.display = 'none';
            if (confirmationMessage) confirmationMessage.style.display = 'block';
            
            // Автоматичне закриття через 5 секунд
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 5000);
        });
    }
}

console.log('IronCore utilities loaded successfully!');


// Зміна фавіконки через JavaScript
function changeFavicon(newIconUrl) {
    // Знаходимо поточну фавіконку
    const oldFavicon = document.querySelector('link[rel="icon"]');
    
    // Створюємо нову
    const newFavicon = document.createElement('link');
    newFavicon.rel = 'icon';
    newFavicon.href = newIconUrl;
    newFavicon.type = 'image/x-icon';
    
    // Видаляємо стару і додаємо нову
    if (oldFavicon) {
        document.head.removeChild(oldFavicon);
    }
    document.head.appendChild(newFavicon);
}

// Приклад використання
changeFavicon('/new-favicon.ico');
