import 'bootstrap'
import './midia.css'
import { IMidia } from "../../models/midia";

export abstract class TelaBase {

    protected divConteudo: HTMLDivElement;

    protected async gerarCards(midias: IMidia[], tipoMidia: string): Promise<void> {

        if (midias.length == 0) {
            this.mostrarAviso("Nenhuma mídia encontrada");
            return;
        }

        const subtitulo = document.createElement('h2');
        subtitulo.textContent = tipoMidia;
        subtitulo.classList.add('text-secondary', "fw-light", 'fs-3', 'text-center')
        this.divConteudo.appendChild(subtitulo);

        for await (let midia of midias) {
           
            if (midia.imagem == null) continue

            const divCard = document.createElement("div");
            divCard.classList.add('col-xl-2', 'col-lg-4', 'col-md-6', 'col-sm-12', 'text-center');
            divCard.id = midia.id.toString();
            divCard.setAttribute('tipo', midia.tipo);

            const imagem = document.createElement("img");
            imagem.src = `https://image.tmdb.org/t/p/original${midia.imagem}`;
            imagem.classList.add('img-thumbnail', 'p-0', 'imagem')
            divCard.appendChild(imagem);

            const informacoes = document.createElement('div');
            informacoes.classList.add('d-flex', 'flex-column', 'justify-content-evenly');
            divCard.appendChild(informacoes);

            const titulo = document.createElement("a");
            titulo.textContent = `${midia.nome}`;
            titulo.href = `detalhes.html?id=${midia.id}&tag=${midia.tipo}`;
            titulo.classList.add('text-center', 'pt-2', 'link-offset-2', 'link-offset-3-hover',
                'link-underline', 'link-underline-opacity-0', 'link-underline-opacity-75-hover');

            informacoes.appendChild(titulo)

            const data = document.createElement("span");
            data.textContent = `Ano: ${this.obterAno(midia)} `;
            data.classList.add('text-secondary', 'fs-6', 'fw-light');
            informacoes.appendChild(data);

            this.divConteudo.appendChild(divCard);

            imagem.addEventListener('click', (event: Event) => this.obterDetalhes(event));

        }
    }

    private obterAno(midia: IMidia): string {
        return midia.data ? midia.data.substring(0, 4) : " ";
    }


    private obterDetalhes(event: Event): any {
        const divCard = event.target as HTMLElement;
        const parent = divCard.parentElement as HTMLDivElement;
        const tipo = parent.getAttribute('tipo');

        window.location.href = `detalhes.html?id=${parent.id}&tag=${tipo}`;
    }

    protected mostrarAviso(texto: string): void {
        let divAviso = document.createElement('div');
        divAviso.classList.add('aviso');
        let msg = document.createElement('p');
        msg.classList.add('msgAviso');
        msg.textContent = texto;
        document.body.appendChild(divAviso);
        divAviso.appendChild(msg);

        setTimeout(() => {
            document.body.removeChild(divAviso);
        }, 2500);
    }
}
