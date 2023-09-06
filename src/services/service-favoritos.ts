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

        let existe = objDados.find(x => x.id == obj.id) as boolean;
        if (existe)
            objDados.splice(obj, 1);
        else {
            objDados.push(obj);
        }
        return objDados;
    }

    public existe(obj: any): boolean {
        let dados = this.obterDados();
        let listaFavoritos: any[] = []
        if (dados)
            listaFavoritos = JSON.parse(dados);

        return listaFavoritos.find(x => x.id == obj.id) as boolean;
    }

    public listarFavoritos(): any {

        const dados = this.obterDados();

        if (dados)

            return JSON.parse(dados) as any[];

        else return null;
    }


}