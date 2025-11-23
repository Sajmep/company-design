document.addEventListener("DOMContentLoaded", () => {
  const helperTrigger = document.querySelector(".plan-helper-trigger");
  const modal = document.querySelector(".plan-guide-modal");
  const closeBtn = document.querySelector(".plan-guide-close");
  const heroBlock = document.querySelector(".plan-guide-hero");
  const startBtn = document.querySelector(".plan-guide-start");
  const steps = Array.from(document.querySelectorAll(".plan-guide-step"));
  const resultsBlock = document.querySelector(".plan-guide-results");

  if (!helperTrigger || !modal) return;

  const hideElement = (element) => element?.classList.add("is-hidden");
  const showElement = (element) => element?.classList.remove("is-hidden");
  const disableButton = (button) => button?.setAttribute("disabled", "true");

  const resetGuide = () => {
    showElement(heroBlock);
    steps.forEach((step) => {
      hideElement(step);
      step.querySelectorAll(".plan-guide-option").forEach((btn) => btn.classList.remove("is-selected"));
      step.querySelectorAll(".plan-guide-next").forEach((btn) => disableButton(btn));
    });
    if (resultsBlock) hideElement(resultsBlock);
  };

  const openModal = () => {
    resetGuide();
    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = () => {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
    resetGuide();
    helperTrigger.focus();
  };

  helperTrigger.addEventListener("click", openModal);
  helperTrigger.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal();
    }
  });

  const showStep = (index) => {
    if (!steps[index]) {
      return;
    }

    hideElement(heroBlock);
    steps.forEach(hideElement);
    showElement(steps[index]);
    steps[index].focus();
  };

  const showResults = () => {
    hideElement(heroBlock);
    steps.forEach(hideElement);
    if (resultsBlock) {
      showElement(resultsBlock);
      resultsBlock.focus();
    }
  };

  startBtn?.addEventListener("click", () => {
    showStep(0);
  });

  startBtn?.addEventListener("keypress", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      showStep(0);
    }
  });

  steps.forEach((step, index) => {
    const options = step.querySelectorAll(".plan-guide-option");
    const nextButton = step.querySelector(".plan-guide-next");

    options.forEach((optionBtn) => {
      optionBtn.addEventListener("click", () => {
        options.forEach((btn) => btn.classList.remove("is-selected"));
        optionBtn.classList.add("is-selected");
        nextButton?.removeAttribute("disabled");
      });
    });

    nextButton?.addEventListener("click", () => {
      const nextIndex = index + 1;
      if (nextIndex < steps.length) {
        showStep(nextIndex);
      } else {
        showResults();
      }
    });
  });

  closeBtn?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-visible")) {
      closeModal();
    }
  });

  const goBackBtn = document.querySelector(".plan-guide-back");
  goBackBtn?.addEventListener("click", () => {
    const lastStepIndex = steps.length - 1;
    showStep(lastStepIndex);
  });
});