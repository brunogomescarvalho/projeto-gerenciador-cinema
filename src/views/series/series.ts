import 'bootstrap'
import './series.css'
import { TelaBase } from '../compartilhado/base';
import { ServicoSeries } from '../../services/service-series';
import { IMidia } from '../../models/midia';


export class TelaSeries extends TelaBase {

    service: ServicoSeries;

    constructor() {

        super();

        this.divConteudo = document.getElementById('conteudo') as HTMLDivElement;

        this.service = new ServicoSeries();

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
                listaSeries = await this.service.obterSeriesPorGeneros(params.tag);
            }
            else if (params.query) {
                listaSeries = await this.service.obterSeriesPorPesquisa(params.query.split("-").join(" "))
            }
            else {
                listaSeries = await this.service.obterSeriesPorCategoria(params.tag)
            }

            this.gerarCards(listaSeries, tipo)

        }
        catch (error) {
            console.log(error)
        }
    }

    private obterTipoMidia(params: string): string {
        switch (params) {
            case 'tv/top_rated':
                return 'Melhores Avaliados'

            case 'tv/popular':
                return 'Populares'

            case 'tv/on_the_air':
                return 'No Ar'

            case 'search/multi':
                return 'Pesquisa'

            default: return 'Gênero'
        }
    }
}

window.addEventListener('load', () => new TelaSeries())

