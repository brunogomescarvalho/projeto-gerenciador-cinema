import { IMidia, IMidiaDetalhes } from "../models/midia";
import { ServicoBase } from "./service-base";

export class ServicoFilme extends ServicoBase {

    public async obterFilmesPorPesquisa(input: any): Promise<IMidia[]> {
        return await this.obterListagemPorInput(input, 'movie');
    }

    public async obterFilmesPorCategoria(params: string): Promise<IMidia[]> {
        return await this.obterListagemPorCategoria(params);
    }

    public async obterFilmesPorGeneros(id: string): Promise<IMidia[]> {
        return await this.obterListagemPorGenero(id);
    }

    protected mapearMidia(obj: any): IMidia {
        return {
            id: obj.id,
            avaliacao: obj.vote_average,
            imagem: obj.poster_path,
            data: obj.release_date,
            nome: obj.title,
            resumo: obj.overview,
            tipo: 'movie'
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
            data: obj.release_date,
            nome: obj.title,
            resumo: obj.overview,
            votos: obj.vote_count,
            tipo: 'movie'
        } as IMidiaDetalhes
    }
}
