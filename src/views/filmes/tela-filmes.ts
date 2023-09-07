import 'bootstrap'
import './tela-filmes.css'
import { ServicoFilme } from "../../services/service-filmes";
import { TelaBase } from "../compartilhado/tela-base";
import { IMidia } from '../../models/midia';

export class TelaFilmes extends TelaBase {

    service: ServicoFilme;

    constructor() {

        super();

        this.divConteudo = document.getElementById('conteudoFilmes') as HTMLDivElement;

        this.service = new ServicoFilme();

        const url = new URLSearchParams(window.location.search);

        const params = url.get('tag') as string;

        this.obterListas(params);

    }

    private async obterListas(params: string): Promise<void> {

        let tipo: string = this.obterTipoBusca(params);

        try {

            let listaFilmes: IMidia[] = [];

            if (tipo == params) {
                listaFilmes = await this.service.obterFilmesPorGeneros(params);
            }
            else {
                listaFilmes = await this.service.obterFilmesPorCategoria(params)
            }

            this.gerarCards(listaFilmes, tipo)

        }
        catch (error) {
            console.log(error)
        }
    }

    private obterTipoBusca(params: string): string {
        switch (params) {
            case 'movie/top_rated':
                return 'Melhores Avaliados'

            case 'movie/popular':
                return 'Populares'

            case 'movie/now_playing':
                return 'Lançamentos'

            default:
                return params
        }
    }
}

window.addEventListener('load', () => new TelaFilmes())


