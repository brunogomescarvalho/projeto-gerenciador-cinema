import 'bootstrap'
import './detalhes.css'
import { IMidiaDetalhes } from "../../models/midia";
import { ServicoMidia } from '../../services/servico-midia';
import { ServicoLocalStorage } from '../../services/servico-local-storage';

export class Detalhes {

    private servico: ServicoMidia;
    private servicoLocalStorage: ServicoLocalStorage;
    private tipoMidia: string;
    private idMidia: string;
    private midia: IMidiaDetalhes

    icone: HTMLElement;
    titulo: HTMLElement;
    descricao: HTMLElement;
    img01: HTMLImageElement;
    txtDiretor: HTMLSpanElement;
    divElenco: HTMLUListElement;
    infos: HTMLElement;
    generos: HTMLDivElement;
    input: HTMLInputElement;
    btnPesquisar: HTMLButtonElement;


    constructor() {

        this.inicializarVariaveis();

        this.incluirEventos();

        const endpoint = this.obterEndpoint();

        this.renderizarMidia(endpoint);
    }


    private obterEndpoint() {
        const url = new URLSearchParams(window.location.search);
        this.tipoMidia = url.get('tag') as string;
        this.idMidia = url.get('id') as string;
        return `${this.tipoMidia}/${this.idMidia}`;
    }

    private inicializarVariaveis() {
        this.servico = new ServicoMidia();
        this.servicoLocalStorage = new ServicoLocalStorage();
        this.icone = document.getElementById('icone') as HTMLElement;
        this.titulo = document.getElementById('titulo') as HTMLElement;
        this.descricao = document.getElementById('resumo') as HTMLElement;
        this.img01 = document.getElementById('img01') as HTMLImageElement;
        this.txtDiretor = document.getElementById('diretor') as HTMLSpanElement;
        this.divElenco = document.getElementById('elenco') as HTMLUListElement;
        this.infos = document.getElementById('infos') as HTMLElement;
        this.generos = document.getElementById('generos') as HTMLDivElement;
        this.input = document.getElementById('input') as HTMLInputElement;
        this.btnPesquisar = document.getElementById('btnPesquisar') as HTMLButtonElement;

    }

    private incluirEventos() {
        this.btnPesquisar.addEventListener('click', (event) => this.pesquisar(event));
        this.icone.addEventListener('click', () => this.favoritar())
    }

    async renderizarMidia(endpoint: string) {

        this.midia = await this.servico.obterMidiaPorId(endpoint);

        await this.renderizar();

    }

    private async renderizar(): Promise<void> {
        this.gerarBtnGeneros();
        this.gerarInfos();
        this.atribuirValorIcone();
        this.gerarElenco();

        if (this.midia.videos.length > 0)
            await this.gerarQuadrosVideos()
        else
            await this.gerarQuadroImagens()

    }


    public favoritar(): void {
        let favorito = { id: this.idMidia, tipo: this.tipoMidia }
        this.servicoLocalStorage.favoritar(favorito);
        this.alterarIconeCoracao();
    }


    private async gerarQuadrosVideos() {
        const link = 'https://www.youtube.com/embed/'

        const videos = this.midia.videos as any[];

        await this.gerarQuadroSlides(videos, link);
    }

    private async gerarQuadroImagens() {
        const link = `https://image.tmdb.org/t/p/w780`;

        const imagens = this.midia.imagens.slice(0, 3);

        const imgs = [...imagens].map((x) => ({ key: x.file_path }));

        await this.gerarQuadroSlides(imgs, link);
    }

    private gerarInfos() {

        this.titulo.innerText = this.midia.nome;
        this.descricao.innerText = this.midia.resumo;
        this.img01.src = `https://image.tmdb.org/t/p/w342${this.midia.imagem}`;

        if (this.midia.creditos.crew.length > 0) {
            const diretor = this.midia.creditos.crew.find((x: any) => x.department == "Directing" || x.department == "Production");

            this.txtDiretor.textContent = `${(diretor.department === "Directing" ? "Dirigido" : "Produzido")} por ${diretor.name}`;
        }

        let data = document.createElement('p') as HTMLElement;
        data.innerText = `ano: ${this.midia.data.substring(0, 4)}`;
        this.infos.appendChild(data);

        let avaliacao = document.createElement('p') as HTMLElement;
        avaliacao.innerText = `Avaliação: ${Math.round(this.midia.avaliacao)}/10`;
        this.infos.appendChild(avaliacao);

        let votos = document.createElement('p') as HTMLElement;
        votos.innerText = `Votos: ${Math.round(this.midia.votos)}`;
        this.infos.appendChild(votos);

        for (let x of this.infos.children)
            x.classList.add('fs-5', 'text-lowercase', 'p-1', 'text-center', 'd-flex', 'flex-column', 'm-0', 'align-self-center')

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

    private gerarBtnGeneros() {
        this.midia.generos.map(x => {
            let btn = document.createElement('button') as HTMLButtonElement;
            btn.innerText = x.name;
            btn.id = x.id;
            btn.classList.add('btn', 'btn-outline-secondary', 'btn-sm', 'mt-1', 'mb-3', 'm-2');
            btn.addEventListener('click', (event: Event) => this.buscarPorGeneros(event))
            this.generos.appendChild(btn);
        })
    }

    private buscarPorGeneros(event: Event): any {
        const button = event.target as HTMLButtonElement;
        window.location.href = `midia.html?tag=${button.id}`
    }

    private alterarIconeCoracao() {
        if (this.icone.classList.contains('bi-balloon-heart-fill'))
            this.icone.classList.replace('bi-balloon-heart-fill', 'bi-balloon-heart')
        else {
            this.icone.classList.replace('bi-balloon-heart', 'bi-balloon-heart-fill')
        }
    }

    private atribuirValorIcone(): void {

        let midiaSelecionanda = { id: this.midia.id, tipo: this.midia.tipo }

        let ehFavorito = this.servicoLocalStorage.verificarFavorito(midiaSelecionanda);

        if (ehFavorito)
            this.icone.classList.replace('bi-balloon-heart', 'bi-balloon-heart-fill');
        else {
            this.icone.classList.replace('bi-balloon-heart-fill', 'bi-balloon-heart');
        }
    }

    private gerarElenco(): void {

        this.divElenco.classList.add('d-flex', 'flex-row', 'justify-content-between', 'mb-2');

        const elenco = this.midia.creditos.cast.slice(0, 5);
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

            this.divElenco.appendChild(link);

        })
    }
    public pesquisar(event: Event): any {
        event.preventDefault()
        window.location.href = this.construirUrl()
    }

    private construirUrl() {
        const query = this.input.value.split(" ").join("-");
        return `midia.html?tag=search/multi&query=${query}`
    }
}


window.addEventListener('load', () => new Detalhes());