document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.querySelector('.toggle-sidebar');
  const sidebar = document.getElementById('sidebar');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
});
