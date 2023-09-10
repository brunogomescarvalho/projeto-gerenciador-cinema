import { API_KEY } from "../../secrets";
import { IMidia, IMidiaDetalhes } from "../models/midia";


export abstract class ServicoBase {

    protected abstract mapearMidia(obj: any): IMidia;

    protected abstract mapearBuscaPorId_DetalhesMidia(obj: any): IMidiaDetalhes;

    private async fetchTMDB(endpoint: string) {
        const apiUrl = `https://api.themoviedb.org/3/${endpoint}`;

        const apiKey = API_KEY;

        return await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'accept': 'application/json',
            },
        });
    }

    protected async obterPorId(endpoint: string): Promise<IMidiaDetalhes> {

        const resposta = await this.fetchTMDB(`${endpoint}
            ?append_to_response=images,videos,credits&language=pt-BR&include_image_language=en,null`);

        if (resposta.ok) {
            return this.mapearBuscaPorId_DetalhesMidia(await resposta.json());
        }
        throw new Error("Ocorreu um erro ao efetuar sua solicitação" + `Erro:${resposta.status}`);
    }
    

    protected async obterListagem(endpoint: string): Promise<IMidia[]> {
        const resposta = await this.fetchTMDB(endpoint);

        if (resposta.ok) {
            return this.mapearListaMidias(await resposta.json());
        }
        throw new Error("Ocorreu um erro ao efetuar sua solicitação" + `Erro:${resposta.status}`);
    }


    protected mapearListaMidias(obj: any): IMidia[] {
        return [...obj.results].map((res: any) => this.mapearMidia(res));
    }

}