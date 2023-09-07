import { IMidia, IMidiaDetalhes } from "../models/midia";
import { ServicoBase } from "./service-base";

export class ServicoFilme extends ServicoBase {

    public async obterFilmesPorCategoria(params: string): Promise<IMidia[]> {

        return await this.obterListagemPorCategoria(params);
    }

    public async obterFilmesPorGeneros(params: string): Promise<IMidia[]> {

        return await this.obterListagemPorGenero(params, 'movie');
    }



    protected mapearMidia(obj: any): IMidia {
        const filme = {
            id: obj.id,
            avaliacao: obj.vote_average,
            imagem: obj.poster_path,
            data: obj.release_date,
            nome: obj.title,
            resumo: obj.overview,
            tipo: 'movie'
        }
        return filme as IMidia;
    }
    protected mapearBuscaPorId_DetalhesMidia(obj: any): IMidiaDetalhes {
        const filme: IMidiaDetalhes = {
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
            tipo: 'movie'
        }

        return filme;
    }
}
