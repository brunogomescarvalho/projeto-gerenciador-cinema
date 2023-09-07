import 'bootstrap'
import './tela-base.css'
import { IMidia } from "../../models/midia";

export abstract class TelaBase {

    protected divConteudo: HTMLDivElement;

    protected gerarCards(midias: IMidia[], tipoMidia: string): void {

        console.log(midias)

        const subtitulo = document.createElement('h2');
        subtitulo.textContent = tipoMidia;
        subtitulo.classList.add('text-secondary', "fw-light", 'fs-3', 'text-center')
        this.divConteudo.appendChild(subtitulo);

        for (let i = 0; i < midias.length; i++) {
            const midia = midias[i];

            if (midia.imagem == null) continue

            const card = document.createElement("div");
            card.classList.add('col-xl-2', 'col-lg-4', 'col-md-6', 'col-sm-12', "card", 'p-2');
            card.id = midia.id.toString();

            card.setAttribute('tipo', midia.tipo);

            const imagem = document.createElement("img");
            imagem.src = `https://image.tmdb.org/t/p/w500${midia.imagem}`;
            card.appendChild(imagem);

            const titulo = document.createElement("span");
            titulo.textContent = `${midia.nome}`;
            titulo.classList.add('col', 'text-center', 'p-2', 'fs-5');
            card.appendChild(titulo)

            const linha = document.createElement("hr");
            card.appendChild(linha);

            const informacoes = document.createElement('div');
            informacoes.classList.add('d-flex', 'flex-row', 'justify-content-evenly');
            card.appendChild(informacoes);

            const data = document.createElement("span");
            data.textContent = `Ano: ${this.obterAno(midia)} `;
            data.classList.add('text-secondary', 'fs-5', 'fw-light');
            informacoes.appendChild(data);

            const avaliacao = document.createElement("span");
            avaliacao.textContent = `Avaliação: ${this.obterAvaliacao(midia)} `;
            avaliacao.classList.add('fs-5', 'fst-italic');
            informacoes.appendChild(avaliacao);

            this.divConteudo.appendChild(card);

            card.addEventListener('click', (event: Event) => this.obterDetalhes(event));

        }
    }

    private obterAno(midia: IMidia): string {
        const data = midia.data;
        return data.substring(0, 4);
    }

    private obterAvaliacao(midia: IMidia): string {
        const avaliacao = Math.round(midia.avaliacao);
        return `${avaliacao}/10`
    }

    private obterDetalhes(event: Event): any {

        const card = event.target as HTMLElement;
        const parent = card.parentElement as HTMLDivElement;
        const tipo = parent.getAttribute('tipo');

        window.location.href = `detalhes.html?id=${parent.id}&tag=${tipo}`;
    }
}
