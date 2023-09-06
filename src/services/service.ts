import { API_KEY } from "../../secrets";
import { IModelBase } from "../models/base";


export abstract class ServicoBase {

    protected abstract mapearObjeto(obj: any): IModelBase;


    private async fetchTMDB(endpoint: string, idioma = 'pt-BR', append_to_response?: string) {
        const apiUrl = `https://api.themoviedb.org/3/${endpoint}?language=${idioma}${append_to_response}'`;

        const apiKey = API_KEY;

        return await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'accept': 'application/json',
            },

        });

    }

    protected async obterListagem(endpoint: string): Promise<IModelBase[]> {

        const resposta = await this.fetchTMDB(endpoint);

        if (resposta.ok) {
            const obj = await resposta.json();

            return this.mapearListaObjeto(obj);
        }
        else {
            throw new Error("Ocorreu um erro ao efetuar sua solicitação" + `Erro:${resposta.status}`);
        }
    }

    public async obterPorId(endpoint: string): Promise<IModelBase> {

        const resposta = await this.fetchTMDB(`${endpoint}`, 'pt-BR', '&append_to_response=videos,images,credits');

        if (resposta.ok) {
            const obj = await resposta.json();

            console.log(obj)

            return this.mapearObjeto(obj);
        }
        else {
            throw new Error("Ocorreu um erro ao efetuar sua solicitação" + `Erro:${resposta.status}`);
        }
    }

    protected mapearListaObjeto(obj: any): IModelBase[] {
        const models: IModelBase[] = []

        obj.results.map((res: any) => {
            const filme: IModelBase = this.mapearObjeto(res);

            models.push(filme);

        }) as IModelBase[];

        return models;
    }

}