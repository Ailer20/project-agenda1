from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.db.models import Q
from .models import Reuniao, Usuario
from .forms import ReuniaoForm

def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            # Redireciona baseado no tipo de usuário
            if hasattr(user, 'role'):  # Verifica se 'role' existe no usuário
                if user.role == "colaborador":
                    return redirect("home")
                elif user.role == "lider":
                    return redirect("gerenciar_pedidos")
            return redirect("home")  # Caso role não esteja definida

        else:
            messages.error(request, "Usuário ou senha inválidos.")
    
    return render(request, "agenda/login.html")

def logout_view(request):
    logout(request)
    return redirect("login")  # Redireciona para a página de login

@login_required
def home(request):
    if request.user.role != 'colaborador':  # Restringe acesso
        return redirect('login')  

    reunioes = Reuniao.objects.filter(Q(status='aprovado') | Q(criado_por=request.user))

    if request.method == 'POST':
        form = ReuniaoForm(request.POST)
        if form.is_valid():
            reuniao = form.save(commit=False) 
            reuniao.criado_por = request.user
            reuniao.status = 'pendente'
            reuniao.save()

            # Adiciona colaboradores selecionados e o usuário logado
            colaboradores_selecionados = form.cleaned_data['colaboradores']
            reuniao.colaboradores.set(colaboradores_selecionados)  
            reuniao.colaboradores.add(request.user)

            messages.success(request, "Pedido de reunião enviado para aprovação!")
            return redirect('home')
    else:
        form = ReuniaoForm()

    return render(request, "agenda/home.html", {"form": form, "reunioes": reunioes})

@login_required
def colaboradores_disponiveis(request):
    data_inicio = request.GET.get("data_inicio")
    horario_inicio = request.GET.get("horario_inicio")
    horario_fim = request.GET.get("horario_fim")

    if data_inicio and horario_inicio and horario_fim:
        colaboradores_ocupados = Reuniao.objects.filter(
            data_inicio=data_inicio
        ).filter(
            Q(horario_inicio__lt=horario_fim) & Q(horario_fim__gt=horario_inicio)
        ).values_list('colaboradores', flat=True)

        colaboradores_disponiveis = Usuario.objects.filter(role='colaborador').exclude(id__in=colaboradores_ocupados)
        colaboradores_json = list(colaboradores_disponiveis.values("id", "nome"))
        return JsonResponse({"colaboradores": colaboradores_json})

    return JsonResponse({"colaboradores": []})

@login_required
def gerenciar_pedidos(request):
    if not hasattr(request.user, 'role') or request.user.role != 'lider':  
        return redirect('home')  # Redireciona para home se não for líder

    pedidos = Reuniao.objects.filter(status='pendente')
    return render(request, "agenda/gerenciar_pedidos.html", {"pedidos": pedidos})

@login_required
def alterar_status_reuniao(request, reuniao_id, novo_status):
    if request.user.role != 'lider':  # Restringe a líderes
        return redirect('gerenciar_pedidos')

    reuniao = get_object_or_404(Reuniao, id=reuniao_id)
    if novo_status in ['aprovado', 'rejeitado']:
        reuniao.status = novo_status
        reuniao.save()
        messages.success(request, f"Reunião {reuniao.titulo} foi {novo_status}!")

    return redirect('gerenciar_pedidos')



