"use strict";

const prototypeSliderConfig = {
  autoplayDelay: 3600,
  showDots: true,
  showToggle: true,
  swipeDistance: 58,
  labels: {
    prev: "Назад",
    next: "Вперед",
    pause: "Пауза",
    play: "Відновити",
  },
};

const classSliderConfig = {
  autoplayDelay: 4200,
  showDots: true,
  showToggle: true,
  pauseOnHover: true,
  swipeDistance: 58,
  labels: {
    prev: "Назад",
    next: "Вперед",
    pause: "Пауза",
    play: "Відновити",
  },
};

const mergeSliderConfig = (defaults, config) => ({
  ...defaults,
  ...config,
  labels: {
    ...defaults.labels,
    ...(config.labels || {}),
  },
});

const normalizeIndex = (index, slidesCount) => {
  if (index < 0) {
    return slidesCount - 1;
  }

  if (index >= slidesCount) {
    return 0;
  }

  return index;
};

const setTrackPosition = (track, activeIndex, dragOffsetX = 0) => {
  track.style.transform = `translateX(calc(-${activeIndex * 100}% + ${dragOffsetX}px))`;
};

const createControlButton = (text, className, ariaLabel, action = "") => {
  const button = document.createElement("button");

  button.className = className;
  button.type = "button";
  button.textContent = text;
  button.setAttribute("aria-label", ariaLabel);

  if (action) {
    button.dataset.sliderAction = action;
  }

  return button;
};

const basePrototypeDefaults = {
  autoplayDelay: 4000,
  showDots: true,
  showToggle: true,
  swipeDistance: 56,
  labels: {
    prev: "Назад",
    next: "Вперед",
    pause: "Пауза",
    play: "Відновити",
  },
};

function PrototypeSlider(root, config = {}) {
  this.root = root;
  this.config = mergeSliderConfig(basePrototypeDefaults, config);
  this.viewport = root.querySelector("[data-slider-viewport]");
  this.track = root.querySelector("[data-slider-track]");
  this.counter = root.querySelector("[data-slider-counter]");
  this.slides = Array.from(root.querySelectorAll(".slide"));
  this.activeIndex = 0;
  this.timerId = null;
  this.isPlaying = true;
  this.isDragging = false;
  this.dragStartX = 0;
  this.dragOffsetX = 0;
  this.dots = [];

  this.init();
}

PrototypeSlider.prototype.init = function () {
  if (!this.root || this.slides.length === 0) {
    return;
  }

  this.createControls();
  this.bindEvents();
  this.render();
  this.startAutoPlay();
};

PrototypeSlider.prototype.createControls = function () {
  this.controls = document.createElement("div");
  this.controls.className = "slider__controls";
  this.controls.setAttribute("aria-label", "Керування слайдером на прототипах");

  this.prevButton = createControlButton(
    this.config.labels.prev,
    "slider__button",
    "Попередній слайд у прототипному слайдері",
    "prev"
  );
  this.nextButton = createControlButton(
    this.config.labels.next,
    "slider__button",
    "Наступний слайд у прототипному слайдері",
    "next"
  );

  this.controls.append(this.prevButton, this.nextButton);

  if (this.config.showToggle) {
    this.toggleButton = createControlButton(
      this.config.labels.pause,
      "slider__button slider__button--toggle",
      "Поставити автопрокручування на паузу",
      "toggle"
    );
    this.controls.append(this.toggleButton);
  }

  this.root.append(this.controls);

  if (this.config.showDots) {
    this.createDots();
  }
};

PrototypeSlider.prototype.createDots = function () {
  this.dotsContainer = document.createElement("div");
  this.dotsContainer.className = "slider__dots";
  this.dotsContainer.setAttribute("aria-label", "Індикатори прототипного слайдера");

  this.slides.forEach((_, index) => {
    const dot = createControlButton("", "slider__dot", `Перейти до слайду ${index + 1}`);
    dot.dataset.sliderDot = String(index);
    dot.addEventListener("click", () => {
      this.goTo(index);
      this.restartAutoPlay();
    });
    this.dots.push(dot);
    this.dotsContainer.append(dot);
  });

  this.root.append(this.dotsContainer);
};

PrototypeSlider.prototype.bindEvents = function () {
  this.prevButton.addEventListener("click", () => {
    this.move(-1);
    this.restartAutoPlay();
  });

  this.nextButton.addEventListener("click", () => {
    this.move(1);
    this.restartAutoPlay();
  });

  if (this.toggleButton) {
    this.toggleButton.addEventListener("click", () => {
      this.toggleAutoPlay();
    });
  }
};

PrototypeSlider.prototype.goTo = function (targetIndex) {
  this.activeIndex = normalizeIndex(targetIndex, this.slides.length);
  this.dragOffsetX = 0;
  this.render();
};

PrototypeSlider.prototype.move = function (direction) {
  this.goTo(this.activeIndex + direction);
};

PrototypeSlider.prototype.render = function () {
  setTrackPosition(this.track, this.activeIndex, this.dragOffsetX);
  this.counter.textContent = `Слайд ${this.activeIndex + 1} з ${this.slides.length}`;

  this.slides.forEach((slide, index) => {
    slide.setAttribute("aria-hidden", String(index !== this.activeIndex));
  });

  this.dots.forEach((dot, index) => {
    const isActive = index === this.activeIndex;

    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", isActive ? "true" : "false");
  });

  if (this.toggleButton) {
    this.toggleButton.textContent = this.isPlaying ? this.config.labels.pause : this.config.labels.play;
  }
};

PrototypeSlider.prototype.startAutoPlay = function () {
  this.stopAutoPlay();

  if (!this.isPlaying) {
    return;
  }

  this.timerId = window.setInterval(() => {
    this.move(1);
  }, this.config.autoplayDelay);
};

PrototypeSlider.prototype.stopAutoPlay = function () {
  window.clearInterval(this.timerId);
  this.timerId = null;
};

PrototypeSlider.prototype.restartAutoPlay = function () {
  if (this.isPlaying) {
    this.startAutoPlay();
  }
};

PrototypeSlider.prototype.toggleAutoPlay = function () {
  this.isPlaying = !this.isPlaying;

  if (this.isPlaying) {
    this.startAutoPlay();
  } else {
    this.stopAutoPlay();
  }

  this.render();
};

function DraggablePrototypeSlider(root, config = {}) {
  PrototypeSlider.call(this, root, config);
}

DraggablePrototypeSlider.prototype = Object.create(PrototypeSlider.prototype);
DraggablePrototypeSlider.prototype.constructor = DraggablePrototypeSlider;

DraggablePrototypeSlider.prototype.bindEvents = function () {
  PrototypeSlider.prototype.bindEvents.call(this);

  this.viewport.addEventListener("pointerdown", (event) => {
    this.beginDrag(event);
  });

  this.viewport.addEventListener("pointermove", (event) => {
    this.drag(event);
  });

  this.viewport.addEventListener("pointerup", (event) => {
    this.finishDrag(event);
  });

  this.viewport.addEventListener("pointercancel", (event) => {
    this.finishDrag(event);
  });
};

DraggablePrototypeSlider.prototype.beginDrag = function (event) {
  this.isDragging = true;
  this.dragStartX = event.clientX;
  this.dragOffsetX = 0;
  this.track.classList.add("is-dragging");

  if (this.viewport.setPointerCapture) {
    this.viewport.setPointerCapture(event.pointerId);
  }
};

DraggablePrototypeSlider.prototype.drag = function (event) {
  if (!this.isDragging) {
    return;
  }

  this.dragOffsetX = event.clientX - this.dragStartX;
  setTrackPosition(this.track, this.activeIndex, this.dragOffsetX);
};

DraggablePrototypeSlider.prototype.finishDrag = function (event) {
  if (!this.isDragging) {
    return;
  }

  const shouldMove = Math.abs(this.dragOffsetX) >= this.config.swipeDistance;
  const direction = this.dragOffsetX < 0 ? 1 : -1;

  this.isDragging = false;
  this.track.classList.remove("is-dragging");

  if (
    this.viewport.releasePointerCapture &&
    (!this.viewport.hasPointerCapture || this.viewport.hasPointerCapture(event.pointerId))
  ) {
    this.viewport.releasePointerCapture(event.pointerId);
  }

  if (shouldMove) {
    this.move(direction);
  } else {
    this.dragOffsetX = 0;
    this.render();
  }

  this.restartAutoPlay();
};

class BaseClassSlider {
  constructor(root, config = {}) {
    this.defaults = {
      autoplayDelay: 4000,
      showDots: true,
      showToggle: true,
      pauseOnHover: false,
      swipeDistance: 56,
      labels: {
        prev: "Назад",
        next: "Вперед",
        pause: "Пауза",
        play: "Відновити",
      },
    };
    this.root = root;
    this.config = mergeSliderConfig(this.defaults, config);
    this.viewport = root.querySelector("[data-slider-viewport]");
    this.track = root.querySelector("[data-slider-track]");
    this.counter = root.querySelector("[data-slider-counter]");
    this.slides = Array.from(root.querySelectorAll(".slide"));
    this.activeIndex = 0;
    this.timerId = null;
    this.isPlaying = true;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragOffsetX = 0;
    this.dots = [];
  }

  init() {
    if (!this.root || this.slides.length === 0) {
      return;
    }

    this.createControls();
    this.bindEvents();
    this.render();
    this.startAutoPlay();
  }

  createControls() {
    this.controls = document.createElement("div");
    this.controls.className = "slider__controls";
    this.controls.setAttribute("aria-label", "Керування слайдером на класах");

    this.prevButton = createControlButton(
      this.config.labels.prev,
      "slider__button",
      "Попередній слайд у класовому слайдері",
      "prev"
    );
    this.nextButton = createControlButton(
      this.config.labels.next,
      "slider__button",
      "Наступний слайд у класовому слайдері",
      "next"
    );

    this.controls.append(this.prevButton, this.nextButton);

    if (this.config.showToggle) {
      this.toggleButton = createControlButton(
        this.config.labels.pause,
        "slider__button slider__button--toggle",
        "Поставити автопрокручування на паузу",
        "toggle"
      );
      this.controls.append(this.toggleButton);
    }

    this.root.append(this.controls);

    if (this.config.showDots) {
      this.createDots();
    }
  }

  createDots() {
    this.dotsContainer = document.createElement("div");
    this.dotsContainer.className = "slider__dots";
    this.dotsContainer.setAttribute("aria-label", "Індикатори класового слайдера");

    this.slides.forEach((_, index) => {
      const dot = createControlButton("", "slider__dot", `Перейти до слайду ${index + 1}`);
      dot.dataset.sliderDot = String(index);
      dot.addEventListener("click", () => {
        this.goTo(index);
        this.restartAutoPlay();
      });
      this.dots.push(dot);
      this.dotsContainer.append(dot);
    });

    this.root.append(this.dotsContainer);
  }

  bindEvents() {
    this.prevButton.addEventListener("click", () => {
      this.move(-1);
      this.restartAutoPlay();
    });

    this.nextButton.addEventListener("click", () => {
      this.move(1);
      this.restartAutoPlay();
    });

    if (this.toggleButton) {
      this.toggleButton.addEventListener("click", () => {
        this.toggleAutoPlay();
      });
    }

    this.viewport.addEventListener("pointerdown", (event) => {
      this.beginDrag(event);
    });

    this.viewport.addEventListener("pointermove", (event) => {
      this.drag(event);
    });

    this.viewport.addEventListener("pointerup", (event) => {
      this.finishDrag(event);
    });

    this.viewport.addEventListener("pointercancel", (event) => {
      this.finishDrag(event);
    });
  }

  goTo(targetIndex) {
    this.activeIndex = normalizeIndex(targetIndex, this.slides.length);
    this.dragOffsetX = 0;
    this.render();
  }

  move(direction) {
    this.goTo(this.activeIndex + direction);
  }

  render() {
    setTrackPosition(this.track, this.activeIndex, this.dragOffsetX);
    this.counter.textContent = `Слайд ${this.activeIndex + 1} з ${this.slides.length}`;

    this.slides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", String(index !== this.activeIndex));
    });

    this.dots.forEach((dot, index) => {
      const isActive = index === this.activeIndex;

      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });

    if (this.toggleButton) {
      this.toggleButton.textContent = this.isPlaying ? this.config.labels.pause : this.config.labels.play;
    }
  }

  startAutoPlay() {
    this.stopAutoPlay();

    if (!this.isPlaying) {
      return;
    }

    this.timerId = window.setInterval(() => {
      this.move(1);
    }, this.config.autoplayDelay);
  }

  stopAutoPlay() {
    window.clearInterval(this.timerId);
    this.timerId = null;
  }

  restartAutoPlay() {
    if (this.isPlaying) {
      this.startAutoPlay();
    }
  }

  toggleAutoPlay() {
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }

    this.render();
  }

  beginDrag(event) {
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragOffsetX = 0;
    this.track.classList.add("is-dragging");

    if (this.viewport.setPointerCapture) {
      this.viewport.setPointerCapture(event.pointerId);
    }
  }

  drag(event) {
    if (!this.isDragging) {
      return;
    }

    this.dragOffsetX = event.clientX - this.dragStartX;
    setTrackPosition(this.track, this.activeIndex, this.dragOffsetX);
  }

  finishDrag(event) {
    if (!this.isDragging) {
      return;
    }

    const shouldMove = Math.abs(this.dragOffsetX) >= this.config.swipeDistance;
    const direction = this.dragOffsetX < 0 ? 1 : -1;

    this.isDragging = false;
    this.track.classList.remove("is-dragging");

    if (
      this.viewport.releasePointerCapture &&
      (!this.viewport.hasPointerCapture || this.viewport.hasPointerCapture(event.pointerId))
    ) {
      this.viewport.releasePointerCapture(event.pointerId);
    }

    if (shouldMove) {
      this.move(direction);
    } else {
      this.dragOffsetX = 0;
      this.render();
    }

    this.restartAutoPlay();
  }
}

class HoverPauseClassSlider extends BaseClassSlider {
  bindEvents() {
    super.bindEvents();

    if (!this.config.pauseOnHover) {
      return;
    }

    this.root.addEventListener("mouseenter", () => {
      this.stopAutoPlay();
    });

    this.root.addEventListener("mouseleave", () => {
      this.restartAutoPlay();
    });
  }
}

const initHomeworkSliders = () => {
  const prototypeRoot = document.querySelector("[data-prototype-slider]");
  const classRoot = document.querySelector("[data-class-slider]");

  if (prototypeRoot) {
    new DraggablePrototypeSlider(prototypeRoot, prototypeSliderConfig);
  }

  if (classRoot) {
    const classSlider = new HoverPauseClassSlider(classRoot, classSliderConfig);
    classSlider.init();
  }
};

initHomeworkSliders();
