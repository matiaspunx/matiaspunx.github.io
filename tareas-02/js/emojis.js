import { createPopup } from 'https://unpkg.com/@picmo/popup-picker@latest/dist/index.js?module';

const container = document.querySelector('.pickerContainer');
const trigger = document.querySelector('#trigger');

const picker = createPopup({}, {
  position: 'bottom-end'
});

trigger.addEventListener('click', () => {
  picker.toggle({
    triggerElement: trigger,
    referenceElement: trigger
  });
});

picker.addEventListener('emoji:select', selection => {
  //console.log('Selected emoji: ', selection.emoji);
  document.querySelector('#emojiTarea').value = selection.emoji;

});