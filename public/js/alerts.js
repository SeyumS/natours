
export const hideAlert = () => {
  const el = document.querySelectot('.alert');
  if (el) el.parentElement.removeChild(el);
};


export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="allert alert--${type}"</div>`
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};