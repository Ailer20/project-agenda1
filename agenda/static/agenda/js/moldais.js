//Abrir Modal de detalhes da reunião (Líder)
function abrirModalDetalhes(botao) {
    document.getElementById('modalLocal').textContent = botao.dataset.local;
    document.getElementById('modalData').textContent = botao.dataset.data;
    document.getElementById('modalHorario').textContent = botao.dataset.horario;
    document.getElementById('modalDescricao').textContent = botao.dataset.descricao;
    document.getElementById('modalColaboradores').textContent = botao.dataset.colaboradores;

    const motivoRejeicao = botao.dataset.motivo;
    const motivoContainer = document.getElementById('modalMotivo');

    if (motivoRejeicao) {
        motivoContainer.innerHTML  = "<strong>Motivo:</strong>  " + motivoRejeicao;
        motivoContainer.style.display = "block";
    } else {
        motivoContainer.style.display = "none";
    }

    var modal = new bootstrap.Modal(document.getElementById('modalReuniao'));
    modal.show();
}

//Modal de Motivo para quando a reunião for rejeitada (Líder)
function abrirModal(botao) {
    const reuniaoId = botao.dataset.reuniaoId;
    const urlTemplate = botao.dataset.url;
    
    const form = document.getElementById('formRejeicao');
    form.action = urlTemplate.replace('0', reuniaoId);

    document.getElementById('modalRejeicao').style.display = 'flex';
    document.getElementById('reuniaoId').value = reuniaoId;
}

//Modal que mostre o motivo (Colaborador)
function mostrarMotivo(motivo) {
    document.getElementById('motivoTexto').innerText = motivo || "Sem motivo especificado.";
    document.getElementById('modalMotivo').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalRejeicao').style.display = 'none';
    

    document.getElementById('modalMotivo').style.display = 'none';
}