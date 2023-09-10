import { IMidia, IMidiaDetalhes } from "../models/midia";
import { ServicoBase } from "./servico-base";

export class ServicoMidia extends ServicoBase {

    
    public async obterMidiaPorPesquisa(input: any): Promise<IMidia[]> {
        let url = `search/multi?query=${input}&language=pt-br&include_media_type=true`;
        return await this.obterListagem(url);
    }

    public async obterMidiaPorId(params: string) {
        return await this.obterPorId(params);
    }

    public async obterMidiaPorCategoria(params: string): Promise<IMidia[]> {
        return await this.obterListagem(params);
    }

    public async obterMidiaPorGeneros(id: string): Promise<IMidia[]> {
        return await this.obterListagem(`genre/${id}/movies`);
    }

    protected mapearMidia(obj: any): IMidia {
        return {
            id: obj.id,
            avaliacao: obj.vote_average,
            imagem: obj.poster_path,
            data: obj.release_date ? obj.release_date : obj.first_air_date,
            nome: obj.title ? obj.title : obj.name,
            resumo: obj.overview,
            tipo: obj.title ? 'movie' : 'tv',
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
            data: obj.release_date ? obj.release_date : obj.first_air_date,
            nome: obj.title ? obj.title : obj.name,
            resumo: obj.overview,
            votos: obj.vote_count,
            tipo:  obj.title ? 'movie' : 'tv',
        } as IMidiaDetalhes
    }
}
