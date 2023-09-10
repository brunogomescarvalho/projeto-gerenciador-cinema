export class ServicoLocalStorage {

    private obterDados(): string | null {
        return localStorage.getItem('favoritos-ApiMovies');
    }

    private salvarDados(obj: any[]): void {
        localStorage.setItem('favoritos-ApiMovies', JSON.stringify(obj))
    }

    public favoritar(obj: any): void {

        let listaFavoritos = this.listarFavoritos() as any[];

        let index = listaFavoritos.findIndex(x => x.id == obj.id);

        if (index != -1) {
            listaFavoritos.splice(index, 1)
        }
        else {
            listaFavoritos.push(obj)
        }

        this.salvarDados(listaFavoritos)

    }


    public verificarFavorito(objeto: any): boolean {

        const dados = this.obterDados();

        let listaFavoritos = dados ? JSON.parse(dados) : [];

        return listaFavoritos.find((x: any) => x.id == objeto.id) as boolean;
    }

    public listarFavoritos(): any[] | [] {

        const dados = this.obterDados();

        return dados ? JSON.parse(dados) as any[] : []

    }

}