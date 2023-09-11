import 'bootstrap'
import './midia.css'

import { TelaBase } from "./base";
import { IMidia } from '../../models/midia';
import { ServicoMidia } from '../../services/servico-midia';
import { ServicoLocalStorage } from '../../services/servico-local-storage';

export class TelaMidia extends TelaBase {

    servicoMidia: ServicoMidia;
    servicoLocalStorage: ServicoLocalStorage;
    btnPesquisar: HTMLButtonElement;
    input: HTMLInputElement;


    constructor() {
        super();

        this.inicializarPropriedades();
        this.incluirEventos();
        const params = this.obterParametros();
        this.obterListas(params);
    }

    private inicializarPropriedades() {
        this.divConteudo = document.getElementById('conteudo') as HTMLDivElement;
        this.input = document.getElementById('input') as HTMLInputElement;
        this.btnPesquisar = document.getElementById('btnPesquisar') as HTMLButtonElement;
        this.servicoMidia = new ServicoMidia();
        this.servicoLocalStorage = new ServicoLocalStorage();
    }

    private obterParametros() {
        const url = new URLSearchParams(window.location.search);
        const query = url.get('query') as string;
        const tag = url.get('tag') as string;
        return { query: query, tag: tag };

    }

    private incluirEventos() {
        this.btnPesquisar.addEventListener('click', (event) => this.pesquisar(event));
    }

    private async obterListas(params: any): Promise<void> {
        let tipo: string = this.obterNomeDaLista(params.tag);

        switch (tipo) {
            case "Favoritos": await this.buscarFavoritos(); break;
            case "Gênero": await this.buscarPorGenero(params, tipo); break;
            case "Pesquisa": await this.buscarPorPesquisa(params, tipo); break;
            default: await this.buscarPorCategoria(params, tipo); break;
        }
    }

    private async buscarFavoritos() {
        let dados = this.servicoLocalStorage.listarFavoritos() as any[] || null;

        let listaFavoritos: IMidia[] = [];

        for (let dado of dados) {
            listaFavoritos.push(await this.servicoMidia.obterMidiaPorId(`${dado.tipo}/${dado.id}`));
        }

        this.gerarCards(listaFavoritos, "Séries e Filmes");
    }

    private async buscarPorGenero(params: any, tipo: string) {
        try {
            let lista = await this.servicoMidia.obterMidiaPorGeneros(params.tag);
            await this.gerarCards(lista, tipo)
        }
        catch (error) {
            this.mostrarAviso("Nenhum filme para a pesquisa selecionada")
        }
    }

    private async buscarPorPesquisa(params: any, tipo: string) {

        let lista = await this.servicoMidia.obterMidiaPorPesquisa(params.query.split("-").join(" "));
        await this.gerarCards(lista, tipo)
    }

    private async buscarPorCategoria(params: any, tipo: string) {
        let lista = await this.servicoMidia.obterMidiaPorCategoria(params.tag)
        await this.gerarCards(lista, tipo)
    }

    private obterNomeDaLista(params: string): string {
        if (params.endsWith('top_rated'))
            return 'Melhores Avaliados'
        else if (params.endsWith('popular'))
            return 'Populares'
        else if (params.endsWith('now_playing'))
            return 'Lançamentos'
        else if (params.endsWith('on_the_air'))
            return 'No Ar'
        else if (params.endsWith('search/multi'))
            return 'Pesquisa'
        else if (params.endsWith('favoritos'))
            return 'Favoritos'
        else return "Gênero"


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


window.addEventListener('load', () => new TelaMidia())


