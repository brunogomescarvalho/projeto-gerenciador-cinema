import { IModelBase } from "../models/base";
import { ServicoBase } from "./service";

export class ServicoSeries extends ServicoBase {


    public async obterPorParametro(params: string): Promise<IModelBase[]> {
        return await this.obterListagem(params);
    }

    protected mapearObjeto(obj: any): IModelBase {

        const serie = {
            id: obj.id,
            avaliacao: obj.vote_average,
            imagemAlt: obj.backdrop_path,
            data: obj.first_air_date,
            generos: obj.genres ? obj.genres : obj.genre_ids,
            imagem: obj.poster_path,
            nome: obj.name,
            resumo: obj.overview,
            videos: obj.videos,
            criador: obj.created_by,
            tipo: 'tv'

        }

        return serie as IModelBase;
    }


}

 // public async obterLista_MelhoresAvaliados() {
    //     return await this.obterListagem('tv/top_rated');
    // }

    // public async obterLista_Populares() {
    //     return await this.obterListagem('tv/popular');
    // }

    // public async obterLista_NoAr() {
    //     return await this.obterListagem('tv/on_the_air');
    // }


/* console.log(obj)
        const serie: ISerieModelo = {} as ISerieModelo
        serie.adult = obj.adult
        serie.backdrop_path = obj.backdrop_path
        serie.created_by = obj.created_by
        serie.episode_run_time = obj.episode_run_time
        serie.first_air_date = obj.first_air_date
        serie.genres = obj.genres
        serie.homepage = obj.homepage
        serie.id = obj.id
        serie.in_production = obj.in_production
        serie.languages = obj.languages
        serie.last_air_date = obj.last_air_date
        serie.last_episode_to_air = obj.last_episode_to_air
        serie.name = obj.name
        serie.next_episode_to_air = obj.next_episode_to_air
        serie.networks = obj.networks
        serie.number_of_episodes = obj.number_of_episodes
        serie.number_of_seasons = obj.number_of_season
        serie.origin_country = obj.origin_country
        serie.original_language = obj.original_language
        serie.original_name = obj.original_name
        serie.overview = obj.overview
        serie.popularity = obj.popularity
        serie.poster_path = obj.poster_path
        serie.production_companies = obj.production_companies
        serie.production_countries = obj.production_countries
        serie.seasons = obj.seasons
        serie.logos = obj.logos
        serie.posters = obj.posters
        serie.videos = obj.videos
        return serie;*/ 