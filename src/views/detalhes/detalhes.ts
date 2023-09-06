import { ServicoBase } from "../../services/service";
import { ServicoFilme } from "../../services/service-filmes";
import { IModelBase } from "../../models/base";
import { ServicoSeries } from "../../services/service-series";
import 'bootstrap'
import './detalhes.css'
import { ServicoFavoritos } from "../../services/service-favoritos";

export class Detalhes {

    private service: ServicoBase;

    private serviceFavoritos: ServicoFavoritos;

    private tipoModel: string;

    private idModel: string;



    constructor() {

        this.serviceFavoritos = new ServicoFavoritos();

        document.getElementById('icone')!.addEventListener('click', () => this.favoritar())

        const url = new URLSearchParams(window.location.search);

        this.tipoModel = url.get('tag') as string;

        this.service = this.obterServico(this.tipoModel);

        this.idModel = url.get('id') as string

        const endpoint = `${this.tipoModel}/${this.idModel}`;

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
            const model = await this.service.obterPorId(endpoint);

            await this.renderizar(model);
        }
        catch (error) {
            console.log(error);
        }
    }
    private async renderizar(model: IModelBase): Promise<void> {
        const icone = document.getElementById('icone') as HTMLElement;
        const titulo = document.getElementById('titulo') as HTMLElement;
        const descricao = document.getElementById('resumo') as HTMLElement;
        const img01 = document.getElementById('img01') as HTMLImageElement;

        titulo.innerText = model.nome;
        descricao.innerText = model.resumo;

        img01.src = `https://image.tmdb.org/t/p/w500${model.imagem}`;

        this.gerarQuadrosVideos(model);

        this.gerarGeneros(model);

        this.atribuirValorIcone(icone, model);

    }


    private async gerarQuadrosVideos(model: IModelBase) {

        const videos = model.videos.results as any[];

        const carouselInner = document.querySelector('.carousel-inner')!;

        for await (const video of videos) {
            const slide = document.createElement('div');
            slide.classList.add('carousel-item');

            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${video.key}`;
            iframe.allowFullscreen = true;
            iframe.classList.add('videos');

            if (video === videos[0]) {
                slide.classList.add('active');
            }
            carouselInner.appendChild(slide);
            slide.appendChild(iframe);
        }
    }

    private gerarGeneros(model: IModelBase) {
        const generos = document.getElementById('generos') as HTMLDivElement;

        model.generos.map(x => {
            let btn = document.createElement('button') as HTMLButtonElement;
            btn.innerText = x.name;
            btn.id = x.id;
            btn.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'm-2')

            generos.appendChild(btn);
        })
    }

    private alterarIconeCoracao() {
        const icone = document.getElementById('icone') as HTMLElement;
        if (icone.classList.contains('bi-balloon-heart-fill'))
            icone.classList.replace('bi-balloon-heart-fill', 'bi-balloon-heart')
        else {
            icone.classList.replace('bi-balloon-heart', 'bi-balloon-heart-fill')
        }
    }

    private atribuirValorIcone(icone: HTMLElement, model: IModelBase) {

        let obj = {
            id: model.id,
            tipo: model.tipo
        }

        let favorito = this.serviceFavoritos.existe(obj);

        if (favorito)
            icone.classList.replace('bi-balloon-heart', 'bi-balloon-heart-fill')
        else{
            icone.classList.replace('bi-balloon-heart-fill', 'bi-balloon-heart')
        }
    }

    public favoritar() {

        let favorito = {
            id: this.idModel,
            tipo: this.tipoModel
        }

        this.serviceFavoritos.favoritar(favorito);
        this.alterarIconeCoracao()
    }





    private gerarCoverImagem(model: IModelBase) {
        const carouselInner = document.querySelector('.carousel-inner')!;
        const slide = document.createElement('div');
        slide.classList.add('carousel-item');
        slide.classList.add('active');
        const img = document.createElement('img');
        img.classList.add('videos')
        img.src = `https://image.tmdb.org/t/p/w500${model.imagemAlt}`;
        carouselInner.appendChild(slide);
        slide.appendChild(img);
    }


    private gerarElenco(filme: IModelBase) {
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