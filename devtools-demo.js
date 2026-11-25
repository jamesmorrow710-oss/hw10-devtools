'use strict';

document.querySelector('#log-pets').addEventListener('click', function () {
  console.info('Pet roster: %d active', pets.length);
  console.warn('Pet reminder: check happiness after exercise');
  console.error('Pet preview: sample image validation failed');
  console.table(pets.map(function (pet) {
    return {name: pet.name, weight: pet.weight, happiness: pet.happiness};
  }));
  console.group('Pet image choices');
  petImages.forEach(function (image) {
    console.log(image.name, image.src);
  });
  console.groupEnd();
  console.log('%cPet diagnostics complete', 'color: white; background: #215646; padding: 3px 8px; font-weight: bold');
});

document.querySelector('#missing-image').addEventListener('click', function () {
  const image = new Image();
  image.src = 'images/devtools-missing-pet.png';
});

document.querySelector('#pet-type-error').addEventListener('click', function () {
  const missingCard = document.querySelector('.pet-card[data-pet-id="missing"]');
  missingCard.querySelector('h2');
});

document.querySelector('#slow-handler').addEventListener('click', function () {
  // Keep this intentional main-thread stall behind a button.
  const deadline = performance.now() + 350;
  while (performance.now() < deadline) {
    // Wait until Chrome reports the long click handler.
  }
});
