"use strict";

const AUTO_PLAY_DELAY = 4200;
const SWIPE_DISTANCE = 56;

const createSliderState = () => ({
  activeIndex: 0,
  isPlaying: true,
  timerId: null,
  isDragging: false,
  dragStartX: 0,
  dragOffsetX: 0,
});

const getSliderElements = () => {
  const slider = document.querySelector("[data-slider]");

  if (!slider) {
    return null;
  }

  return {
    root: slider,
    viewport: slider.querySelector("[data-slider-viewport]"),
    track: slider.querySelector("[data-slider-track]"),
    slides: Array.from(slider.querySelectorAll("[data-slide]")),
    prevButton: slider.querySelector("[data-slider-prev]"),
    nextButton: slider.querySelector("[data-slider-next]"),
    toggleButton: slider.querySelector("[data-slider-toggle]"),
    counter: slider.querySelector("[data-slider-counter]"),
    dots: slider.querySelector("[data-slider-dots]"),
  };
};

const normalizeIndex = (index, slidesCount) => {
  if (index < 0) {
    return slidesCount - 1;
  }

  if (index >= slidesCount) {
    return 0;
  }

  return index;
};

const getNextIndex = (currentIndex, direction, slidesCount) => {
  return normalizeIndex(currentIndex + direction, slidesCount);
};

const setTrackPosition = (track, activeIndex, dragOffsetX = 0) => {
  track.style.transform = `translateX(calc(-${activeIndex * 100}% + ${dragOffsetX}px))`;
};

const updateCounter = (counter, activeIndex, slidesCount) => {
  counter.textContent = `Слайд ${activeIndex + 1} з ${slidesCount}`;
};

const updateDots = (dots, activeIndex) => {
  dots.forEach((dot, index) => {
    const isActive = index === activeIndex;

    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", isActive ? "true" : "false");
  });
};

const updateSlideAria = (slides, activeIndex) => {
  slides.forEach((slide, index) => {
    slide.setAttribute("aria-hidden", String(index !== activeIndex));
  });
};

const renderSlider = (elements, state) => {
  setTrackPosition(elements.track, state.activeIndex, state.dragOffsetX);
  updateCounter(elements.counter, state.activeIndex, elements.slides.length);
  updateDots(Array.from(elements.dots.children), state.activeIndex);
  updateSlideAria(elements.slides, state.activeIndex);
  elements.toggleButton.textContent = state.isPlaying ? "Пауза" : "Відновити";
  elements.toggleButton.setAttribute(
    "aria-label",
    state.isPlaying ? "Поставити автопрокручування на паузу" : "Відновити автопрокручування"
  );
};

const goToSlide = (elements, state, targetIndex) => {
  state.activeIndex = normalizeIndex(targetIndex, elements.slides.length);
  state.dragOffsetX = 0;
  renderSlider(elements, state);
};

const moveSlide = (elements, state, direction) => {
  goToSlide(elements, state, getNextIndex(state.activeIndex, direction, elements.slides.length));
};

const stopAutoPlay = (state) => {
  window.clearInterval(state.timerId);
  state.timerId = null;
};

const startAutoPlay = (elements, state) => {
  stopAutoPlay(state);

  if (!state.isPlaying) {
    return;
  }

  state.timerId = window.setInterval(() => {
    moveSlide(elements, state, 1);
  }, AUTO_PLAY_DELAY);
};

const restartAutoPlay = (elements, state) => {
  if (state.isPlaying) {
    startAutoPlay(elements, state);
  }
};

const createDot = (index, onClick) => {
  const dot = document.createElement("button");

  dot.className = "slider__dot";
  dot.type = "button";
  dot.setAttribute("aria-label", `Перейти до слайду ${index + 1}`);
  dot.addEventListener("click", () => onClick(index));

  return dot;
};

const createDots = (elements, state) => {
  const fragment = document.createDocumentFragment();

  elements.slides.forEach((_, index) => {
    fragment.append(
      createDot(index, (targetIndex) => {
        goToSlide(elements, state, targetIndex);
        restartAutoPlay(elements, state);
      })
    );
  });

  elements.dots.append(fragment);
};

const toggleAutoPlay = (elements, state) => {
  state.isPlaying = !state.isPlaying;

  if (state.isPlaying) {
    startAutoPlay(elements, state);
  } else {
    stopAutoPlay(state);
  }

  renderSlider(elements, state);
};

const handleKeyboard = (elements, state, event) => {
  if (event.key === "ArrowLeft") {
    moveSlide(elements, state, -1);
    restartAutoPlay(elements, state);
  }

  if (event.key === "ArrowRight") {
    moveSlide(elements, state, 1);
    restartAutoPlay(elements, state);
  }
};

const beginDrag = (elements, state, event) => {
  state.isDragging = true;
  state.dragStartX = event.clientX;
  state.dragOffsetX = 0;
  elements.track.classList.add("is-dragging");
  elements.viewport.setPointerCapture(event.pointerId);
};

const dragSlide = (elements, state, event) => {
  if (!state.isDragging) {
    return;
  }

  state.dragOffsetX = event.clientX - state.dragStartX;
  setTrackPosition(elements.track, state.activeIndex, state.dragOffsetX);
};

const finishDrag = (elements, state, event) => {
  if (!state.isDragging) {
    return;
  }

  const shouldMove = Math.abs(state.dragOffsetX) >= SWIPE_DISTANCE;
  const direction = state.dragOffsetX < 0 ? 1 : -1;

  state.isDragging = false;
  elements.track.classList.remove("is-dragging");
  elements.viewport.releasePointerCapture(event.pointerId);

  if (shouldMove) {
    moveSlide(elements, state, direction);
  } else {
    state.dragOffsetX = 0;
    renderSlider(elements, state);
  }

  restartAutoPlay(elements, state);
};

const bindSliderEvents = (elements, state) => {
  elements.prevButton.addEventListener("click", () => {
    moveSlide(elements, state, -1);
    restartAutoPlay(elements, state);
  });

  elements.nextButton.addEventListener("click", () => {
    moveSlide(elements, state, 1);
    restartAutoPlay(elements, state);
  });

  elements.toggleButton.addEventListener("click", () => {
    toggleAutoPlay(elements, state);
  });

  document.addEventListener("keydown", (event) => {
    handleKeyboard(elements, state, event);
  });

  elements.viewport.addEventListener("pointerdown", (event) => {
    beginDrag(elements, state, event);
  });

  elements.viewport.addEventListener("pointermove", (event) => {
    dragSlide(elements, state, event);
  });

  elements.viewport.addEventListener("pointerup", (event) => {
    finishDrag(elements, state, event);
  });

  elements.viewport.addEventListener("pointercancel", (event) => {
    finishDrag(elements, state, event);
  });
};

const initSlider = () => {
  const elements = getSliderElements();

  if (!elements || elements.slides.length === 0) {
    return;
  }

  const state = createSliderState();

  createDots(elements, state);
  bindSliderEvents(elements, state);
  renderSlider(elements, state);
  startAutoPlay(elements, state);
};

initSlider();
