import 'bootstrap'
import './detalhes.css'
import { ServicoBase } from "../../services/service-base";
import { ServicoFilme } from "../../services/service-filmes";
import { IMidia, IMidiaDetalhes } from "../../models/midia";
import { ServicoSeries } from "../../services/service-series";
import { ServicoFavoritos } from "../../services/service-favoritos";

export class Detalhes {

    private servico: ServicoBase;

    private serviceFavoritos: ServicoFavoritos;

    private tipoMidia: string;

    private idMidia: string;



    constructor() {

        this.serviceFavoritos = new ServicoFavoritos();

        document.getElementById('icone')!.addEventListener('click', () => this.favoritar())

        const url = new URLSearchParams(window.location.search);

        this.tipoMidia = url.get('tag') as string;

        this.idMidia = url.get('id') as string

        this.servico = this.obterServico(this.tipoMidia);

        const endpoint = `${this.tipoMidia}/${this.idMidia}`;

        this.obterDetalhes(endpoint);

    }


    public favoritar(): void {

        let favorito = { id: this.idMidia, tipo: this.tipoMidia }

        this.serviceFavoritos.favoritar(favorito);

        this.alterarIconeCoracao();
    }

    private obterServico(tipo: string): ServicoBase {
        switch (tipo) {
            case 'movie':
                return new ServicoFilme();

            case 'tv':
                return new ServicoSeries();

            default: throw new Error('Serviço não disponível');
        }
    }

    private async obterDetalhes(endpoint: string): Promise<void> {
        try {
            const midia = await this.servico.obterPorId(endpoint);

            await this.renderizar(midia);
        }
        catch (error) {
            console.log(error);
        }
    }
    private async renderizar(midia: IMidiaDetalhes): Promise<void> {
        const icone = document.getElementById('icone') as HTMLElement;
        const titulo = document.getElementById('titulo') as HTMLElement;
        const descricao = document.getElementById('resumo') as HTMLElement;
        const img01 = document.getElementById('img01') as HTMLImageElement;



        titulo.innerText = midia.nome;

        descricao.innerText = midia.resumo;

        img01.src = `https://image.tmdb.org/t/p/w500${midia.imagem}`;

        this.gerarGeneros(midia);

        this.gerarInfos(midia);

        this.atribuirValorIcone(icone, midia);

        this.gerarElenco(midia);

        if (midia.videos.length > 0)
            this.gerarQuadrosVideos(midia)
        else
            this.gerarQuadroImagens(midia)

    }


    private async gerarQuadrosVideos(midia: IMidiaDetalhes) {
        const link = 'https://www.youtube.com/embed/'

        const videos = midia.videos as any[];

        await this.gerarQuadroSlides(videos, link);
    }

    private gerarQuadroImagens(midia: IMidiaDetalhes) {
        const link = `https://image.tmdb.org/t/p/w500`;

        const imagens = midia.imagens.slice(0, 3);

        const imgs: any[] = [];

        imagens.forEach(x => {

            const obj = { key: x.file_path }

            imgs.push(obj)
        })

        this.gerarQuadroSlides(imgs, link);
    }

    private gerarInfos(midia: IMidiaDetalhes) {

        const txtDiretor = document.getElementById('diretor') as HTMLSpanElement;

        if (midia.creditos.crew.length > 0) {
            const diretor = midia.creditos.crew.find((x: any) => x.department == "Directing");

            txtDiretor.textContent = `Dirigido por: ${diretor.name}`;
        }

        const infos = document.getElementById('infos') as HTMLElement;

        let data = document.createElement('p') as HTMLElement;
        data.innerText = midia.data.substring(0, 4);

        let avaliacao = document.createElement('p') as HTMLElement;
        avaliacao.innerText = `Avaliação: ${Math.round(midia.avaliacao)}/10`;

        let votos = document.createElement('p') as HTMLElement;
        votos.innerText = `Votos: ${Math.round(midia.votos)}`;

        infos.appendChild(data);
        infos.appendChild(avaliacao);
        infos.appendChild(votos);

        for (let x of infos.children)
            x.classList.add('fs-5', 'text-lowercase', 'p-1', 'text-center')


    }


    private async gerarQuadroSlides(promocional: any[], link: string) {
        const carouselInner = document.querySelector('.carousel-inner')!;

        for await (const item of promocional) {
            const slide = document.createElement('div');
            slide.classList.add('carousel-item');

            const iframe = document.createElement('iframe');
            iframe.src = `${link}${item.key}`;
            iframe.allowFullscreen = true;
            iframe.classList.add('videos');

            if (item === promocional[0]) {
                slide.classList.add('active');
            }
            carouselInner.appendChild(slide);
            slide.appendChild(iframe);
        }
    }


    private gerarGeneros(midia: IMidiaDetalhes) {
        const generos = document.getElementById('generos') as HTMLDivElement;

        midia.generos.map(x => {
            let btn = document.createElement('button') as HTMLButtonElement;
            btn.innerText = x.name;
            btn.id = x.id;
            btn.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'mt-1', 'mb-3', 'm-2');
            btn.addEventListener('click', (event: Event) => this.buscarPorGeneros(event))

            generos.appendChild(btn);
        })
    }
    private buscarPorGeneros(event: Event): any {
        const button = event.target as HTMLButtonElement;

        window.location.href = this.construirUrl(button);
    }

    private construirUrl(button: HTMLButtonElement) {

        const endereco = {
            url: 'filmes.html',
            id: button.id,
        }
        return `${endereco.url}?tag=${endereco.id}`
    }

    private alterarIconeCoracao() {
        const icone = document.getElementById('icone') as HTMLElement;

        if (icone.classList.contains('bi-balloon-heart-fill'))
            icone.classList.replace('bi-balloon-heart-fill', 'bi-balloon-heart')
        else {
            icone.classList.replace('bi-balloon-heart', 'bi-balloon-heart-fill')
        }
    }

    private atribuirValorIcone(icone: HTMLElement, midia: IMidiaDetalhes) {

        let midiaSelecionanda = { id: midia.id, tipo: midia.tipo }

        let ehFavorito = this.serviceFavoritos.verificarFavorito(midiaSelecionanda);

        if (ehFavorito)
            icone.classList.replace('bi-balloon-heart', 'bi-balloon-heart-fill');
        else {
            icone.classList.replace('bi-balloon-heart-fill', 'bi-balloon-heart');
        }
    }


    private gerarElenco(filme: IMidiaDetalhes) {
        const divElenco = document.getElementById('elenco') as HTMLUListElement;
        divElenco.classList.add('d-flex', 'flex-row', 'justify-content-between', 'mb-2')
        const elenco = filme.creditos.cast.slice(0, 5)

        elenco.forEach((x: any) => {
            let link = document.createElement('a') as HTMLAnchorElement;

            link.classList.add(

                'link-secondary',
                'ink-offset-2',
                'link-offset-3-hover',
                'link-underline',
                'link-underline-opacity-0',
                'link-underline-opacity-75-hover');

            link.href = `pessoa.html?id=${x.id}`;
            link.innerText = x.name;

            divElenco.appendChild(link);

        })
    }
}


window.addEventListener('load', () => new Detalhes());