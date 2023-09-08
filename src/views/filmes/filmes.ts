import 'bootstrap'
import './filmes.css'
import { ServicoFilme } from "../../services/service-filmes";
import { TelaBase } from "../compartilhado/base";
import { IMidia } from '../../models/midia';

export class TelaFilmes extends TelaBase {

    service: ServicoFilme;

    constructor() {

        super();

        this.divConteudo = document.getElementById('conteudoFilmes') as HTMLDivElement;

        this.service = new ServicoFilme();

        const url = new URLSearchParams(window.location.search);

        const query = url.get('query') as string;

        const tag = url.get('tag') as string;

        const params = { query: query, tag: tag }

        this.obterListas(params);

    }

    private async obterListas(params: any): Promise<void> {

        let tipo: string = this.obterTipoMidia(params.tag);

        try {

            let listaSeries: IMidia[] = [];

            if (tipo == 'Gênero') {
                listaSeries = await this.service.obterFilmesPorGeneros(params.tag);
            }
            else if (params.query) {
                listaSeries = await this.service.obterFilmesPorPesquisa(params.query.split("-").join(" "))
            }
            else {
                listaSeries = await this.service.obterFilmesPorCategoria(params.tag)
            }

            this.gerarCards(listaSeries, tipo)

        }
        catch (error) {
            console.log(error)
        }
    }

    private obterTipoMidia(params: string): string {
        switch (params) {
            case 'movie/top_rated':
                return 'Melhores Avaliados'

            case 'movie/popular':
                return 'Populares'

            case 'movie/now_playing':
                return 'Lançamentos'

            case 'search/multi':
                return 'Pesquisa'

            default: return 'Gênero'
        }
    }
}

window.addEventListener('load', () => new TelaFilmes())


