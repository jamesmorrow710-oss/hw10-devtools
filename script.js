var nextPetId = 1;
var petImages = [
  {name: 'Hound', src: 'images/hound.jpg'},
  {name: 'Bear', src: 'images/BEAR.jpeg'},
  {name: 'Mr. Man', src: 'images/MRMAN.jpeg'},
  {name: 'Little Miss', src: 'images/LITTLEMISS.JPG'}
];
var pets = [createNewPet('Houndour')];

$(function() {
  petImages.forEach(function(image) {
    $('<option>', {value: image.src}).text(image.name).appendTo('.new-pet-image');
  });
  renderPets();
  // Here I used .on() to attach a click event listener to the .pets-container element, and specified the .pet-action selector as the second argument. This allows me to handle clicks on dynamically added pet action buttons, even if they are not present in the DOM when the page first loads.
  $('.pets-container').on('click', '.pet-action', handlePetAction);
  $('.new-pet-button').click(clickedNewPetButton);
  $('.new-pet-form').submit(submitNewPetForm);
  $('.new-pet-name').on('input', function() {
    this.setCustomValidity('');
  });
  $('.cancel-new-pet').click(function() {
    $('.new-pet-dialog')[0].close();
  });
});

function clickedNewPetButton() {
  var newPetDialog = $('.new-pet-dialog')[0];
  $('.new-pet-name').val('');
  $('.new-pet-image').val(petImages[0].src);
  newPetDialog.showModal();
  $('.new-pet-name').trigger('focus');
}

function submitNewPetForm(event) {
  event.preventDefault();
  var nameInput = $('.new-pet-name')[0];
  var newPetName = nameInput.value.trim();
  nameInput.setCustomValidity(newPetName ? '' : 'Please enter a pet name.');
  if (!newPetName) {
    nameInput.reportValidity();
    return;
  }

  var newPet = createNewPet(newPetName, $('.new-pet-image').val());
  pets.push(newPet);
  renderPet(newPet);
  $('.message').text(newPet.name + ' joined your pets!');
  $('.new-pet-dialog')[0].close();
}

function createNewPet(name, image) {
  return {id: nextPetId++, name: name, image: image || petImages[0].src, weight: 10, happiness: 5};
}

function handlePetAction() {
  // Here I used the closest() method to find the nearest ancestor element with the class 'pet-card' and then retrieved the data-pet-id attribute from that element. This allows me to identify which pet the action is being performed on.
  var petId = Number($(this).closest('.pet-card').attr('data-pet-id'));
  var pet = pets.find(function(candidate) {
    return candidate.id === petId;
  });
  var action = $(this).attr('data-action');

  if (action === 'treat') {
    pet.happiness += 1;
    pet.weight += 1;
    $('.message').text('You gave ' + pet.name + ' a treat! Happiness and weight increased by 1.');
  } else if (action === 'play') {
    pet.happiness += 1;
    pet.weight -= 1;
    $('.message').text('You played with ' + pet.name + '! Happiness increased and weight decreased by 1.');
  } else if (action === 'exercise') {
    var happinessChanged = pet.happiness > 0;
    var weightChanged = pet.weight > 0;
    pet.happiness = Math.max(0, pet.happiness - 1);
    pet.weight = Math.max(0, pet.weight - 1);
    var happinessMessage = happinessChanged ? 'Happiness decreased by 1.' : 'Happiness stayed at 0.';
    var weightMessage = weightChanged ? 'Weight decreased by 1.' : 'Weight stayed at 0.';
    $('.message').text('You exercised with ' + pet.name + '! ' + happinessMessage + ' ' + weightMessage);
  }

  checkPetValues(pet);
  renderPet(pet);
}

function checkPetValues(pet) {
  if (pet.weight < 0) {
    pet.weight = 0;
  }
  if (pet.happiness < 0) {
    pet.happiness = 0;
  }
}

function renderPets() {
  $('.pets-container').empty();
  pets.forEach(renderPet);
}

function renderPet(pet) {
  var $card = $('<article>', {class: 'pet-card'}).attr('data-pet-id', pet.id);
  var $dashboard = $('<div>', {class: 'dashboard'});
  var $buttons = $('<div>', {class: 'button-container'});

  $('<img>', {class: 'pet-image', src: pet.image, alt: pet.name}).appendTo($card);
  $('<h2>').text(pet.name).appendTo($dashboard);
  $('<p>').append('Weight: ', $('<strong>').text(pet.weight + ' pounds')).appendTo($dashboard);
  $('<p>').append('Happiness: ', $('<strong>').text(pet.happiness + ' tail wags (per min)')).appendTo($dashboard);
  addPetActionButton($buttons, pet, 'treat', 'Treat');
  addPetActionButton($buttons, pet, 'play', 'Play');
  addPetActionButton($buttons, pet, 'exercise', 'Exercise');
  $dashboard.append($buttons);
  $card.append($dashboard);

  var existingCard = $('.pets-container .pet-card[data-pet-id="' + pet.id + '"]');
  if (existingCard.length) {
    existingCard.replaceWith($card);
  } else {
    $('.pets-container').append($card);
  }
}

function addPetActionButton($container, pet, action, label) {
  $('<button>', {
    type: 'button',
    class: 'pet-action ' + action + '-button',
    'data-action': action,
    'aria-label': label + ' ' + pet.name
  }).text(label).appendTo($container);
}
  
