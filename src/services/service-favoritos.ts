export class ServicoFavoritos {

    private obterDados() {
        return localStorage.getItem('favoritos-ApiMovies');
    }

    private saldarDados(obj: any[]) {
        localStorage.setItem('favoritos-ApiMovies', JSON.stringify(obj))
    }

    public favoritar(obj: any): void {

        const dados = this.obterDados();

        let objDados: any[] = [];

        if (dados) {
            objDados = this.atualizarDados(objDados, dados, obj);
        }
        else {
            objDados.push(obj);
        }

        this.saldarDados(objDados);
    }

    private atualizarDados(objDados: any[], dados: string, obj: any) {
        objDados = JSON.parse(dados) as any[];

        let index = objDados.findIndex(x => x.id == obj.id)
        if (index != -1) {
            objDados.splice(index, 1)
        }
        else {
            objDados.push(obj);
        }
        return objDados;
    }

    verificarFavorito(objeto: any): boolean {
        const dados = this.obterDados();

        let listaFavoritos = dados ? JSON.parse(dados) : [];

        console.log(listaFavoritos)

        return listaFavoritos.find((x: any) => x.id == objeto.id) as boolean;
    }

    public listarFavoritos(): any {

        const dados = this.obterDados();

        if (dados)

            return JSON.parse(dados) as any[];

        else return null;
    }


}