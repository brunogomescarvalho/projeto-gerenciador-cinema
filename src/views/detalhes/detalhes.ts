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

        this.atribuirValorIcone(icone, midia);

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
            btn.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'm-2');
            btn.addEventListener('click', (event: Event) => this.buscarPorGeneros(event))

            generos.appendChild(btn);
        })
    }
    private buscarPorGeneros(event: Event): any {
        const button = event.target as HTMLButtonElement;

        let url = this.tipoMidia == 'tv' ? 'tela-series.html' : 'tela-filmes.html'

        window.location.href = `${url}?tag=${button.innerText}&type=${this.tipoMidia}`;
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

        let ehFavorito = this.serviceFavoritos.existe(midiaSelecionanda);

        if (ehFavorito)
            icone.classList.replace('bi-balloon-heart', 'bi-balloon-heart-fill');
        else {
            icone.classList.replace('bi-balloon-heart-fill', 'bi-balloon-heart');
        }
    }

    public favoritar() {

        let favorito = { id: this.idMidia, tipo: this.tipoMidia }

        this.serviceFavoritos.favoritar(favorito);

        this.alterarIconeCoracao();
    }

    private gerarElenco(filme: IMidia) {
        const elenco = document.getElementById('elenco') as HTMLUListElement;

        // filme.credits.cast.map((x: any) => {
        //     let li = document.createElement('li') as HTMLLIElement;
        //     li.value = x.name;
        //     li.id = x.id

        //     elenco.appendChild(li);
        // })
    }
}


window.addEventListener('load', () => new Detalhes());