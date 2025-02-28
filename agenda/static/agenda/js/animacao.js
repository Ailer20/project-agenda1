document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
    document.querySelector('.sidebar').classList.add('show');
  }, 100); // Pequeno atraso para garantir que a transição seja visível
});

setTimeout(() => {
  document.querySelectorAll('.alert').forEach(alert => alert.remove());
}, 3000); // 3 segundos