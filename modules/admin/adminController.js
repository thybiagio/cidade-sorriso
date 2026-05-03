const User = require('../user/userModel');

exports.renderGerenciarMembros = async (req, res) => {
    try {
        const membros = await User.findAll({ order: [['fullName', 'ASC']] });
        
        // Definição das listas fixas para o formulário
        const unidades = ['Estrelas', 'Capivaras', 'Gatinhas', 'Camaleões', 'Raposas', 'Falcões', 'Panteras', 'Pumas', 'Elite Rosa', 'Elite'];
        
        const cargosClube = ['Desbravador', 'Conselheiro associado', 'Conselheiro', 'Instrutor', 'Capelão', 'Tesoureiro', 'Secretário', 'Diretor associado', 'Diretor', 'Pastor'];
        
        const cargosUnidade = ['Nenhum', 'Capitão', 'Secretário', 'Tesoureiro', 'Mídia', 'Capelão'];

        const classesDisponiveis = [
            "Amigo", "Amigo da Natureza", "Companheiro", "Companheiro de Excursionismo", 
            "Pesquisador", "Pesquisador de Campos e Bosques", "Pioneiro", "Pioneiro de Novas Fonteiras",
            "Excursionista", "Escursionista na Mata", "Guia", "Guia de Exploração",
            "Líder", "Líder Master", "Líder Master Avançado"
        ];

        res.render('admin/gerenciar-membros', { 
            title: 'Gerenciar Membros | Cidade Sorriso',
            membros, 
            unidades, 
            cargosClube, 
            cargosUnidade, 
            classesDisponiveis 
        });
    } catch (error) {
        console.error(error);
        res.redirect('/timeline');
    }
};

exports.atualizarMembro = async (req, res) => {
    const { id } = req.params;
    let { unidade, cargoClube, cargoUnidade, classesConcluidas } = req.body;

    try {
        // Garantir que classesConcluidas seja sempre um array, mesmo se apenas 1 for marcada
        if (!classesConcluidas) classesConcluidas = [];
        if (!Array.isArray(classesConcluidas)) classesConcluidas = [classesConcluidas];

        await User.update({
            unidade,
            cargoClube,
            cargoUnidade,
            classesConcluidas // O banco salva como JSON
        }, { where: { id } });

        req.flash('success', 'Ficha do desbravador atualizada com sucesso!');
        res.redirect('/admin/membros');
    } catch (error) {
        req.flash('error', 'Erro ao atualizar membro.');
        res.redirect('/admin/membros');
    }
};