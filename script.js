document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.querySelector('.toggle-sidebar');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('active');
  });
});

