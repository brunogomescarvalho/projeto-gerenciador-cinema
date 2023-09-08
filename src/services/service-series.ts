import { IMidia, IMidiaDetalhes } from "../models/midia";
import { ServicoBase } from "./service-base";

export class ServicoSeries extends ServicoBase {

    async obterSeriesPorCategoria(params: string): Promise<IMidia[]> {
        return await this.obterListagemPorCategoria(params);
    }
    async obterSeriesPorGeneros(id: string): Promise<IMidia[]> {
        return await this.obterListagemPorGenero(id);
    }

    async obterSeriesPorPesquisa(input: string): Promise<IMidia[]> {
        return await this.obterListagemPorInput(input, 'tv');
    }

    protected mapearMidia(obj: any): IMidia {
        return {
            id: obj.id,
            avaliacao: obj.vote_average,
            imagem: obj.poster_path,
            data: obj.first_air_date,
            nome: obj.name,
            resumo: obj.overview,
            tipo: 'tv'
        } as IMidia;

    }

    protected mapearBuscaPorId_DetalhesMidia(obj: any): IMidiaDetalhes {
        return {
            id: obj.id,
            videos: obj.videos.results,
            generos: obj.genres,
            imagens: obj.images.backdrops,
            creditos: obj.credits,
            avaliacao: obj.vote_average,
            imagem: obj.poster_path,
            data: obj.first_air_date,
            nome: obj.name,
            resumo: obj.overview,
            votos: obj.vote_count,
            tipo: 'tv'
        } as IMidiaDetalhes
    }


}
