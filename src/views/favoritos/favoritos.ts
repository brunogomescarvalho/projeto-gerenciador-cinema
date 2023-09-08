import 'bootstrap'
import './favoritos.css'
import { TelaBase } from '../compartilhado/base';
import { ServicoFavoritos } from '../../services/service-favoritos';
import { ServicoFilme } from '../../services/service-filmes';
import { ServicoSeries } from '../../services/service-series';
import { IMidia } from '../../models/midia';

export class TelaFavoritos extends TelaBase {

    servicoFavoritos: ServicoFavoritos
    servicoFilmes: ServicoFilme
    servicoSeries: ServicoSeries

    constructor() {
        super()

        this.divConteudo = document.getElementById('conteudo') as HTMLDivElement;

        this.servicoFavoritos = new ServicoFavoritos()
        this.servicoFilmes = new ServicoFilme()
        this.servicoSeries = new ServicoSeries()

        const dados = this.obterDadosLocalStorage();

        if (dados) {
            this.obterListagem(dados)
        }
    }


    private obterDadosLocalStorage(): any {
        const favoritosLocalStorage = this.servicoFavoritos.listarFavoritos();

        if (favoritosLocalStorage.length == 0)
            return;

        const favoritos = { filmes: [], series: [] }

        favoritos.filmes = favoritosLocalStorage.filter((item: any) => item.tipo === 'movie');
        favoritos.series = favoritosLocalStorage.filter((item: any) => item.tipo === 'tv');

        return favoritos;
    }

    private async obterListagem(dados: any) {
        const favoritos = { series: [] as IMidia[], filmes: [] as IMidia[] }

        for (let i of dados.series) {
            favoritos.series.push(await this.servicoSeries.obterPorId(`${i.tipo}/${i.id}`))
        }

        for (let i of dados.filmes) {
            favoritos.filmes.push(await this.servicoFilmes.obterPorId(`${i.tipo}/${i.id}`))
        }
        let filmesESeries: IMidia[] = [];

        filmesESeries = favoritos.filmes.concat(favoritos.series);

        this.gerarCards(filmesESeries, 'Filmes e Séries');


    }
}

window.addEventListener('load', () => new TelaFavoritos());