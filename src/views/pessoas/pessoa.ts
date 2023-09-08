import './pessoa.css'
import { IMidia } from "../../models/midia";
import { IPessoa } from "../../models/pessoa";
import { ServicoPessoas } from "../../services/service-pessoas";
import { TelaBase } from "../compartilhado/base";


export class TelaPessoas extends TelaBase {

    servicoPessoa: ServicoPessoas


    constructor() {
        super()

        this.servicoPessoa = new ServicoPessoas();

        const url = new URLSearchParams(window.location.search);

        const id = url.get('id') as string;

        this.buscarPessoa(id);
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

        this.gerarCarousel(pessoa);

        this.gerarCardsFilmes(pessoa);

    }

    private gerarCarousel(pessoa: IPessoa) {
        // const carousel = document.querySelector('.carousel-inner') as HTMLDivElement;

        // const imgs = pessoa.imagensProfiles as any[];

        // for (const item of imgs) {
        //     if (item === imgs[1]) {
        //         const slide = document.createElement('div');
        //         slide.classList.add('carousel-item');

        //         const img = document.createElement('img');
        //         img.src = `https://image.tmdb.org/t/p/w500${item.file_path}`;

        //         img.classList.add('img-fluid');

        //         if (item === imgs[1]) {
        //             slide.classList.add('active');
        //         }
        //         carousel.appendChild(slide);
        //         slide.appendChild(img);
        //     }
        // }
    }



    private gerarCardsFilmes(pessoa: IPessoa) {
        this.divConteudo = document.getElementById('midias') as HTMLDivElement;

        const dados = pessoa.obras.cast as any[];

        const obras = dados.filter(x => x.backdrop_path && x.overview);

        let midias: IMidia[] = [];

        for (let i = 0; i < obras.length; i++) {
            const midia = this.mapearMidias(obras[i]);
            midias.push(midia);
        }

        this.gerarCards(midias, 'Obras');
    }

    private gerarDadosPessoais(pessoa: IPessoa) {
        const nome = document.getElementById('nome') as HTMLElement;
        const local = document.getElementById('localNascimento') as HTMLElement;
        const biografia = document.getElementById('biografia') as HTMLElement;
        const img = document.getElementById('img01') as HTMLImageElement;

        console.log(pessoa)
        nome.innerText = pessoa.nome;

        local.innerText = `${pessoa.localNascimento} - ${pessoa.dataNascimento}`;

        biografia.innerText = `${pessoa.biografia}`;

        img.src = `https://image.tmdb.org/t/p/w500${pessoa.imagem}`;
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
}


window.addEventListener('load', () => new TelaPessoas())