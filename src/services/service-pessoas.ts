import { API_KEY } from "../../secrets";
import { IPessoa } from "../models/pessoa";

export class ServicoPessoas {

    private async fetchTMDB(endpoint: string, append = '?append_to_response=credits,images&language=pt-BR') {
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

    public async obterPessoaPorId(id: string) {
        let resposta = await this.fetchTMDB(`person/${id}`);

        if (resposta.ok) {
            let objeto = await resposta.json() as any;

            return this.mapearPessoa(objeto);
        }
        throw new Error("Ocorreu um erro ao efetuar sua solicitação" + `Erro:${resposta.status}`);
    }

    private mapearPessoa(obj: any) {
        return {
            localNascimento: obj.place_of_birth,
            imagem: obj.profile_path,
            imagensProfiles: obj.images.profiles,
            obras: obj.credits,
            biografia: obj.biography,
            dataNascimento: obj.birthday,
            dataFalecimento: obj.deathday,
            id: obj.id,
            nome: obj.name,
        } as IPessoa;
    }


}