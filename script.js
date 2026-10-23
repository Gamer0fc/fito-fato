document.addEventListener("DOMContentLoaded", function() {
    // COLOQUE SEU LINK DO GOOGLE SHEETS ENTRE AS ASPAS ABAIXO:
    const URL_PLANILHA = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQxAUs_um9Usj1Bq_-9TyG3_3NLujUJV4b8IAouJ1DfiqsCGuvDUQNtWRqOZmBx0mf1IaRI9LmOXujl/pub?output=csv";

    const gridNoticias = document.querySelector(".grid-noticias");
    const botaoTema = document.getElementById("botao-tema");
    const corpoPagina = document.body;

    // 1. FUNCIONALIDADE: ALTERNAR MODO NOTURNO
    botaoTema.addEventListener("click", function() {
        corpoPagina.classList.toggle("modo-escuro");
        
        if (corpoPagina.classList.contains("modo-escuro")) {
            botaoTema.textContent = "Modo Claro ☀️";
        } else {
            botaoTema.textContent = "Modo Noturno 🌙";
        }
    });

    // 2. FUNCIONALIDADE: BUSCAR NOTÍCIAS DA PLANILHA
    fetch(URL_PLANILHA)
        .then(response => response.text())
        .then(data => {
            gridNoticias.innerHTML = ""; 
            const linhas = data.split("\n").slice(1); 

            linhas.forEach(linha => {
                const colunas = linha.split(","); 
                
                if(colunas.length >= 3) {
                    const titulo = colunas[0].trim();
                    const dataNoticia = colunas[1].trim();
                    const conteudo = colunas[2].trim();

                    const card = document.createElement("article");
                    card.className = "noticia-card";
                    card.innerHTML = `
                        <h3>${titulo}</h3>
                        <p class="data-noticia">📅 ${dataNoticia}</p>
                        <p>${conteudo}</p>
                    `;
                    gridNoticias.appendChild(card);
                }
            });
        })
        .catch(error => {
            gridNoticias.innerHTML = "<p>Erro ao carregar as notícias. Verifique o link da planilha.</p>";
            console.error(error);
        });
});