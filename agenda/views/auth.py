#Módulo de Configuração de Acesso do sistema (Login)
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages

'''
Cadastro de usuario é feito pelo admin
'''

#View Para validar login e redirecionar de acordo com seu tipo de usuario
def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        '''
        Lógica que direciona o usuario do tipo 'colaborador' para a view 'home' 
        e o tipo 'lider' para a view 'home_lider'
        se não for nenhum dos dois redireciona por padrão a view 'home'
        '''
        if user is not None:
            login(request, user)
            if hasattr(user, 'role'):
                if user.role == "colaborador":
                    return redirect("home")
                elif user.role == "lider":
                    return redirect("home_lider")
            return redirect("home")

        messages.error(request, "Usuário ou senha inválidos.")
    
    return render(request, "agenda/login.html")


#View para sair da sessão (logout)

def logout_view(request):
    logout(request)
    return redirect("login")