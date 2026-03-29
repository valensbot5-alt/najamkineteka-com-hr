(function () {
 'use strict';
 document.addEventListener('DOMContentLoaded', function () {
 var header = document.querySelector('.header');
 var burger = document.querySelector('.burger');
 var nav = document.querySelector('.nav');
 var backToTopBtn = null;

 if (burger && nav) {
  burger.addEventListener('click', function () {
   var isOpen = nav.classList.toggle('open');
   document.body.classList.toggle('nav-open', isOpen);
   burger.setAttribute('aria-expanded', String(isOpen));
   var spans = burger.querySelectorAll('span');
   if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
   } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
   }
  });
  nav.querySelectorAll('a').forEach(function (link) {
   link.addEventListener('click', function () {
    nav.classList.remove('open');
    document.body.classList.remove('nav-open');
    burger.setAttribute('aria-expanded', 'false');
    var spans = burger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
   });
  });
  document.addEventListener('click', function (e) {
   if (nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) {
    nav.classList.remove('open');
    document.body.classList.remove('nav-open');
    burger.setAttribute('aria-expanded', 'false');
    var spans = burger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
   }
  });
 }

 function handleHeaderScroll() {
  if (!header) return;
  if (window.scrollY > 10) {
   header.classList.add('header-scrolled');
  } else {
   header.classList.remove('header-scrolled');
  }
 }

 function createBackToTop() {
  backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', 'Natrag na vrh');
  backToTopBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3L3 12h5v5h4v-5h5L10 3z" fill="currentColor"/></svg>';
  document.body.appendChild(backToTopBtn);
  backToTopBtn.addEventListener('click', function () {
   window.scrollTo({ top: 0, behavior: 'smooth' });
  });
 }

 function handleBackToTop() {
  if (!backToTopBtn) return;
  if (window.scrollY > 400) {
   backToTopBtn.classList.add('visible');
  } else {
   backToTopBtn.classList.remove('visible');
  }
 }

 createBackToTop();

 var ticking = false;
 window.addEventListener('scroll', function () {
  if (!ticking) {
   window.requestAnimationFrame(function () {
    handleHeaderScroll();
    handleBackToTop();
    ticking = false;
   });
   ticking = true;
  }
 }, { passive: true });

 handleHeaderScroll();
 handleBackToTop();

 var faqItems = document.querySelectorAll('.faq-item');
 faqItems.forEach(function (item) {
  var question = item.querySelector('.faq-question');
  if (!question) return;
  question.addEventListener('click', function () {
   var isActive = item.classList.contains('active');
   faqItems.forEach(function (other) {
    other.classList.remove('active');
    var otherAnswer = other.querySelector('.faq-answer');
    if (otherAnswer) otherAnswer.style.maxHeight = null;
   });
   if (!isActive) {
    item.classList.add('active');
    var answer = item.querySelector('.faq-answer');
    if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
   }
  });
 });

 document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
   var targetId = this.getAttribute('href');
   if (targetId === '#' || targetId === '') return;
   var target = document.querySelector(targetId);
   if (!target) return;
   e.preventDefault();
   var headerHeight = header ? header.offsetHeight : 0;
   var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
   window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  });
 });

 var reveals = document.querySelectorAll('.reveal');
 if (reveals.length > 0) {
  var revealObserver = new IntersectionObserver(function (entries) {
   entries.forEach(function (entry) {
    if (entry.isIntersecting) {
     entry.target.classList.add('visible');
     revealObserver.unobserve(entry.target);
    }
   });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(function (el) { revealObserver.observe(el); });
 }

 var counters = document.querySelectorAll('[data-count]');
 if (counters.length > 0) {
  var counterObserver = new IntersectionObserver(function (entries) {
   entries.forEach(function (entry) {
    if (entry.isIntersecting) {
     var el = entry.target;
     var target = parseInt(el.getAttribute('data-count'), 10);
     var suffix = el.getAttribute('data-suffix') || '';
     var prefix = el.getAttribute('data-prefix') || '';
     var duration = 1500;
     var startTime = null;
     function animate(time) {
      if (!startTime) startTime = time;
      var progress = Math.min((time - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
       requestAnimationFrame(animate);
      } else {
       el.textContent = prefix + target + suffix;
      }
     }
     requestAnimationFrame(animate);
     counterObserver.unobserve(el);
    }
   });
  }, { threshold: 0.5 });
  counters.forEach(function (el) { counterObserver.observe(el); });
 }
 });
})();