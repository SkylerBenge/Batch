if (!window.isQuickAddModal) {

  function pauseGalleryMedia() {
    var mediaElements = document.querySelectorAll('.product-video-not-autoplay video');
      mediaElements.forEach(function(media) {
        media.pause();
    });
    document.querySelectorAll('.product-media-external-media').forEach((videoContainer) => {
      const iframe = videoContainer.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        const message = JSON.stringify({
          event: "command",
          func: "pauseVideo",
          args: ""
        });
        iframe.contentWindow.postMessage(message, '*');
      }
    });
    document.querySelectorAll('.external-media-iframe-container').forEach((videoContainer) => {
      const iframe = videoContainer.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        const message = JSON.stringify({
          event: "command",
          func: "pauseVideo",
          args: ""
        });
        iframe.contentWindow.postMessage(message, '*');
      }
    });
    document.querySelectorAll('.external-media-vimeo-iframe-container').forEach((videoContainer) => {
      const iframe = videoContainer.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"method":"pause"}', '*');
      }
    });
  }
  
  function changeSlide(thumbnail, index) {
    const thumbnails = document.querySelectorAll('.gallery-slider--thumbnail');
    const slidesContainer = document.getElementById('SlidesCon');
    const slides = document.getElementsByClassName('product-media-image');
    
    if (slidesContainer) {
      // Adjusting the index to handle slide boundaries
      if (index > slides.length) {
        index = 1;
      }
      if (index < 1) {
        index = slides.length;
      }
    
      thumbnails.forEach(item => {
        item.classList.remove('active');
      });
      
      thumbnail.classList.add('active');
      pauseGalleryMedia();
      
      const slideWidth = slidesContainer.offsetWidth;
      slidesContainer.scrollLeft = (index - 1) * slideWidth;
      //slidesContainer.scrollTo({
      //  left:  (index - 1) * slideWidth,
      //  behavior: 'smooth'
      //});    
    }
  }
  
  function handleScroll() {
    const slidesContainer = document.getElementById('SlidesCon');
    const slideWidth = slidesContainer.offsetWidth;
    const scrollPosition = slidesContainer.scrollLeft;
    const thumbnails = document.getElementsByClassName("gallery-slider--thumbnail");
  
    if (slidesContainer) {
      // Calculate the index based on the scroll position
      const index = Math.round(scrollPosition / slideWidth) + 1;
  
      pauseGalleryMedia();
    
      for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].classList.remove("active");
    
        // Check if the thumbnail's data-slide-index matches the provided slideIndex
        if (thumbnails[i].getAttribute('data-slide-index') == index) {
            thumbnails[i].classList.add("active");
        }
      }    
    }  
  }
  
  // Add scroll event listener to slidesContainer
  const slidesContainer = document.getElementById('SlidesCon');
  if (slidesContainer) {
    slidesContainer.addEventListener('scroll', function() {
      handleScroll(); // Call handleScroll function
    });
  }
  
  // Initially trigger handleScroll to set the active state based on the initial scroll position
  handleScroll();
  
  
  // Slider Arrows
  function sliderArrows() {
    const leftArrow = document.querySelector('.gallery-slider-arrows .slider-arrow-left');
    const rightArrow = document.querySelector('.gallery-slider-arrows .slider-arrow-right');
    const dtslidesContainer = document.getElementById('SlidesCon');
  
    // Check if the arrows and container are present
    if (!leftArrow || !rightArrow || !dtslidesContainer) {
      return; // Exit the function if elements are not present
    }
  
    // Function to calculate the slide width
    let slideWidth = Math.round(dtslidesContainer.offsetWidth);
  
    // Update slide width on window resize
    window.addEventListener('resize', () => {
      slideWidth = Math.round(dtslidesContainer.offsetWidth);
    });
  
    function updateArrowStates() {
      if (dtslidesContainer.scrollLeft <= 0) {
        leftArrow.classList.add('deactive');
      } else {
        leftArrow.classList.remove('deactive');
      }
  
      if (dtslidesContainer.scrollLeft + dtslidesContainer.clientWidth >= dtslidesContainer.scrollWidth) {
        rightArrow.classList.add('deactive');
      } else {
        rightArrow.classList.remove('deactive');
      }
    }
  
    leftArrow.addEventListener('click', () => {
      dtslidesContainer.scrollBy({
        left: -slideWidth,
        behavior: 'smooth'
      });
      pauseGalleryMedia();
      setTimeout(updateArrowStates, 500); // Slight delay to ensure scroll completes
    });
  
    rightArrow.addEventListener('click', () => {
      dtslidesContainer.scrollBy({
        left: slideWidth,
        behavior: 'smooth'
      });
      pauseGalleryMedia();
      setTimeout(updateArrowStates, 500); // Slight delay to ensure scroll completes
    });
  
    // Initial check to set the faded state when the page loads
    dtslidesContainer.addEventListener('scroll', updateArrowStates);
    updateArrowStates();
  }
  
  document.addEventListener('DOMContentLoaded', sliderArrows);
  
  
  // Modal Opening and Closing
  function openModal() {
    document.getElementById("galModal").classList.add("open");
    document.body.classList.add('body-lock-scroll');
    setModalZoomToggle();
  }

  function closeModal() {
      document.getElementById("galModal").classList.remove("open");
      document.body.classList.remove('body-lock-scroll');
      
      // Add a short delay before resetting the zoom level
      setTimeout(() => {
          removeZoomLevel();
      }, 500);
  }
  
  function currentSlide(n) {
      showSlides(slideIndex = n);
      setActiveThumbnail(n);
  }
  
  function showSlides(n) {
      var i;
      var slides = document.getElementsByClassName("galSlides");
  
      if (n > slides.length) {
          slideIndex = 1;
      }
      if (n < 1) {
          slideIndex = slides.length;
      }
  
      for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
      }
  
      slides[slideIndex - 1].style.display = "block";
  }
  
  
  function setActiveThumbnail(slideIndex) {
      var thumbnails = document.getElementsByClassName("lightbox-thumbnail");
  
      for (var i = 0; i < thumbnails.length; i++) {
          thumbnails[i].classList.remove("lightbox-thumbnail-active");
  
          // Check if the thumbnail's data-slide-index matches the provided slideIndex
          if (thumbnails[i].getAttribute('data-slide-index') == slideIndex) {
              thumbnails[i].classList.add("lightbox-thumbnail-active");
          }
      }
  }


  // Thumbnails scroller
  function thumbnailsScroll() {
      const scroller = document.querySelector('.gst-scroller');
      const scrollBackButton = document.querySelector('.gst-scroll-arrow-backwards');
      const scrollForwardButton = document.querySelector('.gst-scroll-arrow-forwards');
  
      if (!scroller || !scrollBackButton || !scrollForwardButton) return;
  
      const scrollIncrement = 350;
  
      scrollBackButton.addEventListener('click', () => {
          scroller.scrollBy({
              top: -scrollIncrement,
              behavior: 'smooth'
          });
      });
  
      scrollForwardButton.addEventListener('click', () => {
          scroller.scrollBy({
              top: scrollIncrement,
              behavior: 'smooth'
          });
      });
  }

  // Initialize the function
  thumbnailsScroll();
  
  // Thumbnails scroller within modal
  function modalThumbnailsScroll() {
      const modalscroller = document.querySelector('.modal-thumbs-track-scroller');
      const modalscrollBackButton = document.querySelector('.modal-thumbs-scroll-arrow-backwards');
      const modalscrollForwardButton = document.querySelector('.modal-thumbs-scroll-arrow-forwards');
  
      if (!modalscroller || !modalscrollBackButton || !modalscrollForwardButton) return;
  
      const scrollIncrement = 400;

      // Function to update arrow button states
      function updateArrowStates() {
          if (modalscroller.scrollTop === 0) {
              modalscrollBackButton.classList.add('modal-thumb-scroll-arrow-deactive');
          } else {
              modalscrollBackButton.classList.remove('modal-thumb-scroll-arrow-deactive');
          }
  
          if (modalscroller.scrollTop + modalscroller.clientHeight >= modalscroller.scrollHeight) {
              modalscrollForwardButton.classList.add('modal-thumb-scroll-arrow-deactive');
          } else {
              modalscrollForwardButton.classList.remove('modal-thumb-scroll-arrow-deactive');
          }
      }
  
      // Initial state update
      updateArrowStates();
  
      // Scroll event listener
      modalscroller.addEventListener('scroll', updateArrowStates);    
    
      modalscrollBackButton.addEventListener('click', () => {
          modalscroller.scrollBy({
              top: -scrollIncrement,
              behavior: 'smooth'
          });
      });
  
      modalscrollForwardButton.addEventListener('click', () => {
          modalscroller.scrollBy({
              top: scrollIncrement,
              behavior: 'smooth'
          });
      });
  }
  
  // Initialize the function
  modalThumbnailsScroll();

  // Function to reset zoom level on selection of thumbnail within the modal
  function resetZoomLevel() {
      const modalZoomed = document.querySelector('.modal-zoomed');
  
      if (!modalZoomed || !modalZoomed.classList.contains('modal-zoom-toggle')) {
          return false;
      }
  
      modalZoomed.classList.remove('gallery-mega-zoom');
  }

  // Zoom toggle function remove
  function removeZoomLevel() {
      const zoomedElement = document.querySelector('.modal-zoom-toggle');
      if (zoomedElement && zoomedElement.classList.contains('gallery-mega-zoom')) {
          zoomedElement.classList.remove('gallery-mega-zoom');
      }
  }
  
  function changeModalSlide(thumb, index) {
      const thumbs = document.querySelectorAll('.lightbox-thumbnail');
      const slidesContainer = document.getElementById('modalSlidesContainer');
      const slides = document.getElementsByClassName('galSlides');
  
      // Adjusting the index to handle slide boundaries
      if (index > slides.length) {
          index = 1;
      }
      if (index < 1) {
          index = slides.length;
      }
  
      thumbs.forEach(item => {
          item.classList.remove('lightbox-thumbnail-active');
      });
  
      thumb.classList.add('lightbox-thumbnail-active');
      
      pauseGalleryMedia();
      resetZoomLevel();
      setImageToTop();
  
      // Set all slides to display: none
      for (let i = 0; i < slides.length; i++) {
          slides[i].style.display = 'none';
      }
  
      // Set the current slide to display: block
      slides[index - 1].style.display = 'block';
  }


  // Toggle zoom function
  function toggleZoom(event) {
      const parentModal = event.target.closest('.modal-zoom-toggle');
      if (parentModal) {
          parentModal.classList.toggle('gallery-mega-zoom');
      }
  }
  
  // Zoom toggle function
  function setModalZoomToggle() {
    const productMediaImages = document.querySelectorAll('.modal-zoom-toggle .modal-content .product-media--image');

    productMediaImages.forEach(image => {
        // Ensure no duplicate listeners
        image.removeEventListener('click', toggleZoom);
        image.addEventListener('click', toggleZoom);
    });
  }

  // Reset image position to top on thumbnail select
  function setImageToTop(event) {
      const parentModal = document.querySelector('.modal-zoom-no-toggle');
      if (parentModal) {
          const modalContent = parentModal.querySelector('.modal-content');
          if (modalContent) {
              modalContent.scrollTop = 0; // Sets the scroll position of modal-content to the top
          }
      }
  }
  
}
