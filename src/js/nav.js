class NavBar extends HTMLElement{
  constructor(){
    super();
    const template = $("#navbar-custom-element").get(0)
    this.appendChild(template.content.cloneNode(true))

  }
}
customElements.define("custom-navbar",NavBar)
$(document).ready(() => {
  // Get current filename (without .html)
  const currentPath = window.location.pathname.split('/').pop().replace('.html', '');
  console.log("Current page:", currentPath);

  // Loop through nav items
  document.querySelectorAll('#nav_drop .nav-item').forEach(item => {
    const page = item.getAttribute('data-page');

    // Highlight active
    if (page === currentPath) {
      item.classList.add('active-nav');
    } else {
      item.classList.remove('active-nav');
    }

    // Click navigation (skip logout)
    if (page !== "logout") {
      item.addEventListener("click", () => {
        window.location.href = `../html/${page}.html`;
      });
    }
  });

  // Logout click
  $('#logout').click(() => {
    $("#log_out_modal").modal('show');
  });
});
