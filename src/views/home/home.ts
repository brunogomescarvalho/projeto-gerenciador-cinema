import 'bootstrap'
import './home.css'
import { IMidia } from '../../models/midia';
import { ServicoMidia } from '../../services/servico-midia';

class TelaHome {

    input: HTMLInputElement;
    servicoMidia: ServicoMidia;
    btnPesquisar: HTMLButtonElement;
    filmesJaIncluidos: string[] = [];
    container: HTMLDivElement;

    constructor() {
        this.input = document.getElementById('input') as HTMLInputElement;
        this.btnPesquisar = document.getElementById('btnPesquisar') as HTMLButtonElement;
        this.container = document.getElementById('conteudo') as HTMLDivElement;
        this.servicoMidia = new ServicoMidia();
        this.incluirEventos();
        this.buscarDados();
    }
    private async buscarDados() {

        const [Populares,
            Acao,
            Aventura,
            Animacao,
            Comedia,
            Romance,
            FiccaoCientifica,
            Suspense] = await Promise.all([
                this.servicoMidia.obterMidiaPorCategoria('movie/popular'),
                this.servicoMidia.obterMidiaPorGeneros('28'),
                this.servicoMidia.obterMidiaPorGeneros('12'),
                this.servicoMidia.obterMidiaPorGeneros('16'),
                this.servicoMidia.obterMidiaPorGeneros('35'),
                this.servicoMidia.obterMidiaPorGeneros('10749'),
                this.servicoMidia.obterMidiaPorGeneros('878'),
                this.servicoMidia.obterMidiaPorGeneros('9648')])

        await this.criarItensGrid(Populares, "Novidades");
        await this.criarItensGrid(Acao, "Ação");
        await this.criarItensGrid(Aventura, "Aventura");
        await this.criarItensGrid(Animacao, "Animação");
        await this.criarItensGrid(Comedia, "Comédia");
        await this.criarItensGrid(Romance, "Romance");
        await this.criarItensGrid(FiccaoCientifica, "Ficção Ciêntifica");
        await this.criarItensGrid(Suspense, "Suspense");
    }

    public pesquisar(event: Event): any {
        event.preventDefault()
        window.location.href = this.construirUrl()
    }

    private incluirEventos() {
        this.btnPesquisar.addEventListener('click', (event) => this.pesquisar(event));
    }

    private construirUrl() {
        const query = this.input.value.split(" ").join("-");
        return `midia.html?tag=search/multi&query=${query}`
    }

    private async criarItensGrid(midias: IMidia[], genero: string) {

        const categoria = document.createElement('h2') as HTMLElement;
        categoria.classList.add('text-center', 'fs-4', 'fw-normal', 'mt-3')
        categoria.textContent = genero
        this.container.appendChild(categoria)

        midias = midias.filter(x => !this.filmesJaIncluidos.includes(String(x.id)))

        const midiasParaIncluir = midias.slice(0, 6);

        const grid = document.createElement('div') as HTMLDivElement;
        grid.classList.add('row', 'd-flex', 'flex-row');

        midiasParaIncluir.map((x: IMidia) => {

            const divCard = document.createElement('div');
            divCard.classList.add('col-xl-2', 'col-lg-2', 'col-md-4', 'col-sm-4', 'col-6');
            grid.appendChild(divCard);

            const imagem = document.createElement('img');
            imagem.addEventListener('click', () => window.location.href = `detalhes.html?id=${x.id}&tag=${x.tipo}`);
            imagem.classList.add('img-thumbnail', 'imagem');
            imagem.src = `https://image.tmdb.org/t/p/original${x.imagem}`;
            imagem.id = x.id.toString();

            divCard.appendChild(imagem);
            this.filmesJaIncluidos.push(imagem.id);

        });

        this.container.appendChild(grid);
    }
}

window.addEventListener('load', () => new TelaHome())

