import './pessoa.css'
import { IMidia } from "../../models/midia";
import { IPessoa } from "../../models/pessoa";
import { ServicoPessoas } from "../../services/service-pessoas";
import { TelaBase } from "../midia/base";


export class TelaPessoas extends TelaBase {

    servicoPessoa: ServicoPessoas
    input: HTMLInputElement;
    btnPesquisar: HTMLButtonElement;
    nome: HTMLElement;
    local: HTMLElement;
    biografia: HTMLElement;
    img: HTMLImageElement;

    constructor() {
        super()

        this.inicializarPropriedades();
        const url = new URLSearchParams(window.location.search);
        const id = url.get('id') as string;
        this.buscarPessoa(id);
    }


    private inicializarPropriedades() {
        this.servicoPessoa = new ServicoPessoas();
        this.input = document.getElementById('input') as HTMLInputElement;
        this.btnPesquisar = document.getElementById('btnPesquisar') as HTMLButtonElement;
        this.nome = document.getElementById('nome') as HTMLElement;
        this.local = document.getElementById('localNascimento') as HTMLElement;
        this.biografia = document.getElementById('biografia') as HTMLElement;
        this.img = document.getElementById('img01') as HTMLImageElement;
        this.divConteudo = document.getElementById('midias') as HTMLDivElement;
        this.btnPesquisar.addEventListener('click', (event) => this.pesquisar(event))
    }

    private async buscarPessoa(id: string) {
        try {
            const pessoa = await this.servicoPessoa.obterPessoaPorId(id);

            this.renderizar(pessoa)

        } catch (error) {
            console.log(error)
        }
    }

    private renderizar(pessoa: IPessoa) {

        this.gerarDadosPessoais(pessoa);

        this.gerarCardsFilmes(pessoa);

    }


    private async gerarCardsFilmes(pessoa: IPessoa) {

        const dados = pessoa.obras.cast as any[];

        const obras = dados.filter(x => x.backdrop_path && x.overview);

        let midias: IMidia[] = [];

        for (let i = 0; i < obras.length; i++) {
            const midia = this.mapearMidias(obras[i]);
            midias.push(midia);
        }

        await this.gerarCards(midias, 'Obras');
    }

    private gerarDadosPessoais(pessoa: IPessoa) {

        this.nome.innerText = pessoa.nome;

        this.local.innerText = `${(pessoa.localNascimento ? pessoa.localNascimento : '')} - ${(pessoa.dataNascimento ? this.formatarData(pessoa.dataNascimento) : '')}`;

        this.biografia.innerText = `${(pessoa.biografia ? pessoa.biografia : 'Sem informações disponíveis')}`;

        let imagem = pessoa.imagem ? pessoa.imagem : pessoa.obras.cast[0].backdrop_path;

        this.img.src = `https://image.tmdb.org/t/p/w185${imagem}`;
    }

    private formatarData(dataNascimento: string): string {
        const dataArray = dataNascimento.split("-") as string[];
        return `${dataArray[2]}/${dataArray[1]}/${dataArray[0]}`;
    }

    private mapearMidias(obra: any): IMidia {
        return {
            id: obra.id,
            nome: obra.title ? obra.title : obra.name,
            avaliacao: obra.avaliacao,
            data: obra.first_air_date ? obra.first_air_date : obra.release_date,
            imagem: obra.poster_path,
            resumo: obra.overview,
            tipo: obra.first_air_date ? 'tv' : 'movie'
        } as IMidia;
    }

    public pesquisar(event: Event): any {
        event.preventDefault()
        window.location.href = this.construirUrl()
    }

    private construirUrl() {
        const query = this.input.value.split(" ").join("-");
        return `midia.html?tag=search/multi&query=${query}`
    }
}


window.addEventListener('load', () => new TelaPessoas())