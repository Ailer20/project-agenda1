# Módulo de ações dos usuarios do tipo 'lider'
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from ..models import Reuniao
from ..forms import ReuniaoForm

# View para carregar as funções da tela Home (lider)
@login_required 
def home_lider(request):
    # Verifica se o tipo de usuário é 'lider'. Caso contrário, redireciona para o login
    if request.user.role != 'lider':
        return redirect('login')

    reunioes = Reuniao.objects.filter(Q(status='aprovado') | Q(criado_por=request.user))

    if request.method == 'POST':
        form = ReuniaoForm(request.POST)
        if form.is_valid():
            reuniao = form.save(commit=False)
            reuniao.criado_por = request.user
            reuniao.status = 'aprovado'  # Status aprovado automaticamente para líderes
            reuniao.save()
            reuniao.colaboradores.set(form.cleaned_data['colaboradores'])
            reuniao.colaboradores.add(request.user)

            messages.success(request, "Reunião aprovada e cadastrada com sucesso!")
            return redirect('home_lider')
    else:
        form = ReuniaoForm(user=request.user)

    return render(request, "agenda/home_lider.html", {"form": form, "reunioes": reunioes})

#View para carregar as funções da tela pedidos (lider)
@login_required
def gerenciar_pedidos(request):
     # Verifica se o tipo de usuario é 'lider'. Caso não, é redirecionado para o home (colaborador)
    if not hasattr(request.user, 'role') or request.user.role != 'lider':
        return redirect('home')

    # Filtra Pedidos com o status 'pendente'
    pedidos = Reuniao.objects.filter(status='pendente')

    # Filtra o Histórico de Pedidos, excluindo os com status 'pendente'
    historico = Reuniao.objects.exclude(status='pendente').order_by('-data_inicio', '-horario_inicio')

    return render(request, "agenda/gerenciar_pedidos.html", {
        "pedidos": pedidos,
        "historico": historico
    })

#View que permite autorizar/recusar pedidos de reunião (Exclusivo lider)
@login_required
def alterar_status_reuniao(request, reuniao_id, novo_status):
    if request.user.role != 'lider':
        return redirect('gerenciar_pedidos')

    reuniao = get_object_or_404(Reuniao, id=reuniao_id)

    if request.method == 'POST':
        motivo_rejeicao = request.POST.get('motivo_rejeicao', '').strip()
        
        if novo_status == 'rejeitado' and not motivo_rejeicao:
            messages.error(request, "Por favor, forneça um motivo para a rejeição.")
            return redirect('gerenciar_pedidos')

        reuniao.status = novo_status
        if novo_status == 'rejeitado':
            reuniao.motivo_rejeicao = motivo_rejeicao
        else:
            reuniao.motivo_rejeicao = None

        reuniao.save()
        messages.success(request, f"Reunião {reuniao.titulo} foi {novo_status}!")

    return redirect('gerenciar_pedidos')