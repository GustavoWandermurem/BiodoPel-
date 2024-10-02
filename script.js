// Função para alternar entre as abas
function openTab(evt, tabName) {
    const tabcontents = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = 'none';
    }

    const tablinks = document.getElementsByClassName('tablink');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }

    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.tablink').click();
});


document.getElementById('reservaForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const placa = document.getElementById('placaReserva').value.toUpperCase();
    const numeroApartamento = document.getElementById('numeroApartamentoReserva').value;
    const blocoApartamento = parseInt(document.getElementById('blocoApartamentoReserva').value.toUpperCase());
    const numeroVaga = parseInt(document.getElementById('numeroVagaReserva').value.toUpperCase());

    if (!placa.match(/^[A-Z]{3}\d{4}$/)) {
        alert('A placa deve estar nesse formato "ABC1234".');
        return;
    }
    

    if (isNaN(numeroVaga) || numeroVaga < 1 || numeroVaga > 100) {
        alert('O número da vaga deve estar entre 1 e 100.');
        return;
    }

    if (isNaN(numeroApartamento) || numeroApartamento <= 0) {
        alert('Número do apartamento inválido!');
        return;
    }

    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const vagaOcupada = reservas.some(r => r.numeroVaga === numeroVaga);

    if (vagaOcupada) {
        alert('Vaga já reservada!');
        return;
    }

    const reserva = {
        placa,
        numeroApartamento,
        blocoApartamento,
        numeroVaga
    };

    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    alert('Vaga reservada com sucesso!');
    document.getElementById('reservaForm').reset();
    atualizarStatusVagas();
    exibirReservas();
});

// Cadastro de Veículos
document.getElementById('cadastroForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const placa = document.getElementById('placaCadastro').value.toUpperCase();
    const nomeProprietario = document.getElementById('nomeProprietario').value;
    const modeloVeiculo = document.getElementById('modeloVeiculo').value;
    const corVeiculo = document.getElementById('corVeiculo').value;

    if (!placa.match(/^[A-Z]{3}\d{4}$/)) {
        alert('Deve estar no formato "ABC1234".');
        return;
    }

    const veiculo = {
        placa,
        nomeProprietario,
        modeloVeiculo,
        corVeiculo
    };

    let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const veiculoExistente = veiculos.some(v => v.placa === placa);
    if (veiculoExistente) {
        alert('Veículo já cadastrado!');
        return;
    }

    veiculos.push(veiculo);
    localStorage.setItem('veiculos', JSON.stringify(veiculos));

    alert('Veículo cadastrado com sucesso!');
    document.getElementById('cadastroForm').reset();
    exibirVeiculos();
});

// Consulta de Vagas
document.getElementById('mostrarTodas').addEventListener('click', function () {
    exibirVagas(false);
});

document.getElementById('mostrarDisponiveis').addEventListener('click', function () {
    exibirVagas(true);
});

function exibirVagas(apenasDisponiveis) {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    
    if (apenasDisponiveis) {
        const vagasDisponiveis = obterTodasVagas().filter(vaga => {
            return !reservas.some(r => r.numeroVaga === vaga);
        });
        alert(`Vagas disponíveis: ${vagasDisponiveis.join(', ')}`);
    } else {
        alert(`Todas as reservas: ${reservas.map(r => `Vaga ${r.numeroVaga} - Placa: ${r.placa}`).join('\n')}`);
    }
}

// Função para obter todas as vagas
function obterTodasVagas() {
    const maxVagas = 100; // Total de vagas
    const vagas = [];
    for (let i = 1; i <= maxVagas; i++) {
        vagas.push(i);
    }
    return vagas;
}

// Função para atualizar o status das vagas
function atualizarStatusVagas() {
    const totalVagas = obterTodasVagas().length;
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const vagasOcupadas = reservas.length;
    const vagasRestantes = totalVagas - vagasOcupadas;

    const vagaStatus = document.getElementById("vagaStatus");
    vagaStatus.textContent = `${vagasRestantes} vagas disponíveis`;
}

// Exibir veículos cadastrados
function exibirVeiculos() {
    const veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    const listaVeiculos = document.getElementById('listaVeiculos');
    listaVeiculos.innerHTML = '';

    veiculos.forEach((veiculo, index) => {
        const li = document.createElement('li');
        li.textContent = `Placa: ${veiculo.placa}, Proprietário: ${veiculo.nomeProprietario}, Modelo: ${veiculo.modeloVeiculo}, Cor: ${veiculo.corVeiculo}`;
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.onclick = () => removerVeiculo(index);
        li.appendChild(btnRemover);
        listaVeiculos.appendChild(li);
    });
}

// Exibir reservas feitas
function exibirReservas() {
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const listaReservas = document.getElementById('listaReservas');
    listaReservas.innerHTML = '';

    reservas.forEach((reserva, index) => {
        const li = document.createElement('li');
        li.textContent = `Vaga: ${reserva.numeroVaga}, Placa: ${reserva.placa}, Apartamento: ${reserva.numeroApartamento}, Bloco: ${reserva.blocoApartamento}`;
        const btnRemover = document.createElement('button');
        btnRemover.textContent = 'Remover';
        btnRemover.onclick = () => removerReserva(index);
        li.appendChild(btnRemover);
        listaReservas.appendChild(li);
    });
}

// Função para remover veículo
function removerVeiculo(index) {
    let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    veiculos.splice(index, 1);
    localStorage.setItem('veiculos', JSON.stringify(veiculos));
    exibirVeiculos();
}

// Função para remover reserva
function removerReserva(index) {
    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    reservas.splice(index, 1);
    localStorage.setItem('reservas', JSON.stringify(reservas));
    exibirReservas();
    atualizarStatusVagas();
}

// Inicializa exibição
exibirVeiculos();
exibirReservas();
atualizarStatusVagas();
