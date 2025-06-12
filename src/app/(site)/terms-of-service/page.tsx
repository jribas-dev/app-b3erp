import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos e Condições de Uso - B3ERP",
  description:
    "Termos e Condições de Uso do B3ERP - Software Integrado de Gestão Empresarial",
};

export default function TermsOfService() {
  return (
    <div className="min-h-full bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-card shadow-lg rounded-lg p-8 border">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              TERMOS E CONDIÇÕES DE USO
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              3B3 SISTEMAS E CONSULTORIA - B3ERP
            </p>
            <p className="text-sm text-muted-foreground/80 mt-2">
              Última atualização: {new Date().toLocaleDateString("pt-BR")}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                1. DEFINIÇÕES E IDENTIFICAÇÃO
              </h2>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Os presentes Termos e Condições de Uso regulam a utilização do
                  software
                  <strong className="text-foreground"> B3ERP</strong>,
                  desenvolvido e licenciado pela
                  <strong className="text-foreground">
                    {" "}
                    3B3 SISTEMAS E CONSULTORIA
                  </strong>
                  , pessoa jurídica inscrita no CNPJ 23.281.549/0001-05, com
                  sede em Ribeirão Preto, São Paulo.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2 text-foreground">
                    Definições:
                  </h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>
                      <strong className="text-foreground">B3ERP:</strong>{" "}
                      Software integrado de gestão empresarial
                    </li>
                    <li>
                      <strong className="text-foreground">Licenciante:</strong>{" "}
                      3B3 Sistemas e Consultoria
                    </li>
                    <li>
                      <strong className="text-foreground">Licenciado:</strong>{" "}
                      Pessoa física ou jurídica contratante
                    </li>
                    <li>
                      <strong className="text-foreground">Sistema:</strong>{" "}
                      Conjunto de módulos do B3ERP
                    </li>
                    <li>
                      <strong className="text-foreground">Legados*:</strong>{" "}
                      SINGRA / SIGA / DDRInfo / SIGA Genisi / respectivos
                      módulos
                    </li>
                    <li className="text-muted-foreground text-xs">
                      * Sistemas que foram descontinuados, mas ainda possuem
                      clientes ativos.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                2. ACEITAÇÃO DOS TERMOS
              </h2>
              <p className="mb-3 text-muted-foreground">
                Ao utilizar o B3ERP, você concorda integralmente com estes
                Termos e Condições. Caso não concorde com qualquer disposição,
                deve cessar imediatamente o uso do sistema.
              </p>
              <p className="text-muted-foreground">
                O uso continuado do sistema após alterações nos Termos constitui
                aceitação das modificações realizadas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                3. LICENÇA DE USO
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-secondary-foreground mb-2">
                    3.1 Concessão da Licença
                  </h3>
                  <p className="text-muted-foreground">
                    A 3B3 Sistemas concede ao Licenciado uma licença não
                    exclusiva, intransferível e revogável para uso do B3ERP,
                    limitada ao ambiente operacional definido no contrato de
                    cessão de direito de uso.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-secondary-foreground mb-2">
                    3.2 Restrições de Uso
                  </h3>
                  <p className="mb-2 text-muted-foreground">
                    É expressamente vedado ao usuário:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>
                      Fazer engenharia reversa, descompilar ou desmontar o
                      software
                    </li>
                    <li>Reproduzir, distribuir ou comercializar o sistema</li>
                    <li>
                      Remover ou alterar avisos de propriedade intelectual
                    </li>
                    <li>
                      Usar o sistema para finalidades ilegais ou não autorizadas
                    </li>
                    <li>Tentar contornar medidas de segurança do sistema</li>
                    <li>
                      Compartilhar credenciais de acesso com terceiros não
                      autorizados
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-secondary-foreground mb-2">
                    3.3 Propriedade Intelectual
                  </h3>
                  <p className="text-muted-foreground">
                    O B3ERP, incluindo seu código-fonte, documentação, interface
                    e funcionalidades, é propriedade exclusiva da 3B3 Sistemas,
                    protegido por direitos autorais e outras leis de propriedade
                    intelectual.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                4. MÓDULOS E FUNCIONALIDADES
              </h2>
              <p className="mb-3 text-muted-foreground">
                O B3ERP é composto pelos seguintes módulos principais:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-secondary-foreground mb-2">
                    Módulos Operacionais
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Cadastros Básicos</li>
                    <li>• Vendas e Faturamento</li>
                    <li>• Ordem de Serviços</li>
                    <li>• Carga / Entrega</li>
                    <li>• Gestão de Compras</li>
                    <li>• Controle de Estoque</li>
                    <li>• Gestão de Produção</li>
                    <li>• Gestão Financeira</li>
                    <li>• SPED Fiscal</li>
                  </ul>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-secondary-foreground mb-2">
                    Módulos Auxiliares
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• CRM (Customer Relationship Management)</li>
                    <li>• Emissão Fiscal (NFe, NFCe, NFSe, CFe, CTe, MDFe)</li>
                    <li>• Relatórios Gerenciais</li>
                    <li>• Dashboard Gerencial</li>
                    <li>• Gestão de Agenda</li>
                    <li>• Exportação de Dados Power BI</li>
                    <li>• Controle de Segurança</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                5. RESPONSABILIDADES DO USUÁRIO
              </h2>
              <div className="space-y-3">
                <p className="mb-3 text-muted-foreground">
                  O usuário compromete-se a:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>
                    Utilizar o sistema de forma lícita e em conformidade com a
                    legislação
                  </li>
                  <li>
                    Manter a confidencialidade de suas credenciais de acesso
                  </li>
                  <li>
                    Reportar imediatamente qualquer uso não autorizado de sua
                    conta
                  </li>
                  <li>Manter seus dados atualizados e precisos</li>
                  <li>
                    Informar problemas técnicos através dos canais oficiais de
                    suporte
                  </li>
                  <li>
                    Pagar pontualmente as taxas de licenciamento e manutenção
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                6. SUPORTE TÉCNICO E MANUTENÇÃO
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-secondary-foreground mb-2">
                    6.1 Horário de Atendimento
                  </h3>
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <p className="text-foreground mb-2">
                      <strong>Segunda a Sexta-feira:</strong>
                    </p>
                    <p className="text-muted-foreground">
                      • Manhã: 08:30h às 12:30h
                    </p>
                    <p className="text-muted-foreground">
                      • Tarde: 14:00h às 18:30h
                    </p>
                    <p className="text-sm mt-2 text-muted-foreground/80">
                      Exceto feriados nacionais, estaduais e municipais
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-secondary-foreground mb-2">
                    6.2 Níveis de Prioridade
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>
                      <strong className="text-foreground">Prioridade 1:</strong>{" "}
                      Atendimento em até 4 horas
                    </li>
                    <li>
                      <strong className="text-foreground">Prioridade 2:</strong>{" "}
                      Atendimento em até 24 horas
                    </li>
                    <li>
                      <strong className="text-foreground">Prioridade 3:</strong>{" "}
                      Atendimento em até 48 horas
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-secondary-foreground mb-2">
                    6.3 Canais de Suporte
                  </h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Portal Web: <Link href="http://3b3.com.br/suporte" className="text-primary" target="_blank">http://3b3.com.br/suporte</Link></li>
                    <li className="flex gap-2 items-center">• WhatsApp Oficial: <Link href="https://wa.link/r5v6tn" className="text-primary" target="_blank">clique aqui</Link></li>
                    <li>• E-mail: <Link href="mailto:suporte@3b3.com.br" className="text-primary">suporte@3b3.com.br</Link></li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                7. LIMITAÇÕES E ISENÇÕES
              </h2>
              <div className="space-y-3">
                <p className="mb-3 text-muted-foreground">
                  A 3B3 Sistemas não se responsabiliza por:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Danos decorrentes de uso inadequado do sistema</li>
                  <li>
                    Perdas de dados por falhas não atribuíveis ao software
                  </li>
                  <li>
                    Interrupções causadas por problemas de conectividade do
                    cliente
                  </li>
                  <li>
                    Incompatibilidade com softwares ou hardwares de terceiros
                  </li>
                  <li>Alterações não autorizadas realizadas pelo usuário</li>
                  <li>
                    Descumprimento de obrigações fiscais ou legais pelo usuário
                  </li>
                </ul>

                <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-400 dark:border-amber-600 p-4 mt-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Importante:</strong> O sistema deve ser utilizado
                    apenas para finalidades lícitas. O usuário é integralmente
                    responsável pelo cumprimento da legislação aplicável ao seu
                    negócio.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                8. PAGAMENTOS E INADIMPLEMENTO
              </h2>
              <div className="space-y-3">
                <p className="mb-3 text-muted-foreground">
                  Os valores devem ser pagos nas datas estabelecidas no contrato
                  de licenciamento.
                </p>
                <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-400 dark:border-red-600 p-4">
                  <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">
                    Consequências do Atraso:
                  </h4>
                  <ul className="text-sm space-y-1 text-red-600 dark:text-red-400">
                    <li>• Juros de 0,33% ao dia</li>
                    <li>• Multa de 10% referente a bonificação concedida</li>
                    <li>• Suspensão dos serviços após 30 dias de atraso</li>
                    <li>• Bloqueio da chave de liberação mensal do sistema</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                9. PRAZO E RESCISÃO
              </h2>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  O contrato tem prazo inicial de 12 meses, renovando-se
                  automaticamente por prazo indeterminado, salvo manifestação
                  contrária de qualquer das partes.
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Rescisão:</strong>{" "}
                  Qualquer parte pode rescindir com aviso prévio de 90 dias. A
                  rescisão implica na cessação imediata dos serviços e remoção
                  do sistema dos equipamentos do cliente.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                10. PROTEÇÃO DE DADOS
              </h2>
              <p className="mb-3 text-muted-foreground">
                O tratamento de dados pessoais segue nossa{" "}
                <Link href="/privacy-policy" className="text-primary">
                  Política de Privacidade
                </Link>
                , em conformidade com a LGPD. Destacamos:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Backups diários automatizados com replicação em nuvem</li>
                <li>Medidas de segurança técnica e administrativa</li>
                <li>Acesso restrito a dados mediante autenticação</li>
                <li>Compromisso com a confidencialidade das informações</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                11. ATUALIZAÇÕES DOS TERMOS
              </h2>
              <p className="text-muted-foreground">
                Estes Termos podem ser atualizados periodicamente. Alterações
                significativas serão comunicadas através dos canais oficiais com
                antecedência mínima de 30 dias. O uso continuado após as
                alterações constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                12. LEGISLAÇÃO E FORO
              </h2>
              <p className="mb-3 text-muted-foreground">
                Estes Termos são regidos pela legislação brasileira,
                especialmente:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Código Civil Brasileiro (Lei nº 10.406/2002)</li>
                <li>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</li>
                <li>Marco Civil da Internet (Lei nº 12.965/2014)</li>
                <li>Código de Defesa do Consumidor (quando aplicável)</li>
              </ul>
              <p className="mt-3 text-muted-foreground">
                <strong className="text-foreground">Foro:</strong> Fica eleito o
                foro de Ribeirão Preto - SP para dirimir quaisquer controvérsias
                decorrentes destes Termos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                13. CONTATO
              </h2>
              <p className="mb-3 text-muted-foreground">
                Para dúvidas sobre estes Termos ou questões relacionadas ao uso
                do B3ERP, entre em contato conosco:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg border">
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">E-mail:</strong>{" "}
                    <Link href="mailto:suporte@3b3.com.br" className="text-primary">suporte@3b3.com.br</Link>
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Portal de Suporte:
                    </strong>{" "}
                    <Link href="http://3b3.com.br/suporte" className="text-primary" target="_blank">http://3b3.com.br/suporte</Link>
                  </li>
                  <li>
                    <strong className="text-foreground">WhatsApp:</strong>{" "}
                    <Link href="https://wa.link/r5v6tn" className="text-primary" target="_blank">clique aqui</Link>
                  </li>
                  <li>
                    <strong className="text-foreground">Endereço:</strong>{" "}
                    Ribeirão Preto, São Paulo
                  </li>
                  <li>
                    <strong className="text-foreground">CNPJ:</strong>{" "}
                    23.281.549/0001-05
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                14. DISPOSIÇÕES FINAIS
              </h2>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Estes Termos constituem o acordo integral entre as partes
                  sobre o uso do B3ERP, prevalecendo sobre quaisquer acordos
                  anteriores sobre o mesmo objeto.
                </p>
                <p className="text-muted-foreground">
                  A eventual invalidade de qualquer cláusula não prejudica a
                  validade das demais disposições.
                </p>
                <p className="text-muted-foreground">
                  A tolerância quanto ao descumprimento de qualquer condição não
                  implica renúncia ao direito de exigi-la no futuro.
                </p>
              </div>
            </section>

            <section className="bg-muted/30 p-6 rounded-lg mt-8 border">
              <div className="text-center">
                <h3 className="font-bold text-lg text-foreground mb-4">
                  DECLARAÇÃO DE ACEITE
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ao utilizar o sistema B3ERP, você declara ter lido,
                  compreendido e concordado integralmente com estes Termos e
                  Condições de Uso.
                </p>
                <div className="border-t border-border pt-4 mt-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">
                      3B3 SISTEMAS E CONSULTORIA
                    </strong>
                    <br />
                    CNPJ: 23.281.549/0001-05
                    <br />
                    Ribeirão Preto, São Paulo
                    <br />
                    Data da última atualização:{" "}
                    {new Date().toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
