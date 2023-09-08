import 'bootstrap'
import './home.css'

class TelaHome {

    btnFilmes: HTMLButtonElement;
    btnSeries: HTMLButtonElement;
    input: HTMLInputElement;

    constructor() {

        this.btnFilmes = document.getElementById('btnFilmes') as HTMLButtonElement;
        this.btnSeries = document.getElementById('btnSeries') as HTMLButtonElement;
        this.input = document.getElementById('input') as HTMLInputElement;

        this.atribuirEventos();

    }
    private atribuirEventos() {
        this.btnFilmes.addEventListener('click', (event: Event) => this.pesquisar(event));
        this.btnSeries.addEventListener('click', (event: Event) => this.pesquisar(event));
    }

    private pesquisar(event: Event): any {
        event.preventDefault()
        const button = event.target as HTMLButtonElement;
        window.location.href = this.construirUrl(button)
    }

    private construirUrl(button: HTMLButtonElement) {
        let url = button.name == 'tv' ? 'series.html' : 'filmes.html'

        const endereco = {
            url: url,
            query: this.input.value.split(" ").join("-"),
        }
        return `${endereco.url}?tag=search/multi&query=${endereco.query}`
    }



}

window.addEventListener('load', () => new TelaHome())