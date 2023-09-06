import { TipoBusca } from "../../models/enum-model";
import { ServicoFilme } from "../../services/service-filmes";
import { TelaBase } from "../compartilhado/tela-base";
import 'bootstrap'
import './tela-filmes.css'

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

            const listaFilmes = await this.service.obterPorParametro(params);

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

            default:
                return 'Lançamentos'
        }
    }
}

window.addEventListener('load', () => new TelaFilmes())


