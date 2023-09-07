import 'bootstrap'
import './tela-series.css'
import { TelaBase } from '../compartilhado/tela-base';
import { ServicoSeries } from '../../services/service-series';


export class TelaSeries extends TelaBase {

    service: ServicoSeries;

    constructor() {

        super();

        this.divConteudo = document.getElementById('conteudo') as HTMLDivElement;

        this.service = new ServicoSeries();

        const url = new URLSearchParams(window.location.search);

        const params = url.get('tag') as string;

        this.obterListas(params);

    }

    private async obterListas(params: string): Promise<void> {
        let tipo: string = this.obterTipoMidia(params);

        try {
            const listaSeries = await this.service.obterPorParametro(params);

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

            default:
                return 'No Ar'
        }
    }
}

window.addEventListener('load', () => new TelaSeries())

