import 'bootstrap'
import './home.css'

class TelaHome {

    input: HTMLInputElement;
    btnPesquisar: HTMLButtonElement;

    constructor() {
        this.input = document.getElementById('input') as HTMLInputElement;
        this.btnPesquisar = document.getElementById('btnPesquisar') as HTMLButtonElement;
        this.incluirEventos();
    }

    private incluirEventos() {
        this.btnPesquisar.addEventListener('click', (event) => this.pesquisar(event));
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

window.addEventListener('load', () => new TelaHome())