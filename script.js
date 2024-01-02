document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.querySelector('.toggle-sidebar');
  const sidebar = document.getElementById('sidebar');
  const contentContainer = document.querySelector('.content-container');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
    contentContainer.classList.toggle('active');
  });
});
