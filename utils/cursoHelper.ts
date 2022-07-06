import { CursoSubTipoGraduacao, CursoSubTipoPosGraduacao, CursoTipo } from '~/src/aplicacao/cursos/entidade/curso'

export const tiposLegiveis = {
  [CursoTipo.GRADUACAO]: 'Graduação',
  [CursoTipo.POS_GRADUACAO]: 'Pós-graduação'
}

export const subtiposLegiveis = {
  [CursoSubTipoGraduacao.BACHARELADO]: 'Bacharelado',
  [CursoSubTipoGraduacao.LICENCIATURA]: 'Licenciatura',
  [CursoSubTipoGraduacao.TECNOLOGO]: 'Tecnólogo',
  [CursoSubTipoPosGraduacao.DOUTURADO]: 'Doutorado',
  [CursoSubTipoPosGraduacao.ESPECIALIZACAO]: 'Especialização',
  [CursoSubTipoPosGraduacao.MBA]: 'MBA',
  [CursoSubTipoPosGraduacao.MESTRADO]: 'Mestrado',
  [CursoSubTipoPosGraduacao.POS_DOUTORADO]: 'Pós-doutorado'
}
