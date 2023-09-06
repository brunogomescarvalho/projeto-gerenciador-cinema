import 'bootstrap'
import './tela-base.css'
import { IModelBase } from "../../models/base";

export abstract class TelaBase {

    protected divConteudo: HTMLDivElement;

    protected gerarCards(filmes: IModelBase[], subTitulo: string): void {

      console.log(filmes)

        const subtitulo = document.createElement('h2');
        subtitulo.textContent = subTitulo;
        subtitulo.classList.add('subtitulo')
        this.divConteudo.appendChild(subtitulo);

        const grid = document.createElement("div");
        grid.classList.add('grid');
        this.divConteudo.appendChild(grid);

        for (let i = 0; i < filmes.length; i++) {
            const filme = filmes[i];

            const newCard = document.createElement("div");
            newCard.classList.add("card");
            newCard.id = filme.id.toString();

            newCard.setAttribute('tipo', filme.tipo);

            const image = document.createElement("img");
            image.src = `https://image.tmdb.org/t/p/w500${filme.imagemAlt}`;
            newCard.appendChild(image);

            const title = document.createElement("p");
            title.textContent = `${filme.nome}`;
            title.classList.add('title');
            newCard.appendChild(title);

            const linha = document.createElement("hr");
            newCard.appendChild(linha);

            const bodyCard = document.createElement('div');
            bodyCard.classList.add('body-card');
            newCard.appendChild(bodyCard);

            const date = document.createElement("p");
            date.textContent = `Ano: ${this.obterAno(filme)} `;
            date.classList.add('date');
            bodyCard.appendChild(date);

            const ranking = document.createElement("p");
            ranking.textContent = `Avaliação: ${this.obterAvaliacao(filme)} `;
            ranking.classList.add('ranking');
            bodyCard.appendChild(ranking);

            grid.appendChild(newCard);

            newCard.addEventListener('click', (event: Event) => this.obterDetalhes(event));

        }
    }

    private obterAno(filme: IModelBase): string {
        const data = filme.data;
        return data.substring(0, 4);
    }

    private obterAvaliacao(filme: IModelBase): string {
        const avaliacao = filme.avaliacao;
        return `${avaliacao}/10`
    }

    private obterDetalhes(event: Event): any {

        const card = event.target as HTMLElement;
        const parent = card.parentElement as HTMLDivElement;
        const tipo = parent.getAttribute('tipo');

        window.location.href = `detalhes.html?id=${parent.id}&tag=${tipo}`;
    }
}
