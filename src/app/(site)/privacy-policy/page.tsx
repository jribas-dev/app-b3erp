import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade - B3ERP",
  description:
    "Política de Privacidade do B3ERP - Software Integrado de Gestão Empresarial",
};

export default function TermsOfUsePage() {
  return (
    <div className="min-h-full bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-card shadow-lg rounded-lg p-8 border">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              POLÍTICA DE PRIVACIDADE
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
                1. IDENTIFICAÇÃO DO CONTROLADOR
              </h2>
              <p className="mb-4 text-muted-foreground">
                A presente Política de Privacidade é aplicável aos serviços
                prestados pela
                <strong className="text-foreground">
                  {" "}
                  3B3 SISTEMAS E CONSULTORIA
                </strong>
                , pessoa jurídica de direito privado, inscrita no CNPJ sob o nº
                23.281.549/0001-05, com sede em Ribeirão Preto, São Paulo,
                doravante denominada{" "}
                <strong className="text-foreground">
                  &quot;Controladora&quot;
                </strong>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                2. SOBRE ESTA POLÍTICA
              </h2>
              <p className="mb-4 text-muted-foreground">
                Esta Política de Privacidade tem por objetivo esclarecer como a
                3B3 Sistemas coleta, usa, armazena e protege os dados pessoais
                dos usuários do sistema B3ERP, em conformidade com a Lei Geral
                de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD) e
                demais normas aplicáveis.
              </p>
              <p className="text-muted-foreground">
                Ao utilizar nossos serviços, você concorda com os termos desta
                Política de Privacidade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                3. DADOS COLETADOS
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-secondary-foreground mb-2">
                    3.1 Dados de Identificação
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Nome completo e razão social</li>
                    <li>CPF/CNPJ e Inscrição Estadual</li>
                    <li>Endereço completo</li>
                    <li>Telefone e e-mail</li>
                    <li>Dados bancários para cobrança</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-secondary-foreground mb-2">
                    3.2 Dados Operacionais
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Informações de acesso ao sistema (logs de login)</li>
                    <li>Dados de uso dos módulos do B3ERP</li>
                    <li>Informações técnicas do ambiente computacional</li>
                    <li>Backups automáticos dos dados empresariais</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-secondary-foreground mb-2">
                    3.3 Dados Empresariais
                  </h3>
                  <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                    <li>Dados financeiros (contas a pagar/receber)</li>
                    <li>Informações fiscais e tributárias</li>
                    <li>Dados de estoque e produção</li>
                    <li>
                      Informações de vendas e relacionamento com clientes (CRM)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                4. FINALIDADES DO TRATAMENTO
              </h2>
              <p className="mb-3 text-muted-foreground">
                Os dados pessoais são tratados para as seguintes finalidades:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>
                  Execução do contrato de cessão de direito de uso do software
                  B3ERP
                </li>
                <li>Prestação de serviços de suporte técnico e manutenção</li>
                <li>
                  Realização de backups e garantia da continuidade dos serviços
                </li>
                <li>Cumprimento de obrigações legais e regulatórias</li>
                <li>Comunicação sobre atualizações e melhorias do sistema</li>
                <li>Cobrança de valores devidos</li>
                <li>
                  Defesa de direitos em processos judiciais ou administrativos
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                5. BASE LEGAL
              </h2>
              <p className="mb-3 text-muted-foreground">
                O tratamento de dados pessoais fundamenta-se nas seguintes bases
                legais:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>
                  <strong className="text-foreground">
                    Execução de contrato:
                  </strong>{" "}
                  Art. 7º, V da LGPD
                </li>
                <li>
                  <strong className="text-foreground">
                    Cumprimento de obrigação legal:
                  </strong>{" "}
                  Art. 7º, II da LGPD
                </li>
                <li>
                  <strong className="text-foreground">
                    Exercício regular de direitos:
                  </strong>{" "}
                  Art. 7º, VI da LGPD
                </li>
                <li>
                  <strong className="text-foreground">
                    Legítimo interesse:
                  </strong>{" "}
                  Art. 7º, IX da LGPD (para melhorias do sistema)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                6. COMPARTILHAMENTO DE DADOS
              </h2>
              <p className="mb-3 text-muted-foreground">
                Os dados pessoais poderão ser compartilhados apenas nas
                seguintes situações:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Com autoridades competentes, quando exigido por lei</li>
                <li>
                  Com prestadores de serviços terceirizados (ex: serviços de
                  nuvem para backup)
                </li>
                <li>
                  Em caso de transferência de controle societário, mediante
                  prévia comunicação
                </li>
                <li>
                  Para defesa de direitos da empresa em processos judiciais
                </li>
              </ul>
              <p className="mt-3 text-muted-foreground">
                <strong className="text-foreground">Importante:</strong> Não
                vendemos, alugamos ou comercializamos dados pessoais.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                7. ARMAZENAMENTO E SEGURANÇA
              </h2>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">
                    Prazo de Armazenamento:
                  </strong>{" "}
                  Os dados são mantidos pelo período necessário ao cumprimento
                  das finalidades descritas ou conforme exigido por lei.
                </p>
                <p className="text-muted-foreground">
                  <strong className="text-foreground">
                    Medidas de Segurança:
                  </strong>
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>Backups diários automatizados com replicação em nuvem</li>
                  <li>Criptografia de dados sensíveis</li>
                  <li>Controle de acesso por usuário e perfil</li>
                  <li>Monitoramento de logs de acesso</li>
                  <li>Servidores com certificação de segurança</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                8. DIREITOS DOS TITULARES
              </h2>
              <p className="mb-3 text-muted-foreground">
                Conforme a LGPD, você possui os seguintes direitos sobre seus
                dados pessoais:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Confirmação da existência de tratamento</li>
                <li>Acesso aos dados</li>
                <li>
                  Correção de dados incompletos, inexatos ou desatualizados
                </li>
                <li>Anonimização, bloqueio ou eliminação (quando aplicável)</li>
                <li>Portabilidade dos dados</li>
                <li>Eliminação dos dados (quando aplicável)</li>
                <li>Informação sobre compartilhamento</li>
                <li>Revogação do consentimento (quando aplicável)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                9. CANAL DE COMUNICAÇÃO
              </h2>
              <p className="mb-3 text-muted-foreground">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta
                Política, entre em contato conosco através dos seguintes canais:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg border">
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">E-mail:</strong>{" "}
                    <Link href="mailto:suporte@3b3.com.br" className="text-primary">suporte@3b3.com.br</Link>
                  </li>
                  <li>
                    <strong className="text-foreground">WhatsApp:</strong>{" "}
                    <Link href="https://wa.link/r5v6tn" className="text-primary" target="_blank">clique aqui</Link>
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Portal de Suporte:
                    </strong>{" "}
                    <Link href="http://3b3.com.br/suporte" className="text-primary" target="_blank">http://3b3.com.br/suporte</Link>
                  </li>
                  <li>
                    <strong className="text-foreground">Endereço:</strong>{" "}
                    Ribeirão Preto, São Paulo
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                10. ALTERAÇÕES NESTA POLÍTICA
              </h2>
              <p className="text-muted-foreground">
                Esta Política de Privacidade pode ser atualizada periodicamente.
                Alterações significativas serão comunicadas através dos canais
                oficiais. Recomendamos a consulta regular desta página para
                manter-se informado sobre nossas práticas de privacidade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                11. LEGISLAÇÃO APLICÁVEL
              </h2>
              <p className="text-muted-foreground mb-3">
                Esta Política é regida pela legislação brasileira,
                especialmente:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                <li>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</li>
                <li>Marco Civil da Internet (Lei nº 12.965/2014)</li>
                <li>Código de Defesa do Consumidor (Lei nº 8.078/1990)</li>
                <li>Código Civil Brasileiro (Lei nº 10.406/2002)</li>
              </ul>
            </section>

            <section className="bg-muted/30 p-6 rounded-lg mt-8 border">
              <p className="text-center text-sm text-muted-foreground">
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
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
