import { IModelBase } from "../models/base";
import { ServicoBase } from "./service";

export class ServicoFilme extends ServicoBase {

    public async obterPorParametro(params: string): Promise<IModelBase[]> {
        return await this.obterListagem(params);
    }

    protected mapearObjeto(obj: any): IModelBase {
        const filme = {

            id: obj.id,
            avaliacao: obj.vote_average,
            imagemAlt: obj.backdrop_path,
            data: obj.release_date,
            generos: obj.genres ? obj.genres : obj.genre_ids,
            imagem: obj.poster_path,
            nome: obj.title,
            resumo: obj.overview,
            videos: obj.videos,
            tipo: 'movie'

        }
        return filme as IModelBase;
    }
}


 // public async obterLista_MelhoresAvaliados() {
    //     return await this.obterListagem('movie/top_rated');
    // }

    // public async obterLista_Populares() {
    //     return await this.obterListagem('movie/popular');
    // }

    // public async obterLista_Lancamentos() {
    //     return await this.obterListagem('movie/now_playing');
    // }

/*  filme.adult = res.adult
        filme.backdrop_path = res.backdrop_path
        filme.belongs_to_collection = res.belongs_to_collection
        filme.budget = res.budget
        filme.genres = res.genres
        filme.homepage = res.homepage
        filme.id = res.id
        filme.imdb_id = res.imdb_id
        filme.original_language = res.original_language
        filme.original_title = res.original_title
        filme.overview = res.overview
        filme.popularity = res.popularity
        filme.poster_path = res.poster_path
        filme.production_companies = res.production_companies
        filme.production_countries = res.production_countries
        filme.release_date = res.release_date
        filme.revenue = res.revenue
        filme.runtime = res.runtime
        filme.spoken_languages = res.spoken_languages
        filme.status = res.status
        filme.tagline = res.tagline
        filme.title = res.title
        filme.video = res.video
        filme.vote_average = res.vote_average
        filme.vote_count = res.vote_count
        filme.videos = res.videos
        filme.images = res.images
        filme.credits = res.credits?.cast
        filme.adult = res.adult;
        filme.backdrop_path = res.backdrop_path;
        filme.id = res.id;
        filme.original_language = res.original_language;
        filme.original_title = res.original_title;
        filme.overview = res.overview;
        filme.popularity = res.popularity;
        filme.poster_path = res.poster_path;
        filme.release_date = res.release_date;
        filme.title = res.title;
        filme.video = res.video
        filme.vote_average = res.vote_average;
        filme.vote_count = res.vote_count;

        return filme;*/ 