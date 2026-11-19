(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-nav');
  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      navigation.classList.toggle('is-open', !open);
    });
  }

  const form = document.querySelector('#booking-form');
  if (!form) return;
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  form.elements.date.min = localToday;
  const status = document.querySelector('#form-status');
  const emailIsUh = value => /@(cougarnet\.uh\.edu|uh\.edu)$/i.test(value.trim());

  form.addEventListener('submit', event => {
    event.preventDefault();
    status.className = 'form-status';
    status.textContent = '';
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const start = String(data.get('startTime'));
    const end = String(data.get('endTime'));
    const email = String(data.get('email'));
    if (String(data.get('date')) < localToday) {
      status.classList.add('error');
      status.textContent = 'Choose today or a future date.';
      form.elements.date.focus();
      return;
    }
    if (end <= start) {
      status.classList.add('error');
      status.textContent = 'The end time must be later than the start time.';
      form.elements.endTime.focus();
      return;
    }
    if (!emailIsUh(email)) {
      status.classList.add('error');
      status.textContent = 'Enter a valid UH email ending in @cougarnet.uh.edu or @uh.edu.';
      form.elements.email.focus();
      return;
    }
    const firstName = String(data.get('studentName')).trim().split(/\s+/)[0];
    status.textContent = 'Thanks, ' + firstName + '. Your request for the ' + data.get('room') + ' on ' + data.get('date') + ' from ' + start + ' to ' + end + ' passed the front-end checks. This is a demo only; no reservation has been sent or confirmed.';
    status.focus();
  });
})();