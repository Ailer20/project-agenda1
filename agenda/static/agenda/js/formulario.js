//Script para conferir conflitos em locais ja agendados
document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector('form');
  const local = document.querySelector('#id_local');
  const data_inicio = document.querySelector('#id_data_inicio');
  const horario_inicio = document.querySelector('#id_horario_inicio');
  const horario_fim = document.querySelector('#id_horario_fim');
  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  [local, data_inicio, horario_inicio, horario_fim].forEach(field => {
      field.addEventListener('change', () => {
          fetch(urlVerificarConflito, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "X-CSRFToken": csrfToken
              },
              body: JSON.stringify({
                  local: local.value,
                  data_inicio: data_inicio.value,
                  horario_inicio: horario_inicio.value,
                  horario_fim: horario_fim.value
              })
          })
          .then(response => response.json())
          .then(data => {
              const erro = document.getElementById('erro-conflito');
              if (data.conflito) {
                  erro.textContent = "Já existe uma reunião agendada para esse local nesse horário.";
                  form.querySelector('button[type=submit]').disabled = true;
              } else {
                  erro.textContent = "";
                  form.querySelector('button[type=submit]').disabled = false;
              }
          });
      });
  });
});

//Script para reiniciar o formulario ao fecha-lo

$('#reuniaoModal').on('hidden.bs.modal', function () {
  // Reinicia o formulário
  const form = $(this).find('form')[0];
  if (form) {
    form.reset();
  }
  // Se houver campos que utilizam Select2, limpe-os também
  $(this).find('select').val(null).trigger('change');
  
  // Reinicializa a mensagem de conflito e reabilita o botão de submit
  $(this).find('#erro-conflito').text('');
  $(this).find('button[type=submit]').prop('disabled', false);
});

//Script para Abrir o modal de sucesso de pedido de Agendamento
document.addEventListener("DOMContentLoaded", function() {
  if (mensagemSucesso.trim() !== "") {
    var successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
  }
});


// Script Que filtra colaboradores disponiveis no horario  
document.addEventListener("DOMContentLoaded", function () {
  const dataInicioInput = document.getElementById("id_data_inicio");
  const horarioInicioInput = document.getElementById("id_horario_inicio");
  const horarioFimInput = document.getElementById("id_horario_fim");
  const colaboradoresSelect = document.getElementById("id_colaboradores");

  function atualizarColaboradores() {
      const data_inicio = dataInicioInput.value;
      const horario_inicio = horarioInicioInput.value;
      const horario_fim = horarioFimInput.value;

      if (data_inicio && horario_inicio && horario_fim) {
          fetch(`/colaboradores-disponiveis/?data_inicio=${data_inicio}&horario_inicio=${horario_inicio}&horario_fim=${horario_fim}`)
              .then(response => response.json())
              .then(data => {
                  colaboradoresSelect.innerHTML = "";
                  
                  if (data.colaboradores.length === 0) {
                      const option = document.createElement("option");
                      option.text = "Nenhum colaborador disponível";
                      option.disabled = true;
                      colaboradoresSelect.appendChild(option);
                  } else {
                      data.colaboradores.forEach(colaborador => {
                          const option = document.createElement("option");
                          option.value = colaborador.id;
                          // Se o seu model usa "matricula" no lugar de "username":
                          option.text = colaborador.username + " - " + colaborador.nome + " - " + (colaborador["setor__nome"]);
                          colaboradoresSelect.appendChild(option);
                      });
                  }
              });
      }
  }

  dataInicioInput.addEventListener("change", atualizarColaboradores);
  horarioInicioInput.addEventListener("change", atualizarColaboradores);
  horarioFimInput.addEventListener("change", atualizarColaboradores);
});


//Inicialização do Select2 
$(document).ready(function() {
  // Matcher customizado para busca por substring
  function matchCustom(params, data) {
    if ($.trim(params.term) === '') {
      return data;
    }
    if (typeof data.text === 'undefined') {
      return null;
    }
    var term = params.term.toLowerCase();
    var text = data.text.toLowerCase();
    if (text.indexOf(term) > -1) {
      return data;
    }
    return null;
  }
  
  $('#id_colaboradores').select2({
    placeholder: 'Selecione os colaboradores',
    allowClear: true,
    width: 'resolve',
    minimumInputLength: 0,
    matcher: matchCustom
  });
  
  // Ao abrir o dropdown, forçamos o campo de busca a ter a largura e o placeholder desejados
  $('#id_colaboradores').on('select2:open', function() {
    var $searchField = $('.select2-search__field');
    $searchField.css('width', '300px');
    $searchField.attr('placeholder', 'Pesquise o colaborador');
    $searchField.focus();
  });
});