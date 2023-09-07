import { API_KEY } from "../../secrets";
import { IMidia, IMidiaDetalhes } from "../models/midia";


export abstract class ServicoBase {

    protected abstract mapearMidia(obj: any): IMidia;

    protected abstract mapearBuscaPorId_DetalhesMidia(obj: any): IMidiaDetalhes

    private async fetchTMDB(endpoint: string, append = '?language=pt-BR') {
        const apiUrl = `https://api.themoviedb.org/3/${endpoint}${append}`;

        const apiKey = API_KEY;

        return await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'accept': 'application/json',
            },

        });

    }

    protected async obterListagemPorCategoria(endpoint: string): Promise<IMidia[]> {

        const resposta = await this.fetchTMDB(endpoint);

        if (resposta.ok) {
            const obj = await resposta.json();

            return this.mapearListaMidias(obj);
        }
        else {
            throw new Error("Ocorreu um erro ao efetuar sua solicitação" + `Erro:${resposta.status}`);
        }
    }

    public async obterPorId(endpoint: string): Promise<IMidiaDetalhes> {

        const resposta = await this.fetchTMDB(`${endpoint}`, '?append_to_response=images,videos,credits&language=pt-BR&include_image_language=en,null');

        if (resposta.ok) {
            const obj = await resposta.json();

            console.log(obj)

            return this.mapearBuscaPorId_DetalhesMidia(obj);
        }
        else {
            throw new Error("Ocorreu um erro ao efetuar sua solicitação" + `Erro:${resposta.status}`);
        }
    }

    protected async obterListagemPorGenero(parametro: string, tipoMidia: string) {
        let endpoint = `search/multi`;
        let append = `?query=${parametro}&language=pt-br`;

        const resposta = await this.fetchTMDB(endpoint, append);

        if (resposta.ok) {
            const obj = await resposta.json() as any;

            console.log(obj);
            const listaMidias = { results: obj.results.filter((x: any) => x.media_type == tipoMidia) }

            return this.mapearListaMidias(listaMidias);
        }
        else {
            throw new Error("Ocorreu um erro ao efetuar sua solicitação" + `Erro:${resposta.status}`);
        }


    }

    protected mapearListaMidias(obj: any): IMidia[] {
        const midias: IMidia[] = []

        obj.results.map((res: any) => {
            const filme: IMidia = this.mapearMidia(res);

            midias.push(filme);

        }) as IMidia[];

        return midias;
    }

}