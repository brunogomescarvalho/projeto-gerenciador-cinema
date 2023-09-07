export interface IMidia {
    id: number,
    tipo: string,
    nome: string,
    data: string,
    imagem: string,
    avaliacao: number,
    resumo: string,
}

export interface IMidiaDetalhes extends IMidia {
    imagens: any[],
    videos:any,
    generos: any[],
    creditos: any[]
}
