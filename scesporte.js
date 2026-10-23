document.addEventListener("DOMContentLoaded", function() {
    // COLOQUE SEU LINK DO GOOGLE SHEETS ENTRE AS ASPAS ABAIXO:
    const LINK_PLANILHA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxAUs_um9Usj1Bq_-9TyG3_3NLujUJV4b8IAouJ1DfiqsCGuvDUQNtWRqOZmBx0mf1IaRI9LmOXujl/pub?output=csv"; 

    const campoNoticias = document.getElementById("noticias-esportivas");
    const tituloModalidade = document.getElementById("titulo-modalidade");
    const corpoTabela = document.getElementById("corpo-tabela");

    // 1. FUNÇÃO QUE BUSCA E ATUALIZA A TABELA GERAL (Lateral direita)
    function carregarTabelaGeral() {
        fetch(`${LINK_PLANILHA}&sheet=tabela`)
            .then(res => res.text())
            .then(data => {
                corpoTabela.innerHTML = ""; // Limpa o texto de carregando
                const linhas = data.split("\n").slice(1);

                linhas.forEach(l => {
                    const col = l.split(",");
                    if(col.length >= 3 && col[0].trim() !== "") {
                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td>${col[0].trim()}</td>
                            <td><strong>${col[1].trim()}</strong></td>
                            <td>${col[2].trim()}</td>
                        `;
                        corpoTabela.appendChild(tr);
                    }
                });
            })
            .catch(() => {
                corpoTabela.innerHTML = "<tr><td colspan='3'>Erro ao carregar tabela.</td></tr>";
            });
    }

    // 2. FUNÇÃO QUE CARREGA OS VALORES DE CADA ESPORTE (Futsal, Vôlei, etc)
    function carregarModalidade(nomeAba, tituloTexto) {
        campoNoticias.innerHTML = "<p>Buscando placares atualizados...</p>";
        tituloModalidade.textContent = tituloTexto;

        fetch(`${LINK_PLANILHA}&sheet=${nomeAba}`)
            .then(res => res.text())
            .then(data => {
                campoNoticias.innerHTML = "";
                const linhas = data.split("\n").slice(1);
                let temConteudo = false;

                linhas.forEach(l => {
                    const col = l.split(",");
                    if(col.length >= 3 && col[0].trim() !== "") {
                        temConteudo = true;
                        const card = document.createElement("article");
                        card.className = "card-jogo";
                        card.innerHTML = `
                            <span class="data-jogo">🕒 ${col[1].trim()}</span>
                            <h3>${col[0].trim()}</h3>
                            <p>${col[2].trim()}</p>
                        `;
                        campoNoticias.appendChild(card);
                    }
                });

                if(!temConteudo) {
                    campoNoticias.innerHTML = "<p>Nenhum jogo registrado para esta modalidade ainda.</p>";
                }
            })
            .catch(() => {
                campoNoticias.innerHTML = "<p>Erro ao conectar com o placar oficial.</p>";
            });
    }

    // Configuração dos botões do Menu
    function ligarBotao(idBotao, nomeAba, titulo) {
        document.getElementById(idBotao).onclick = function(e) {
            e.preventDefault();
            document.querySelectorAll("nav a").forEach(a => a.classList.remove("ativo"));
            this.classList.add("ativo");
            carregarModalidade(nomeAba, titulo);
        };
    }

    ligarBotao("btn-futsal", "futsal", "Campeonato de Futsal - FITO");
    ligarBotao("btn-volei", "volei", "Torneio de Vôlei Misto");
    ligarBotao("btn-handebol", "handebol", "Partidas de Handebol");
    ligarBotao("btn-xadrez", "xadrez", "Circuito de Xadrez Escolar");

    // Inicialização automática do Site ao abrir
    carregarTabelaGeral(); // Puxa os dados da aba "tabela"
    carregarModalidade("futsal", "Campeonato de Futsal - FITO"); // Puxa os dados da aba "futsal"

    // Modo Noturno
    document.getElementById("botao-tema").onclick = function() {
        document.body.classList.toggle("modo-escuro");
    };
});